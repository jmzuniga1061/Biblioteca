import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await auth.login(values.email, values.password);
      navigate("/dashboard");
    } catch (err: any) {
      message.error(err?.message || "Error en login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" style={{ width: 360 }}>
        <h1 className="login-title">Biblioteca Virtual</h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, type: "email" }]}> 
            <Input placeholder="usuario@example.com (ej: admin@example.com)" />
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}> 
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>

        <p className="register-text">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </Card>
    </div>
  );
}
