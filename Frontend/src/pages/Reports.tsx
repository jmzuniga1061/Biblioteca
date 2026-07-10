import { Card, Row, Col, List, Spin, Typography, Alert } from "antd";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "../services/api";

const { Title, Paragraph } = Typography;

export default function Reports() {
  const { data, isLoading, error } = useQuery(["reports"], getReports);

  if (isLoading) {
    return (
      <Layout>
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card style={{ margin: 16 }}>
          <Alert message="Error al cargar los reportes" type="error" showIcon />
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 16 }}>
        <Card>
          <Title level={4}>Reportes</Title>
          <Paragraph>Visualiza las métricas principales de préstamos, usuarios y libros.</Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Préstamos por mes">
              <List
                dataSource={data?.monthly ?? []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta title={item.month} description={`Total: ${item.count}`} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Libros más prestados">
              <List
                dataSource={data?.topBooks ?? []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta title={item.title} description={`Préstamos: ${item.loanCount}`} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Usuarios más activos">
              <List
                dataSource={data?.activeUsers ?? []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={`${item.email} · ${item.roleName} · Préstamos: ${item.loanCount}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Préstamos vencidos">
              <List
                dataSource={data?.overdue ?? []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.book.title}
                      description={`Usuario: ${item.user.name} · Días de retraso: ${item.daysOverdue} · Multa: $${item.fine}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
