import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FormatCurrency } from "../../../utils/FormatCurrency";

const IncomingsToday = ({ transactions, COLORS }) => {
  return (
    <TableContainer
      sx={{
        maxHeight: 500,
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(229, 56, 134, 0.2)",
          borderRadius: "10px",
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": {
                backgroundColor: "rgba(240, 98, 145, 1)",
                fontWeight: 800,
                color: "#fff",
              },
            }}
          >
            <TableCell sx={{ pl: 3 }}>Alumna</TableCell>
            <TableCell>Curso / Concepto</TableCell>
            <TableCell>Método de Pago</TableCell>
            <TableCell>Notas / Comentarios</TableCell>
            <TableCell align='right' sx={{ pr: 3 }}>
              Monto Recaudado
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align='center'
                sx={{
                  py: 8,
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                No se han registrado movimientos de caja el día de hoy.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(240, 98, 146, 0.01)",
                  },
                }}
              >
                <TableCell sx={{ pl: 3 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                    {row.studentName}
                  </Typography>
                  <Typography variant='caption' color='textSecondary'>
                    {new Date(row.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    hrs
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {row.courseTitle}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      row.method === "cash"
                        ? "Efectivo"
                        : row.method === "bank_transfer"
                          ? "Transf. Bancaria"
                          : row.method === "stripe_online"
                            ? "Stripe"
                            : row.method === "card_terminal" && "Terminal TPV"
                    }
                    size='small'
                    sx={{
                      fontWeight: 700,
                      borderRadius: "6px",
                      backgroundColor:
                        row.method === "cash"
                          ? "#e8f5e9"
                          : row.method === "card_terminal"
                            ? "#E1F5FE"
                            : row.method === "stripe_online"
                              ? "#FFF3E0"
                              : row.method === "bank_transfer" && "#FDE0F1",
                      color:
                        row.method === "cash"
                          ? COLORS.success
                          : row.method === "card_terminal"
                            ? "#228CD3"
                            : row.method === "stripe_online"
                              ? "#ED6C0E"
                              : row.method === "bank_transfer" && "#E8408F",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    sx={{
                      display: "block",
                      maxWidth: 250,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.notes}
                  </Typography>
                </TableCell>
                <TableCell
                  align='right'
                  sx={{
                    pr: 3,
                    fontWeight: 800,
                    color:
                      row.method === "cash"
                        ? COLORS.success
                        : row.method === "card_terminal"
                          ? "#228CD3"
                          : row.method === "stripe_online"
                            ? "#ED6C0E"
                            : row.method === "bank_transfer" && "#E8408F",
                  }}
                >
                  {FormatCurrency(row.amount)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IncomingsToday;
