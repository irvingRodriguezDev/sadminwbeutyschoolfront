import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";
const Cobrance = ({ debtors, COLORS, handleWhatsAppCobro }) => {
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
                backgroundColor: "rgba(211, 47, 47, 0.02)",
                fontWeight: 800,
                color: COLORS.dark,
              },
            }}
          >
            <TableCell sx={{ pl: 3 }}>Alumna Morosa</TableCell>
            <TableCell>Taller / Curso Pendiente</TableCell>
            <TableCell>Progreso Financiero</TableCell>
            <TableCell align='right'>Saldo en Contra</TableCell>
            <TableCell align='center' sx={{ pr: 3 }}>
              Recordatorio
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {debtors.length === 0 ? (
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
                ✨ ¡Felicidades! No hay cuentas pendientes por cobrar
                actualmente.
              </TableCell>
            </TableRow>
          ) : (
            debtors.map((row) => {
              const porcentajeLiquidado =
                (row.totalPaid / row.totalCourse) * 100;
              return (
                <TableRow
                  key={row.enrollmentId}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.01)",
                    },
                  }}
                >
                  {/* Identidad */}
                  <TableCell sx={{ pl: 3 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                      {row.studentName}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {row.studentPhone || "Sin teléfono"}
                    </Typography>
                  </TableCell>
                  {/* Curso */}
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {row.courseTitle}
                    </Typography>
                  </TableCell>
                  {/* Barra de progreso de amortización */}
                  <TableCell sx={{ width: "220px" }}>
                    <Box sx={{ width: "100%" }}>
                      <Stack
                        direction='row'
                        sx={{ justifyContent: "space-between", mb: 0.5 }}
                      >
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        >
                          {Math.round(porcentajeLiquidado)}% Pagado
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant='determinate'
                        value={porcentajeLiquidado}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(0,0,0,0.04)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor:
                              porcentajeLiquidado < 30
                                ? "error.main"
                                : "warning.main",
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  {/* Saldo deudor */}
                  <TableCell align='right'>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 800, color: "error.main" }}
                    >
                      {FormatCurrency(row.debt)}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      De {FormatCurrency(row.totalCourse)}
                    </Typography>
                  </TableCell>
                  {/* Botón WhatsApp */}
                  <TableCell align='center' sx={{ pr: 3 }}>
                    <Tooltip title='Enviar Recordatorio por WhatsApp'>
                      <IconButton
                        onClick={() => handleWhatsAppCobro(row)}
                        sx={{
                          color: "#25D366",
                          backgroundColor: "rgba(37, 211, 102, 0.06)",
                          "&:hover": {
                            backgroundColor: "#25D366",
                            color: "#fff",
                          },
                        }}
                        size='small'
                      >
                        <WhatsAppIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Cobrance;
