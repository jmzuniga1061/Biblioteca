import { useState } from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} />
        <main style={{ flex: 1, padding: 16 }}>{children}</main>
      </div>
    </div>
  );
}
