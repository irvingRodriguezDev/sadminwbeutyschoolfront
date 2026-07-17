import {
  CalendarMonth,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import FormatDate from "../../../utils/FormatDate";
import { useExpenses } from "../../../context/ExpensesContext";
import Swal from "sweetalert2";
const TableExpenses = ({
  filteredExpenses,
  CATEGORIES,
  categoryFilter,
  setCategoryFilter,
  handleChangePage,
  handleChangeRowsPerPage,
  paginatedExpenses,
  page,
  rowsPerPage,
  handleCategoryChange,
}) => {
  const { deleteExpenseLogical } = useExpenses();
  const handleDeleteExpense = async (expenseId) => {
    try {
      // 1. Confirmación interactiva y cute con SweetAlert2
      const result = await Swal.fire({
        title: "¿Eliminar Gasto?",
        text: "El registro se archivará y dejará de contar en tus métricas actuales.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true, // Pone el botón de cancelar a la izquierda (UX estándar)
        confirmButtonColor: "#E53888", // Tono rosa Wapizima
        cancelButtonColor: "#6B6567",
        customClass: {
          popup: "animated fadeIn", // Si usas ganchos de animación
        },
      });

      // 2. Si el cliente confirma, procedemos al borrado lógico
      if (result.isConfirmed) {
        const response = await deleteExpenseLogical(expenseId);

        if (response.success) {
          alerts.success(
            "¡Eliminado!",
            "El egreso ha sido removido de la lista.",
          );
        } else {
          alerts.error(
            "Error",
            "Ocurrió un problema en el servidor, intenta de nuevo.",
          );
        }
      }
    } catch (error) {
      console.error(error);
      alerts.error(
        "Error Inesperado",
        "Ocurrió un problema mientras se procesaba la solicitud, intenta más tarde.",
      );
    }
  };
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
      }}
    >
      {/* Filtros */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant='h6' fontWeight={700} sx={{ color: "#2A2628" }}>
          Historial de Egresos
        </Typography>
        <TextField
          select
          size='small'
          label='Categoría'
          value={categoryFilter}
          onChange={handleCategoryChange}
          sx={{
            width: 180,
            "& .MuiOutlinedInput-root": { borderRadius: "10px" },
          }}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Tabla principal */}
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: "rgba(240, 98, 146, 0.04)" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 700, color: "#554D4F", textAlign: "center" }}
              >
                Fecha
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#554D4F", textAlign: "center" }}
              >
                Concepto
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#554D4F", textAlign: "center" }}
              >
                Categoría
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#554D4F", textAlign: "center" }}
                align='right'
              >
                Monto
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, color: "#554D4F", textAlign: "center" }}
                align='center'
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align='center' sx={{ fontWeight: 500 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {FormatDate(row.created_at)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography
                      variant='body2'
                      fontWeight={600}
                      color='textPrimary'
                    >
                      {row.title}
                    </Typography>
                    {row.description && (
                      <Typography variant='caption' color='textSecondary'>
                        {row.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                      label={row.category}
                      size='small'
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: "rgba(240, 98, 146, 0.08)",
                        color: "#E53888",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ fontWeight: 800, color: "#D81B60" }}
                  >
                    {FormatCurrency(row.amount)}
                  </TableCell>
                  <TableCell align='center'>
                    {/* <IconButton size='small' sx={{ color: "#554D4F" }}>
                      <EditOutlined fontSize='small' />
                    </IconButton> */}
                    <IconButton
                      onClick={() => handleDeleteExpense(row.id)}
                      size='small'
                      sx={{ color: "#d32f2f" }}
                    >
                      <DeleteOutlined fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align='center'
                  sx={{ py: 6, color: "#6B6567" }}
                >
                  No hay gastos registrados en esta categoría.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🌟 CONTROLADOR DE PAGINACIÓN PREMIUM */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]} // El usuario puede elegir cuántos ver por página
        component='div'
        count={filteredExpenses.length} // Cuenta total dinámica basada en la lista filtrada
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Gastos por página:'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          mt: 2,
          color: "#554D4F",
          "& .MuiTablePagination-actions": {
            color: "#E53888", // Flechas en los tonos de la marca
          },
          "& .MuiTablePagination-select": {
            fontWeight: 600,
          },
        }}
      />
    </Paper>
  );
};

export default TableExpenses;
