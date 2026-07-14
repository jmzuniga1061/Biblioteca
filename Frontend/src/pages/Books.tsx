import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { BookOutlined, DownOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBooks,
  getAuthors,
  getCategories,
  createBook,
  createLoan,
  getBookLoanStatus,
  updateBook,
  deleteBook,
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
  Dropdown,
  Popconfirm,
} from "antd";

const { Title, Paragraph } = Typography;

export default function Books() {
  const { user, hasRole } = useAuth();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedEditorial, setSelectedEditorial] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loanStatus, setLoanStatus] = useState<any>(null);
  const [docType, setDocType] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();

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

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateBook(id, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setSelectedBook(data);
      setIsEditing(false);
      message.success("Libro actualizado correctamente");
    },
    onError: (error: any) => {
      message.error(error?.message || "No se pudo actualizar el libro");
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setSelectedBook(null);
      setIsEditing(false);
      message.success("Libro eliminado correctamente");
    },
    onError: (error: any) => {
      message.error(error?.message || "No se pudo eliminar el libro");
    },
  });

  const books = booksQuery.data ?? [];
  const authors = authorsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const uniqueEditorials = useMemo(() => {
    const editorials = books.map((b: any) => b.editorial).filter(Boolean);
    return Array.from(new Set(editorials)) as string[];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book: any) => {
      if (searchText) {
        const normSearch = searchText.toLowerCase();
        const matchesTitle = book.title?.toLowerCase().includes(normSearch);
        const matchesAuthor = book.author?.name?.toLowerCase().includes(normSearch);
        const matchesYear = book.year && String(book.year).toLowerCase().includes(normSearch);
        const matchesEditorial = book.editorial?.toLowerCase().includes(normSearch);
        if (!matchesTitle && !matchesAuthor && !matchesYear && !matchesEditorial) {
          return false;
        }
      }

      if (selectedCategoryId && book.categoryId !== selectedCategoryId) {
        return false;
      }

      if (selectedEditorial && book.editorial !== selectedEditorial) {
        return false;
      }

      return true;
    });
  }, [books, searchText, selectedCategoryId, selectedEditorial]);

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedCategoryId(null);
    setSelectedEditorial(null);
  };

  const filterMenuItems = useMemo(() => {
    return [
      {
        key: "categories",
        label: "Categoría",
        children: categories.map((cat: any) => ({
          key: `cat-${cat.id}`,
          label: selectedCategoryId === cat.id ? `✓ ${cat.name}` : cat.name,
          onClick: () => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id),
        })),
      },
      {
        key: "editorials",
        label: "Editorial",
        children: uniqueEditorials.map((ed: string) => ({
          key: `ed-${ed}`,
          label: selectedEditorial === ed ? `✓ ${ed}` : ed,
          onClick: () => setSelectedEditorial(selectedEditorial === ed ? null : ed),
        })),
      },
    ];
  }, [categories, uniqueEditorials, selectedCategoryId, selectedEditorial]);

  const handleSelect = (book: any) => {
    setSelectedBook(book);
    setIsEditing(false);

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
    if (!docType) {
      message.error("Debe ingresar una identificación para continuar con el préstamo");
      return;
    }
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
      year: values.year,
      imageUrl: values.imageUrl,
      price: values.price ? Number(values.price) : 0,
      available: true,
    });
  };

  const onUpdateBook = (values: any) => {
    if (!selectedBook) return;
    updateBookMutation.mutate({
      id: selectedBook.id,
      data: {
        title: values.title,
        isbn: selectedBook.isbn,
        authorId: Number(values.authorId),
        categoryId: Number(values.categoryId),
        description: values.description,
        editorial: values.editorial,
        stock: Number(values.stock),
        year: values.year,
        imageUrl: values.imageUrl,
        price: Number(values.price),
      },
    });
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;
    deleteBookMutation.mutate(selectedBook.id);
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>Catálogo de Libros</Title>
              <Paragraph style={{ margin: 0 }} type="secondary">
                Encuentra y alquila tus lecturas favoritas.
              </Paragraph>
            </div>
            
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <Input.Search
                placeholder="Buscar por título, autor, año..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
              />
              <Dropdown menu={{ items: filterMenuItems }} trigger={["click"]}>
                <Button icon={<DownOutlined />}>
                  Filtrar por...
                </Button>
              </Dropdown>
              {(selectedCategoryId || selectedEditorial || searchText) && (
                <Button type="link" danger onClick={handleClearFilters} style={{ paddingLeft: 8 }}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
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
                      avatar={
                        book.imageUrl ? (
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            style={{ width: 40, height: 50, objectFit: "cover", borderRadius: 4 }}
                          />
                        ) : (
                          <div style={{ width: 40, height: 50, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                            <BookOutlined style={{ color: "#bfbfbf" }} />
                          </div>
                        )
                      }
                      title={book.title}
                      description={`${book.author?.name ?? "Autor desconocido"} · ${book.category?.name ?? "Sin categoría"} ${book.year ? `· (${book.year})` : ""} · $${book.price ? book.price.toFixed(2) : "0.00"}`}
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
            <Card title={isEditing ? "Editar Libro" : "Detalle del Libro"}>
              {selectedBook ? (
                isEditing ? (
                  <Form
                    form={editForm}
                    layout="vertical"
                    initialValues={{
                      title: selectedBook.title,
                      authorId: selectedBook.authorId,
                      categoryId: selectedBook.categoryId,
                      editorial: selectedBook.editorial,
                      year: selectedBook.year,
                      price: selectedBook.price,
                      stock: selectedBook.stock,
                      imageUrl: selectedBook.imageUrl,
                      description: selectedBook.description,
                    }}
                    onFinish={onUpdateBook}
                  >
                    <Form.Item name="title" label="Título" required>
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

                    <Form.Item name="editorial" label="Editorial">
                      <Input />
                    </Form.Item>

                    <Form.Item name="year" label="Año de publicación">
                      <Input />
                    </Form.Item>

                    <Form.Item name="price" label="Precio de catálogo" required>
                      <InputNumber style={{ width: "100%" }} min={0} precision={2} prefix="$" />
                    </Form.Item>

                    <Form.Item name="stock" label="Stock disponible" required>
                      <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>

                    <Form.Item name="imageUrl" label="URL de portada">
                      <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Descripción">
                      <Input.TextArea />
                    </Form.Item>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button type="primary" htmlType="submit" block loading={updateBookMutation.isPending}>
                        Guardar
                      </Button>
                      <Button onClick={() => setIsEditing(false)} block>
                        Cancelar
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    {selectedBook.imageUrl && (
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <img
                          src={selectedBook.imageUrl}
                          alt={selectedBook.title}
                          style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                        />
                      </div>
                    )}
                    <Title level={5} style={{ marginTop: 0 }}>{selectedBook.title}</Title>
                    <Paragraph>
                      <strong>Autor:</strong> {selectedBook.author?.name ?? "N/A"}
                    </Paragraph>
                    <Paragraph>
                      <strong>Categoría:</strong> {selectedBook.category?.name ?? "N/A"}
                    </Paragraph>
                    <Paragraph>
                      <strong>Editorial:</strong> {selectedBook.editorial ?? "N/A"}
                    </Paragraph>
                    <Paragraph>
                      <strong>Año de publicación:</strong> {selectedBook.year ?? "N/A"}
                    </Paragraph>
                    <Paragraph>
                      <strong>Precio de catálogo:</strong> ${selectedBook.price ? selectedBook.price.toFixed(2) : "0.00"}
                    </Paragraph>
                    <Paragraph>
                      <strong>Cantidad disponible:</strong> {selectedBook.stock ?? 0} unidades
                    </Paragraph>

                    {user && (
                      <div style={{ marginTop: 16, marginBottom: 16, padding: "12px", background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8 }}>
                        <div style={{ fontSize: "11px", color: "#8c8c8c", textTransform: "uppercase", fontWeight: "bold" }}>
                          Tu Descuento ({user.role})
                        </div>
                        <div style={{ fontSize: "16px", color: "#52c41a", fontWeight: "bold", marginTop: 4 }}>
                          {user.role?.toLowerCase() === "profesor" 
                            ? "Gratis ($0.00) — 100% desc." 
                            : user.role?.toLowerCase() === "estudiante" 
                            ? `$${((selectedBook.price || 0) * 0.5).toFixed(2)} — 50% desc.` 
                            : `$${(selectedBook.price || 0).toFixed(2)} — 0% desc.`}
                        </div>
                      </div>
                    )}

                    {selectedBook.available ? (
                      <>
                        <div style={{ marginBottom: 8, marginTop: 12 }}>
                          <span style={{ fontSize: "12px", color: "#8c8c8c" }}>Documento a entregar:</span>
                        </div>
                        <Select
                          placeholder="Selecciona una identificación"
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
                          disabled={!docType}
                        >
                          Alquilar
                        </Button>
                      </>
                    ) : (
                      <Paragraph style={{ marginTop: 12 }}>
                        {loanStatus?.dueDate
                          ? `Entrega: ${new Date(
                              loanStatus.dueDate
                            ).toLocaleDateString()}`
                          : "No disponible"}
                      </Paragraph>
                    )}

                    {hasRole("bibliotecario") && (
                      <div style={{ display: "flex", gap: "8px", marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                        <Button type="default" onClick={() => {
                          editForm.setFieldsValue({
                            title: selectedBook.title,
                            authorId: selectedBook.authorId,
                            categoryId: selectedBook.categoryId,
                            editorial: selectedBook.editorial,
                            year: selectedBook.year,
                            price: selectedBook.price,
                            stock: selectedBook.stock,
                            imageUrl: selectedBook.imageUrl,
                            description: selectedBook.description,
                          });
                          setIsEditing(true);
                        }} block>
                          Editar
                        </Button>
                        <Popconfirm
                          title="¿Eliminar este libro?"
                          description="Esta acción no se puede deshacer."
                          onConfirm={handleDeleteBook}
                          okText="Sí, eliminar"
                          cancelText="No"
                        >
                          <Button type="primary" danger block>
                            Eliminar
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </>
                )
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

                  <Form.Item name="price" label="Precio de catálogo" initialValue={15}>
                    <InputNumber style={{ width: "100%" }} min={0} precision={2} prefix="$" />
                  </Form.Item>

                   <Form.Item name="editorial" label="Editorial">
                    <Input />
                  </Form.Item>

                  <Form.Item name="year" label="Año de publicación">
                    <Input placeholder="Ej: 1967, Año antiguo" />
                  </Form.Item>

                  <Form.Item name="imageUrl" label="URL de portada">
                    <Input placeholder="Ej: /covers/cover_novela.png" />
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