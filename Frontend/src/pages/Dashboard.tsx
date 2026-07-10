import { useMemo } from "react";
import { Card, Row, Col, Typography, Alert, List, Badge, Spin } from "antd";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { getBooks, getLoans } from "../services/api";

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const booksQuery = useQuery(["books"], getBooks);
  const loansQuery = useQuery(["loans"], getLoans);

  const books = booksQuery.data ?? [];
  const loans = loansQuery.data ?? [];

  const recentBooks = useMemo(() => books.slice(0, 4), [books]);

  if (booksQuery.isLoading || loansQuery.isLoading) {
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
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card>
              <Title level={4}>Resumen general</Title>
              <Paragraph>Revisa el estado de la biblioteca y los préstamos activos.</Paragraph>
              <List
                dataSource={recentBooks}
                renderItem={(book: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={book.title}
                      description={`${book.author?.name ?? "Autor desconocido"} · ${book.createdAt ? new Date(book.createdAt).getFullYear() : "Año desconocido"}`}
                    />
                    <Badge status={book.available ? "success" : "warning"} text={book.available ? "Disponible" : "Prestado"} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card>
              <Title level={4}>Indicadores</Title>
              <Paragraph>
                <strong>Libros totales:</strong> {books.length}
              </Paragraph>
              <Paragraph>
                <strong>Préstamos activos:</strong> {loans.filter((loan: any) => !loan.returnDate).length}
              </Paragraph>
              <Alert message="Los estudiantes tienen 50% de descuento en el préstamo." type="success" showIcon style={{ marginBottom: 12 }} />
              <Alert message="Clientes pueden tomar libros hasta 10 días." type="info" showIcon style={{ marginBottom: 12 }} />
              <Alert message="Solo bibliotecarios pueden agregar nuevos libros." type="warning" showIcon />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
