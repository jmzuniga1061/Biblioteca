import { Card, List, Spin } from "antd";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/api";

export default function Users() {
  const { data, isLoading, error } = useQuery(["users"], getUsers);

  if (isLoading) {
    return (
      <Layout>
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card title="Gestión de Usuarios" style={{ margin: 16 }}>
        {error ? (
          <p style={{ color: "red" }}>No se pudo cargar la lista de usuarios.</p>
        ) : (
          <List
            dataSource={data ?? []}
            renderItem={(user: any) => (
              <List.Item>
                <List.Item.Meta
                  title={user.name}
                  description={`${user.email} — ${user.role.name}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </Layout>
  );
}
