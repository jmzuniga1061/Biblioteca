import { useMemo, useState } from "react";
import { Card, Row, Col, Typography, Alert, Badge, Spin, Tabs, Tag, Button } from "antd";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { getBooks, getLoans, getCategories } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOutlined, RiseOutlined, StarOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// Generador de gradientes aleatorios pero consistentes según el título del libro
const getGradient = (title: string) => {
  const colors = [
    ["#ff9a9e", "#fecfef"],
    ["#a1c4fd", "#c2e9fb"],
    ["#f6d365", "#fda085"],
    ["#84fab0", "#8fd3f4"],
    ["#a6c0fe", "#f68084"],
    ["#fccb90", "#d57eeb"],
    ["#e0c3fc", "#8ec5fc"],
  ];
  const index = Math.abs(title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
  return `linear-gradient(135deg, ${colors[index][0]} 0%, ${colors[index][1]} 100%)`;
};

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 1. Libros (público)
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  // 2. Categorías (público)
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // 3. Préstamos (privado - condicional)
  const loansQuery = useQuery({
    queryKey: ["loans"],
    queryFn: getLoans,
    enabled: isAuthenticated,
  });

  const books = booksQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const loans = loansQuery.data ?? [];

  // Filtrado por categoría si se selecciona una
  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return books;
    return books.filter((b: any) => b.categoryId === selectedCategory);
  }, [books, selectedCategory]);

  // Secciones del Dashboard
  const recentBooks = useMemo(() => {
    // Ordenar por fecha de creación desc (Nuevos)
    return [...filteredBooks]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 4);
  }, [filteredBooks]);

  const popularBooks = useMemo(() => {
    // Simular populares (por ejemplo, reversa u orden alternativo)
    return [...filteredBooks].slice().reverse().slice(0, 4);
  }, [filteredBooks]);

  const suggestionBooks = useMemo(() => {
    // Sugerencias (por ejemplo, impares o salteados para dar variedad)
    return [...filteredBooks].filter((_, idx) => idx % 2 === 0).slice(0, 4);
  }, [filteredBooks]);

  if (booksQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <Layout>
        <div style={{ padding: 48, textAlign: "center" }}>
          <Spin size="large" tip="Cargando biblioteca..." />
        </div>
      </Layout>
    );
  }

  if (booksQuery.error || categoriesQuery.error) {
    return (
      <Layout>
        <Card style={{ margin: 16 }}>
          <Alert
            message="Error al cargar datos del dashboard"
            description="No pudimos conectarnos al servidor de la biblioteca. Verifica la conexión."
            type="error"
            showIcon
          />
        </Card>
      </Layout>
    );
  }

  const renderBookGrid = (booksList: any[]) => {
    if (booksList.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#8c8c8c" }}>
          No hay libros disponibles en esta sección actualmente.
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {booksList.map((book: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Card
              hoverable
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #f0f0f0",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              bodyStyle={{ padding: "12px 16px", flex: 1, display: "flex", flexDirection: "column" }}
              cover={
                <div
                  style={{
                    height: "180px",
                    position: "relative",
                    background: getGradient(book.title),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <BookOutlined style={{ fontSize: "48px", color: "rgba(255,255,255,0.85)" }} />
                  )}
                  <Badge
                    status={book.available ? "success" : "warning"}
                    text={book.available ? "Disponible" : "Prestado"}
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      background: "rgba(255, 255, 255, 0.9)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      zIndex: 1,
                    }}
                  />
                </div>
              }
              onClick={() => {
                // Si está autenticado, llevar a libros para ver detalle / alquilar
                if (isAuthenticated) {
                  navigate("/books");
                } else {
                  navigate("/login");
                }
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: "#1890ff", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>
                  {book.category?.name ?? "General"}
                </div>
                <Title level={5} style={{ margin: "0 0 4px 0", fontSize: "15px", lineHeight: "1.3" }}>
                  {book.title}
                </Title>
                <Paragraph type="secondary" style={{ margin: 0, fontSize: "13px" }}>
                  Por: {book.author?.name ?? "Autor Desconocido"} {book.year ? `(${book.year})` : ""}
                </Paragraph>
              </div>
               <div style={{ borderTop: "1px solid #f0f0f0", marginTop: "12px", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#8c8c8c" }}>
                <span>Editorial: {book.editorial ?? "N/A"}</span>
                <span style={{ fontWeight: "bold", color: "#f5222d", fontSize: "14px" }}>${book.price ? book.price.toFixed(2) : "0.00"}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const tabItems = [
    {
      key: "new",
      label: (
        <span>
          <CalendarOutlined />
          Nuevos o recién agregados
        </span>
      ),
      children: renderBookGrid(recentBooks),
    },
    {
      key: "popular",
      label: (
        <span>
          <RiseOutlined />
          Populares
        </span>
      ),
      children: renderBookGrid(popularBooks),
    },
    {
      key: "suggestions",
      label: (
        <span>
          <StarOutlined />
          Sugerencias
        </span>
      ),
      children: renderBookGrid(suggestionBooks),
    },
  ];

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Banner Hero Premium */}
        <div
          style={{
            background: "linear-gradient(135deg, #1890ff 0%, #001529 100%)",
            borderRadius: "16px",
            padding: "40px 32px",
            color: "#ffffff",
            boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Title level={2} style={{ color: "#ffffff", margin: "0 0 8px 0" }}>
                ¡Te damos la bienvenida a la Biblioteca Virtual!
              </Title>
              <Paragraph style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "16px", margin: "0 0 16px 0" }}>
                Explora nuestro catálogo completo de libros de forma gratuita. Regístrate o inicia sesión para alquilar tus libros favoritos y gestionar tus lecturas.
              </Paragraph>
              {!isAuthenticated && (
                <Button type="primary" size="large" style={{ background: "#ffffff", color: "#1890ff", border: "none" }} onClick={() => navigate("/login")}>
                  Empezar a Leer
                </Button>
              )}
            </Col>
            <Col xs={0} md={8} style={{ textAlign: "center" }}>
              <BookOutlined style={{ fontSize: "120px", color: "rgba(255,255,255,0.15)" }} />
            </Col>
          </Row>
        </div>

        {/* Sección de Categorías Interactiva */}
        <div>
          <Title level={4} style={{ marginBottom: "12px" }}>Explorar Categorías</Title>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
            <Tag.CheckableTag
              checked={selectedCategory === null}
              onChange={() => setSelectedCategory(null)}
              style={{ padding: "6px 16px", fontSize: "14px", borderRadius: "16px" }}
            >
              Todos los Libros
            </Tag.CheckableTag>
            {categories.map((cat: any) => (
              <Tag.CheckableTag
                key={cat.id}
                checked={selectedCategory === cat.id}
                onChange={(checked) => setSelectedCategory(checked ? cat.id : null)}
                style={{ padding: "6px 16px", fontSize: "14px", borderRadius: "16px" }}
              >
                {cat.name}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>

        {/* Contenedor de Secciones Especiales */}
        <Card style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Tabs defaultActiveKey="new" items={tabItems} size="large" animated={{ inkBar: true, tabPane: true }} />
        </Card>

        {/* Resumen e Indicadores */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Acerca de nuestra Biblioteca" style={{ borderRadius: "12px", height: "100%" }}>
              <Paragraph>
                La biblioteca ofrece servicios de préstamo digital interactivos para toda la comunidad académica y clientes en general.
              </Paragraph>
              <Alert
                message="Estudiantes cuentan con un 50% de descuento en alquileres extendidos."
                type="success"
                showIcon
                style={{ marginBottom: 12 }}
              />
              <Alert
                message="El rol de cliente te permite alquilar libros hasta por un periodo de 10 días."
                type="info"
                showIcon
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Estadísticas de la Comunidad" style={{ borderRadius: "12px", height: "100%" }}>
              <Paragraph>
                <strong>Total de Libros en Catálogo:</strong> {books.length} libros
              </Paragraph>
              {isAuthenticated ? (
                <Paragraph>
                  <strong>Tus préstamos activos:</strong> {loans.filter((loan: any) => !loan.returnDate).length} préstamos en curso
                </Paragraph>
              ) : (
                <Alert
                  message="Inicia sesión para poder gestionar préstamos y ver tus estadísticas personales."
                  type="warning"
                  showIcon
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
