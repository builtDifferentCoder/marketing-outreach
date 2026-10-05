from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_crm_api():
    print("Testing Outreach CRM API...")

    # 1. Health check
    res = client.get("/")
    assert res.status_code == 200
    print("[OK] Health check passed")

    # 2. Stats
    res = client.get("/api/stats")
    assert res.status_code == 200
    stats = res.json()
    assert "total" in stats
    assert stats["total"] >= 8
    print(f"[OK] Stats returned: {stats}")

    # 3. Follow-ups due
    res = client.get("/api/follow-ups/due")
    assert res.status_code == 200
    due = res.json()
    print(f"[OK] Follow-ups due count: {len(due)}")

    # 4. Follow-ups upcoming
    res = client.get("/api/follow-ups/upcoming")
    assert res.status_code == 200
    upcoming = res.json()
    print(f"[OK] Upcoming follow-ups count: {len(upcoming)}")

    # 5. List prospects
    res = client.get("/api/prospects")
    assert res.status_code == 200
    prospects = res.json()
    assert len(prospects) >= 8
    print(f"[OK] Prospect listing passed, total: {len(prospects)}")

    # 6. Search filter
    res = client.get("/api/prospects?search=Acme")
    assert res.status_code == 200
    filtered = res.json()
    assert len(filtered) >= 1
    assert "Acme" in filtered[0]["company_name"]
    print(f"[OK] Search filter passed: found {filtered[0]['company_name']}")

    # 7. Status filter
    res = client.get("/api/prospects?status=WON")
    assert res.status_code == 200
    won_prospects = res.json()
    assert all(p["status"] == "WON" for p in won_prospects)
    print(f"[OK] Status filter passed: {len(won_prospects)} won prospects")

    # 8. Sort
    res = client.get("/api/prospects?sort=priority")
    assert res.status_code == 200
    sorted_prospects = res.json()
    print(f"[OK] Sorting by priority passed: first priority is {sorted_prospects[0]['priority']}")

    # 9. Create Prospect
    new_prospect = {
        "company_name": "Test Agency Inc",
        "website": "https://testagency.example.com",
        "company_type": "Marketing Agency",
        "owner_name": "Alex Taylor",
        "owner_title": "CEO",
        "email": "alex@testagency.example.com",
        "linkedin_url": "https://linkedin.com/in/demo-alextaylor",
        "phone": "+1 555-9999",
        "country": "United States",
        "timezone": "EST",
        "service_type": "Marketing Agency",
        "potential_need": "AI cold outreach setup",
        "source": "Apollo",
        "status": "NEW",
        "priority": "HIGH",
        "proposal_amount": 4000.0,
        "currency": "USD",
        "demo_sent": False,
        "notes": "Testing create prospect API",
    }
    res = client.post("/api/prospects", json=new_prospect)
    assert res.status_code == 201
    created = res.json()
    created_id = created["id"]
    print(f"[OK] Created prospect ID: {created_id}")

    # 10. Get Prospect by ID
    res = client.get(f"/api/prospects/{created_id}")
    assert res.status_code == 200
    assert res.json()["company_name"] == "Test Agency Inc"
    print(f"[OK] Retrieved prospect by ID passed")

    # 11. Quick action: status change
    res = client.patch(
        f"/api/prospects/{created_id}/status", json={"status": "CONTACTED"}
    )
    assert res.status_code == 200
    assert res.json()["status"] == "CONTACTED"
    print("[OK] Status patch quick action passed")

    # 12. Quick action: follow-up schedule
    res = client.patch(
        f"/api/prospects/{created_id}/follow-up",
        json={"next_follow_up_date": "2026-10-15"},
    )
    assert res.status_code == 200
    assert res.json()["next_follow_up_date"] == "2026-10-15"
    print("[OK] Follow-up patch quick action passed")

    # 13. Update prospect (PUT)
    update_payload = {
        "company_name": "Test Agency Updated",
        "proposal_amount": 5500.0,
    }
    res = client.put(f"/api/prospects/{created_id}", json=update_payload)
    assert res.status_code == 200
    assert res.json()["company_name"] == "Test Agency Updated"
    assert res.json()["proposal_amount"] == 5500.0
    print("[OK] Full update (PUT) passed")

    # 14. Delete prospect
    res = client.delete(f"/api/prospects/{created_id}")
    assert res.status_code == 204
    res = client.get(f"/api/prospects/{created_id}")
    assert res.status_code == 404
    print("[OK] Delete prospect passed")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY! :)")


if __name__ == "__main__":
    test_crm_api()
