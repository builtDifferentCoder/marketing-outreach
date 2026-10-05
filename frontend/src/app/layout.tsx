import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Outreach CRM - Agency Client Pipeline",
  description: "Internal cold outreach CRM for tracking prospects, conversations, proposals and clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col lg:flex-row antialiased">
        <ToastProvider>
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
