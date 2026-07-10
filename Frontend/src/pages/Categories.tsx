import { Card, List, Row, Col, Button, Form, Input, message, Spin } from "antd";
import Layout from "../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory } from "../services/api";

export default function Categories() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data, isLoading, error } = useQuery(["categories"], getCategories);

  const createCategoryMutation = useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      message.success("Categoría creada correctamente");
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err?.message || "No se pudo crear la categoría");
    },
  });

  const categories = data ?? [];

  const onFinish = (values: any) => {
    createCategoryMutation.mutate({ name: values.name, description: values.description });
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
            <Card title="Categorías">
              {error ? (
                <p style={{ color: "red" }}>No se pudo cargar la lista de categorías.</p>
              ) : (
                <List
                  dataSource={categories}
                  renderItem={(category: any) => (
                    <List.Item>
                      <List.Item.Meta title={category.name} description={category.description ?? "Sin descripción"} />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Agregar categoría">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "El nombre es requerido" }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Descripción">
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={createCategoryMutation.isLoading} block>
                    Guardar categoría
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
