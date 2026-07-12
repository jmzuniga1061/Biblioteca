import { Card, List, Row, Col, Button, Form, Input, message, Spin } from "antd";
import Layout from "../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthors, createAuthor } from "../services/api";

export default function Authors() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data, isLoading, error } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const createAuthorMutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      message.success("Autor creado correctamente");
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err?.message || "No se pudo crear el autor");
    },
  });

  const authors = data ?? [];

  const onFinish = (values: any) => {
    createAuthorMutation.mutate({
      name: values.name,
      biography: values.biography,
    });
  };

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
      <div style={{ padding: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Autores">
              {error ? (
                <p style={{ color: "red" }}>
                  No se pudo cargar la lista de autores.
                </p>
              ) : (
                <List
                  dataSource={authors}
                  renderItem={(author: any) => (
                    <List.Item>
                      <List.Item.Meta
                        title={author.name}
                        description={author.biography ?? "Sin biografía"}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Agregar autor">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="name"
                  label="Nombre"
                  rules={[{ required: true, message: "El nombre es requerido" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="biography" label="Biografía">
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={createAuthorMutation.isPending}
                    block
                  >
                    Guardar autor
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}