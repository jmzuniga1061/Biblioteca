import { Card, Table, Spin, Select, Button, Popconfirm, message, Typography, Alert } from "antd";
import Layout from "../components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, changeUserRole, deleteUser } from "../services/api";
import { DeleteOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Users() {
  const queryClient = useQueryClient();

  // Query para obtener los usuarios
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Mutación para cambiar el rol de un usuario
  const changeRoleMutation = useMutation({
    mutationFn: ({ id, roleName }: { id: number; roleName: string }) => changeUserRole(id, roleName),
    onSuccess: (updatedUser: any) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success(`Rol de ${updatedUser.name} cambiado a ${updatedUser.role}`);
    },
    onError: (err: any) => {
      message.error(err?.message || "No se pudo cambiar el rol");
    },
  });

  // Mutación para eliminar un usuario
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success(data?.message || "Usuario eliminado correctamente");
    },
    onError: (err: any) => {
      message.error(err?.message || "No se pudo eliminar el usuario");
    },
  });

  const handleRoleChange = (id: number, roleName: string) => {
    changeRoleMutation.mutate({ id, roleName });
  };

  const handleDeleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      fontWeight: "bold",
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: string, record: any) => (
        <Select
          value={role}
          style={{ width: 160 }}
          onChange={(val) => handleRoleChange(record.id, val)}
          loading={changeRoleMutation.isPending && changeRoleMutation.variables?.id === record.id}
          options={[
            { value: "cliente", label: "Cliente" },
            { value: "estudiante", label: "Estudiante" },
            { value: "profesor", label: "Profesor" },
            { value: "bibliotecario", label: "Bibliotecario" },
            { value: "administrador", label: "Administrador" },
            { value: "subadministrador", label: "Subadministrador" },
            { value: "admin", label: "Admin" },
          ]}
        />
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: any) => (
        <Popconfirm
          title="¿Eliminar usuario?"
          description="Esta acción es irreversible y removerá la cuenta del sistema."
          onConfirm={() => handleDeleteUser(record.id)}
          okText="Sí, eliminar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true, loading: deleteUserMutation.isPending }}
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Eliminar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div style={{ padding: 48, textAlign: "center" }}>
          <Spin size="large" tip="Cargando usuarios..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card style={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", margin: 16 }}>
        <div style={{ marginBottom: "20px" }}>
          <Title level={3}>Gestión de Usuarios</Title>
          <Paragraph type="secondary">
            Administra los usuarios registrados en la plataforma. Puedes cambiar sus roles o eliminar sus cuentas de forma directa.
          </Paragraph>
        </div>

        {error ? (
          <Alert
            message="Error al cargar usuarios"
            description="No posees los permisos necesarios o el servidor no responde."
            type="error"
            showIcon
          />
        ) : (
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            bordered
            style={{ borderRadius: "8px", overflow: "hidden" }}
          />
        )}
      </Card>
    </Layout>
  );
}
