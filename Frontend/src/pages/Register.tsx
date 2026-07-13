import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import "../styles/Register.css";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await auth.register(values.name, values.email, values.password);
      navigate("/dashboard");
    } catch (err: any) {
      message.error(err?.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card" style={{ width: 420 }}>
        <h1 className="register-title">Crear cuenta</h1>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Nombre completo" rules={[{ required: true }]}> 
            <Input placeholder="Tu nombre" />
          </Form.Item>

          <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, type: "email" }]}> 
            <Input placeholder="usuario@example.com" />
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}> 
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item name="confirmPassword" label="Confirmar contraseña" rules={[{ required: true }]}> 
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Registrarse
            </Button>
          </Form.Item>
        </Form>

        <p className="login-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </Card>
    </div>
  );
}
