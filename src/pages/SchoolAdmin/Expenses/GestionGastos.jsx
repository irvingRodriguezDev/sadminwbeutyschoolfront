import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Card,
  CardContent,
  TextField,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { Add, TrendingDown, ReceiptLong } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { supabase } from "../../../config/supabaseClient";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import { alerts } from "../../../utils/alerts";
import Kpis from "./Kpis";
import AddExpenseModal from "./AddExpenseModal";
import { useAuth } from "../../../context/AuthContext";
import { useExpenses } from "../../../context/ExpensesContext";
import TableExpenses from "./TableExpenses";
import ExpenseMobileCard from "./ExpenseMobileCard";
const CATEGORIES = [
  "Todos",
  "Renta",
  "Sueldos",
  "Materiales",
  "Publicidad",
  "Servicios",
  "Otros",
];
const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2D2D2D",
  borderPink: "rgba(240, 98, 146, 0.15)",
  success: "#4caf50",
  warning: "#ed6c02",
};
const GestionGastos = () => {
  const { profile } = useAuth();
  const { fetchExpenses, expenses, loading } = useExpenses();
  const schoolId = profile?.school_id;
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [totalExpenses, setTotalExpenses] = useState(0);

  //modal agregar gasto
  const [openModalExpense, setOpenModalExpense] = useState(false);
  const handleClickOpenModalExpenses = () => {
    setOpenModalExpense(true);
  };
  const handleClickCloseModalExpenses = () => {
    setOpenModalExpense(false);
  };
  // 🌟 ESTADOS PARA LA PAGINACIÓN
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Por defecto mostramos 5 registros por vista

  useEffect(() => {
    if (schoolId) fetchExpenses(schoolId);
  }, [schoolId]);

  // Cada vez que cambien el filtro de categoría, regresamos a la página 0 para evitar errores visuales
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };

  // Manejadores de eventos de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reinicia a la primera página al cambiar el tamaño
  };

  // 1. Filtrado de datos por categoría
  const filteredExpenses = expenses.filter((exp) => {
    return categoryFilter === "Todos" ? true : exp.category === categoryFilter;
  });

  // 2. Aplicar paginación local a los datos ya filtrados
  const paginatedExpenses = filteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Grid container spacing={2}>
      {/* CABECERA */}
      <Grid
        size={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 900,
              background: `linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.primary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Control de Gastos
          </Typography>
          <Typography variant='body2' sx={{ color: "#6B6567" }}>
            Registra y categoriza las salidas de dinero de tu academia.
          </Typography>
        </Box>
      </Grid>
      <Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant='outlined'
          startIcon={<Add />}
          onClick={handleClickOpenModalExpenses}
          sx={{
            borderColor: COLORS.primary,
            color: COLORS.primary,
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              borderColor: COLORS.accent,
              backgroundColor: "rgba(240, 98, 146, 0.04)",
            },
          }}
        >
          Registrar Gasto
        </Button>
      </Grid>

      {/* TARJETAS INFORMATIVAS (KPIs) */}
      <Kpis />

      {/* SECCIÓN DE TABLA & FILTROS */}
      <Grid size={12} sx={{ display: { xs: "none", sm: "block" } }}>
        <TableExpenses
          filteredExpenses={filteredExpenses}
          CATEGORIES={CATEGORIES}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          paginatedExpenses={paginatedExpenses}
          page={page}
          rowsPerPage={rowsPerPage}
          handleCategoryChange={handleCategoryChange}
        />
      </Grid>
      {/* ================= VISTA MÓVIL (CARDS) ================= */}
      <Grid size={12} sx={{ display: { xs: "block", md: "none" } }}>
        <Typography sx={{ textAlign: "center" }}>
          Historial de Egresos
        </Typography>
        {/* Mapeamos exactamente tu misma prop de datos paginados */}
        {paginatedExpenses.length > 0 ? (
          paginatedExpenses.map((gasto) => (
            <Grid sx={12}>
              <ExpenseMobileCard
                key={gasto.id}
                gasto={gasto}
                CATEGORIES={CATEGORIES}
              />
            </Grid>
          ))
        ) : (
          <Typography
            variant='body2'
            color='textSecondary'
            align='center'
            sx={{ py: 4 }}
          >
            No se encontraron gastos en este bloque.
          </Typography>
        )}

        {/* Reutilizamos el mismo paginador de MUI abajo de las tarjetas de forma limpia */}
        <TablePagination
          component='div'
          count={filteredExpenses.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Filas:'
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              justifyContent: "center",
              px: 0,
            },
          }}
        />
      </Grid>
      <AddExpenseModal
        open={openModalExpense}
        onClose={handleClickCloseModalExpenses}
        schoolId={schoolId}
        onExpenseAdded={() => fetchExpenses(schoolId)}
      />
    </Grid>
  );
};

export default GestionGastos;
