import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBooks,
  getAuthors,
  getCategories,
  createBook,
  createLoan,
  getBookLoanStatus,
} from "../services/api";
import {
  Card,
  Row,
  Col,
  Input,
  List,
  Typography,
  Badge,
  Button,
  Form,
  message,
  InputNumber,
  Select,
  Spin,
} from "antd";

const { Title, Paragraph } = Typography;

export default function Books() {
  const { user, hasRole } = useAuth();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    title: "",
    author: "",
    year: "",
    publisher: "",
    keywords: "",
  });

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loanStatus, setLoanStatus] = useState<any>(null);
  const [docType, setDocType] = useState("DNI/Cédula");
  const [form] = Form.useForm();

  // ✅ QUERIES
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const authorsQuery = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // ✅ MUTATIONS
  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      message.success("Libro agregado correctamente");
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error?.message || "No se pudo crear el libro");
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: (bookId: number) => createLoan(bookId, docType),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      setLoanStatus(data);
      message.success(
        `Préstamo creado. Fecha de entrega: ${new Date(
          data.dueDate
        ).toLocaleDateString()}`
      );
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
      keywords: filters.keywords
        ? filters.keywords.split(" ").filter(Boolean)
        : undefined,
    };

    return books.filter((book: any) => {
      if (
        query.title &&
        !book.title.toLowerCase().includes(query.title.toLowerCase())
      )
        return false;

      if (
        query.author &&
        !book.author?.name.toLowerCase().includes(query.author.toLowerCase())
      )
        return false;

      if (
        query.year &&
        Number(
          book.createdAt
            ? new Date(book.createdAt).getFullYear()
            : 0
        ) !== query.year
      )
        return false;

      if (
        query.publisher &&
        !(book.editorial || "")
          .toLowerCase()
          .includes(query.publisher.toLowerCase())
      )
        return false;

      if (query.keywords && query.keywords.length > 0) {
        const bookKeywords = book.category?.name
          ? [book.category.name.toLowerCase()]
          : [];

        if (
          !query.keywords.some((k: string) =>
            bookKeywords.some((bk: string) =>
              bk.includes(k.toLowerCase())
            )
          )
        )
          return false;
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

  const onCreateBook = (values: any) => {
    if (!user) return;

    createBookMutation.mutate({
      title: values.title,
      isbn: values.isbn,
      authorId: Number(values.authorId),
      categoryId: Number(values.categoryId),
      description: values.description,
      editorial: values.editorial,
      stock: Number(values.stock),
      available: true,
    });
  };

  if (
    booksQuery.isLoading ||
    authorsQuery.isLoading ||
    categoriesQuery.isLoading
  ) {
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
              <Paragraph>
                Busca por título, autor, año, editorial o categoría.
              </Paragraph>
            </Col>

            <Col xs={24} lg={8}>
              <Form layout="vertical" onFinish={handleSearch}>
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.Item name="title" label="Título">
                      <Input allowClear />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="author" label="Autor">
                      <Input allowClear />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="year" label="Año">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="publisher" label="Editorial">
                      <Input allowClear />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="keywords" label="Categoría">
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Buscar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Libros">
              <List
                dataSource={filteredBooks}
                renderItem={(book: any) => (
                  <List.Item
                    onClick={() => handleSelect(book)}
                    style={{ cursor: "pointer" }}
                  >
                    <List.Item.Meta
                      title={book.title}
                      description={`${book.author?.name ?? "Autor desconocido"} · ${book.category?.name ?? "Sin categoría"}`}
                    />
                    <Badge
                      status={book.available ? "success" : "error"}
                      text={book.available ? "Disponible" : "No disponible"}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Detalle">
              {selectedBook ? (
                <>
                  <Title level={5}>{selectedBook.title}</Title>
                  <Paragraph>
                    <strong>Autor:</strong>{" "}
                    {selectedBook.author?.name ?? "N/A"}
                  </Paragraph>
                  <Paragraph>
                    <strong>Categoría:</strong>{" "}
                    {selectedBook.category?.name ?? "N/A"}
                  </Paragraph>
                  <Paragraph>
                    <strong>Editorial:</strong>{" "}
                    {selectedBook.editorial ?? "N/A"}
                  </Paragraph>

                  {selectedBook.available ? (
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: "12px", color: "#8c8c8c" }}>Documento a entregar:</span>
                      </div>
                      <Select
                        value={docType}
                        onChange={setDocType}
                        style={{ width: "100%", marginBottom: 16 }}
                        options={[
                          { label: "DNI/Cédula", value: "DNI/Cédula" },
                          { label: "Carnet Estudiantil", value: "Carnet Estudiantil" },
                          { label: "Carnet de Profesor", value: "Carnet de Profesor" },
                          { label: "Pasaporte", value: "Pasaporte" },
                        ]}
                      />
                      <Button
                        type="primary"
                        block
                        onClick={handleRent}
                        loading={createLoanMutation.isPending}
                      >
                        Alquilar
                      </Button>
                    </>
                  ) : (
                    <Paragraph>
                      {loanStatus?.dueDate
                        ? `Entrega: ${new Date(
                            loanStatus.dueDate
                          ).toLocaleDateString()}`
                        : "No disponible"}
                    </Paragraph>
                  )}
                </>
              ) : (
                <Paragraph>Selecciona un libro</Paragraph>
              )}
            </Card>

            {hasRole("bibliotecario") && (
              <Card title="Nuevo libro">
                <Form form={form} layout="vertical" onFinish={onCreateBook}>
                  <Form.Item name="title" label="Título" required>
                    <Input />
                  </Form.Item>

                  <Form.Item name="isbn" label="ISBN" required>
                    <Input />
                  </Form.Item>

                  <Form.Item name="authorId" label="Autor" required>
                    <Select
                      options={authors.map((a: any) => ({
                        label: a.name,
                        value: a.id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item name="categoryId" label="Categoría" required>
                    <Select
                      options={categories.map((c: any) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item name="stock" label="Stock" initialValue={1}>
                    <InputNumber style={{ width: "100%" }} min={1} />
                  </Form.Item>

                   <Form.Item name="editorial" label="Editorial">
                    <Input />
                  </Form.Item>

                  <Form.Item name="description" label="Descripción">
                    <Input.TextArea />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={createBookMutation.isPending}
                  >
                    Crear libro
                  </Button>
                </Form>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </Layout>
  );
}