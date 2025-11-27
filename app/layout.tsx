import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Student Management",
  description: "Frontend for the campus student management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="d-flex">
          <Sidebar />
          <main className="container-fluid p-4">
            {children}
          </main>
        </div>
        <Chatbot />
      </body>
    </html>
  );
}