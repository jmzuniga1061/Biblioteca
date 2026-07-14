import { useState } from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Layout } from "antd";

const { Content } = Layout;

interface LayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Layout style={{ background: "transparent" }}>
        <Sidebar isOpen={sidebarOpen} />
        <Content style={{ padding: "24px", margin: 0, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
