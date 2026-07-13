import { useMemo } from "react";
import {
  Card,
  List,
  Row,
  Col,
  Badge,
  Button,
  Spin,
  message,
  Typography,
} from "antd";
import Layout from "../components/Layout";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getLoans, returnLoan } from "../services/api";

const { Paragraph } = Typography;

export default function Loans() {
  const queryClient = useQueryClient();

  // ✅ React Query v5
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loans"],
    queryFn: getLoans,
  });

  // ✅ React Query v5
  const returnLoanMutation = useMutation({
    mutationFn: (loanId: number) => returnLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      message.success("Préstamo devuelto correctamente");
    },
    onError: (err: any) => {
      message.error(err?.message || "No se pudo devolver el préstamo");
    },
  });

  const loans = data;

  const overdueLoans = useMemo(
    () => loans.filter((loan: any) => loan.overdue),
    [loans]
  );

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
            <Card title="Préstamos activos">
              {error ? (
                <Paragraph type="danger">
                  No se pudo cargar la lista de préstamos.
                </Paragraph>
              ) : (
                <List
                  dataSource={loans}
                  renderItem={(loan: any) => (
                    <List.Item
                      actions={
                        loan.returnDate
                          ? []
                          : [
                              <Button
                                key="return"
                                type="primary"
                                loading={returnLoanMutation.isPending}
                                onClick={() =>
                                  returnLoanMutation.mutate(loan.id)
                                }
                              >
                                Devolver
                              </Button>,
                            ]
                      }
                    >
                      <List.Item.Meta
                        title={`${
                          loan.book?.title ?? "Sin título"
                        } — ${
                          loan.user?.name ??
                          loan.user?.email ??
                          "Usuario desconocido"
                        }`}
                        description={`Prestado: ${new Date(
                          loan.loanDate
                        ).toLocaleDateString()} · Due: ${new Date(
                          loan.dueDate
                        ).toLocaleDateString()}`}
                      />
                      <Badge
                        status={
                          loan.returnDate
                            ? "success"
                            : loan.overdue
                            ? "error"
                            : "warning"
                        }
                        text={
                          loan.returnDate
                            ? "Devuelto"
                            : loan.overdue
                            ? "Vencido"
                            : "Activo"
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Resumen de préstamos">
              <Paragraph>
                <strong>Total de préstamos:</strong> {loans.length}
              </Paragraph>
              <Paragraph>
                <strong>Préstamos vencidos:</strong>{" "}
                {overdueLoans.length}
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}