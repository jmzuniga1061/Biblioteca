import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooks, getAuthors, getCategories, createBook, createLoan, getBookLoanStatus } from "../services/api";
import { Card, Row, Col, Input, List, Typography, Badge, Button, Form, message, InputNumber, Select, Spin } from "antd";

const { Title, Paragraph } = Typography;

export default function Books() {
  const { user, hasRole } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ title: "", author: "", year: "", publisher: "", keywords: "" });
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loanStatus, setLoanStatus] = useState<any>(null);
  const [form] = Form.useForm();

  const booksQuery = useQuery(["books"], getBooks);
  const authorsQuery = useQuery(["authors"], getAuthors);
  const categoriesQuery = useQuery(["categories"], getCategories);

  const createBookMutation = useMutation(createBook, {
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      message.success("Libro agregado correctamente");
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error?.message || "No se pudo crear el libro");
    },
  });

  const createLoanMutation = useMutation((bookId: number) => createLoan(bookId), {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries(["books"]);
      queryClient.invalidateQueries(["loans"]);
      setLoanStatus(data);
      message.success(`Préstamo creado. Due date: ${new Date(data.dueDate).toLocaleDateString()}`);
    },
    onError: (error: any) => {
      message.error(error?.message || "No se pudo crear el préstamo");
    },
  });

  const books = booksQuery.data ?? [];
  const authors = authorsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const filteredBooks = useMemo(() => {
    const query = {
      title: filters.title,
      author: filters.author,
      year: filters.year ? Number(filters.year) : undefined,
      publisher: filters.publisher,
      keywords: filters.keywords ? filters.keywords.split(" ").filter(Boolean) : undefined,
    };
    return books.filter((book: any) => {
      if (query.title && !book.title.toLowerCase().includes(query.title.toLowerCase())) return false;
      if (query.author && !book.author.name.toLowerCase().includes(query.author.toLowerCase())) return false;
      if (query.year && Number(book.createdAt ? new Date(book.createdAt).getFullYear() : 0) !== query.year) return false;
      if (query.publisher && !(book.description || "").toLowerCase().includes(query.publisher.toLowerCase())) return false;
      if (query.keywords && query.keywords.length > 0) {
        const bookKeywords = book.category?.name ? [book.category.name.toLowerCase()] : [];
        if (!query.keywords.some((k: string) => bookKeywords.some((bk: string) => bk.includes(k.toLowerCase())))) return false;
      }
      return true;
    });
  }, [books, filters]);

  const handleSearch = (values: any) => {
    setFilters({
      title: values.title ?? "",
      author: values.author ?? "",
      year: values.year ? String(values.year) : "",
      publisher: values.publisher ?? "",
      keywords: values.keywords ?? "",
    });
  };

  const handleSelect = (book: any) => {
    setSelectedBook(book);
    if (book?.id) {
      getBookLoanStatus(book.id)
        .then(setLoanStatus)
        .catch(() => setLoanStatus(null));
    } else {
      setLoanStatus(null);
    }
  };

  const handleRent = () => {
    if (!selectedBook) return;
    createLoanMutation.mutate(selectedBook.id);
  };

  const onCreateBook = async (values: any) => {
    if (!user) return;
    createBookMutation.mutate({
      title: values.title,
      isbn: values.isbn,
      authorId: Number(values.authorId),
      categoryId: Number(values.categoryId),
      description: values.description,
      stock: Number(values.stock),
      available: true,
    });
  };

  if (booksQuery.isLoading || authorsQuery.isLoading || categoriesQuery.isLoading) {
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
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={16}>
              <Title level={4}>Catálogo de Libros</Title>
              <Paragraph>Busca por título, autor, año, editorial o categoría.</Paragraph>
            </Col>
            <Col xs={24} lg={8}>
              <Form layout="vertical" onFinish={handleSearch} initialValues={filters}>
                <Row gutter={8}>
                  <Col span={24} sm={12} md={12} lg={12}>
                    <Form.Item name="title" label="Título">
                      <Input placeholder="Buscar por título" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12} md={12} lg={12}>
                    <Form.Item name="author" label="Autor">
                      <Input placeholder="Buscar por autor" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12} md={12} lg={8}>
                    <Form.Item name="year" label="Año">
                      <InputNumber style={{ width: "100%" }} placeholder="Año" />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12} md={12} lg={8}>
                    <Form.Item name="publisher" label="Editorial">
                      <Input placeholder="Buscar por editorial" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={12} md={12} lg={8}>
                    <Form.Item name="keywords" label="Categoría">
                      <Input placeholder="Buscar por categoría" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Buscar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Catálogo completo">
              <List
                itemLayout="horizontal"
                dataSource={filteredBooks}
                renderItem={(book: any) => (
                  <List.Item onClick={() => handleSelect(book)} style={{ cursor: "pointer" }}>
                    <List.Item.Meta
                      title={book.title}
                      description={`${book.author?.name ?? "Autor desconocido"} · ${book.category?.name ?? "Categoría desconocida"}`}
                    />
                    <Badge status={book.available ? "success" : "error"} text={book.available ? "Disponible" : "No disponible"} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Detalle del libro">
              {selectedBook ? (
                <div>
                  <Title level={5}>{selectedBook.title}</Title>
                  <Paragraph><strong>Autor:</strong> {selectedBook.author?.name ?? "N/A"}</Paragraph>
                  <Paragraph><strong>Categoría:</strong> {selectedBook.category?.name ?? "N/A"}</Paragraph>
                  <Paragraph><strong>ISBN:</strong> {selectedBook.isbn ?? "N/A"}</Paragraph>
                  <Paragraph><strong>Disponibilidad:</strong> {selectedBook.available ? "Disponible" : "Prestado"}</Paragraph>
                  {selectedBook.available ? (
                    <Button type="primary" block onClick={handleRent} loading={createLoanMutation.isLoading}>
                      Alquilar libro
                    </Button>
                  ) : (
                    <Paragraph type="secondary">
                      {loanStatus?.dueDate ? `Fecha de entrega: ${new Date(loanStatus.dueDate).toLocaleDateString()}` : "Libro actualmente prestado"}
                    </Paragraph>
                  )}
                </div>
              ) : (
                <Paragraph>Selecciona un libro para ver el detalle.</Paragraph>
              )}
            </Card>

            {hasRole("bibliotecario") && (
              <Card title="Agregar nuevo libro">
                <Form form={form} layout="vertical" onFinish={onCreateBook}>
                  <Form.Item name="title" label="Título" rules={[{ required: true, message: "El título es requerido" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: "El ISBN es requerido" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="authorId" label="Autor" rules={[{ required: true, message: "El autor es requerido" }]}>
                    <Select options={authors.map((author: any) => ({ label: author.name, value: author.id }))} />
                  </Form.Item>
                  <Form.Item name="categoryId" label="Categoría" rules={[{ required: true, message: "La categoría es requerida" }]}>
                    <Select options={categories.map((category: any) => ({ label: category.name, value: category.id }))} />
                  </Form.Item>
                  <Form.Item name="stock" label="Stock" initialValue={1} rules={[{ required: true, message: "El stock es requerido" }]}>
                    <InputNumber style={{ width: "100%" }} min={1} />
                  </Form.Item>
                  <Form.Item name="description" label="Descripción">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={createBookMutation.isLoading}>
                      Agregar libro
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
