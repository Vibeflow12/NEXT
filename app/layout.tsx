import "./globals.css";
import type { Metadata } from "next";

import AuthProvider from "./provider/authProvider";

export const metadata: Metadata = {
  title: "Team Access control",
  description: "role-baesd access control system built with next.js and react 19",
  keywords: ["team", "access control"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-scree bg-slate-950 text-slate-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
