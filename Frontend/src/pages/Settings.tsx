import { Card, Form, Select, Input, Button, message, Row, Col, Typography } from "antd";
import Layout from "../components/Layout";

const { Title } = Typography;

export default function Settings() {
  const [prefForm] = Form.useForm();
  const [passForm] = Form.useForm();

  const handlePreferencesSubmit = (values: any) => {
    message.success("Preferencias guardadas correctamente");
    console.log("Preferencias:", values);
  };

  const handlePasswordSubmit = (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("La confirmación de la contraseña no coincide");
      return;
    }
    message.success("Contraseña actualizada correctamente");
    passForm.resetFields();
  };

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 0" }}>
        <Title level={2} style={{ marginBottom: 24 }}>Configuración de Cuenta</Title>

        <Row gutter={[24, 24]}>
          {/* Preferencias */}
          <Col xs={24} md={12}>
            <Card title="Preferencias de la Plataforma" bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Form
                form={prefForm}
                layout="vertical"
                initialValues={{ theme: "Claro", notifications: "Activadas" }}
                onFinish={handlePreferencesSubmit}
              >
                <Form.Item name="theme" label="Tema visual">
                  <Select
                    options={[
                      { value: "Claro", label: "Claro" },
                      { value: "Oscuro", label: "Oscuro (Próximamente)" },
                    ]}
                  />
                </Form.Item>

                <Form.Item name="notifications" label="Notificaciones de préstamos">
                  <Select
                    options={[
                      { value: "Activadas", label: "Activadas" },
                      { value: "Desactivadas", label: "Desactivadas" },
                    ]}
                  />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Guardar configuración
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Cambiar contraseña */}
          <Col xs={24} md={12}>
            <Card title="Cambiar Contraseña" bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Form
                form={passForm}
                layout="vertical"
                onFinish={handlePasswordSubmit}
              >
                <Form.Item
                  name="currentPassword"
                  label="Contraseña actual"
                  rules={[{ required: true, message: "Ingresa tu contraseña actual" }]}
                >
                  <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Nueva contraseña"
                  rules={[{ required: true, message: "Ingresa tu nueva contraseña" }]}
                >
                  <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirmar nueva contraseña"
                  rules={[{ required: true, message: "Confirma tu nueva contraseña" }]}
                >
                  <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Actualizar contraseña
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}
