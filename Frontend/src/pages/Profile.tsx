import { Card, Avatar, Form, Input, Button, message, Typography, Row, Col } from "antd";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const { Title, Paragraph } = Typography;

export default function Profile() {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const getDisplayName = () => {
    if (!user) return "Usuario";
    if (user.name === "Administrador por Defecto" || user.name === "Administrador por defecto" || user.name === "Administrador") {
      return "Administrador";
    }
    return user.name;
  };

  const displayName = getDisplayName();
  const displayRole = user?.role ? user.role.toUpperCase() : "INVITADO";
  const displayEmail = user?.email ?? "sin-correo@biblioteca.com";

  const handleProfileSubmit = (values: any) => {
    message.success("Perfil actualizado correctamente (simulado)");
    console.log("Perfil actualizado:", values);
  };

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 0" }}>
        <Title level={2} style={{ marginBottom: 24 }}>Perfil de Usuario</Title>

        <Row gutter={[24, 24]}>
          {/* Tarjeta de Información */}
          <Col xs={24} md={10}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              <Avatar
                size={120}
                src={`https://ui-avatars.com/api/?name=${displayName}&background=1890ff&color=fff&size=120`}
                style={{ marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: "0 0 8px 0" }}>
                {displayName}
              </Title>
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    background: "#e6f7ff",
                    color: "#1890ff",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {displayRole}
                </span>
              </div>
              <Paragraph type="secondary">{displayEmail}</Paragraph>
            </Card>
          </Col>

          {/* Formulario de Edición */}
          <Col xs={24} md={14}>
            <Card title="Editar Perfil" bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Form
                form={form}
                layout="vertical"
                initialValues={{ name: displayName, email: displayEmail }}
                onFinish={handleProfileSubmit}
              >
                <Form.Item
                  name="name"
                  label="Nombre completo"
                  rules={[{ required: true, message: "Ingresa tu nombre completo" }]}
                >
                  <Input placeholder="Tu nombre completo" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  rules={[{ required: true, type: "email", message: "Ingresa un correo electrónico válido" }]}
                >
                  <Input placeholder="usuario@biblioteca.com" disabled />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Guardar cambios
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
