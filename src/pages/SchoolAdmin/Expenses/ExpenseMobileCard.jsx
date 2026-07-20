import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Chip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CalendarToday,
  LocalOffer,
} from "@mui/icons-material";
import { FormatCurrency } from "../../../utils/FormatCurrency";

const ExpenseMobileCard = ({ gasto, CATEGORIES }) => {
  const [open, setOpen] = useState(false);

  // Encontrar la configuración de la categoría (color, etiqueta) si existe
  const categoriaInfo = CATEGORIES?.[gasto.category] || {
    label: gasto.category || "General",
    color: "#6B6567",
  };

  return (
    <Card
      sx={{
        mb: 2,
        width: "100%",
        borderRadius: "16px",
        border: "1px solid #EAEAEA",
        boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Fila Superior: Categoría y Fecha */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Chip
            label={categoriaInfo.label}
            size='small'
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              bgcolor: "rgba(240, 98, 146, 0.08)",
              color: "#E53888",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#6B6567",
            }}
          >
            <CalendarToday sx={{ fontSize: 12 }} />
            <Typography variant='caption'>
              {new Date(gasto.expense_date).toLocaleDateString("es-MX")}
            </Typography>
          </Box>
        </Box>

        {/* Fila Central: Concepto y Monto */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ pr: 2 }}>
            <Typography
              variant='subtitle2'
              fontWeight={700}
              color='#2A2628'
              sx={{ lineHeight: 1.2 }}
            >
              {gasto.title}
            </Typography>
            {gasto.supplier && (
              <Typography
                variant='caption'
                color='#6B6567'
                sx={{ display: "block", mt: 0.5 }}
              >
                Prov: {gasto.supplier}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography variant='subtitle1' fontWeight={800} color='#EF4444'>
              {FormatCurrency(gasto.amount || 0)}
            </Typography>

            {/* Habilitamos el botón solo si el gasto tiene notas o datos extra que requieran despliegue */}
            {gasto.notes && (
              <IconButton
                size='small'
                onClick={() => setOpen(!open)}
                sx={{ color: "#2A2628", p: 0.5 }}
              >
                {open ? (
                  <KeyboardArrowUp sx={{ fontSize: 18 }} />
                ) : (
                  <KeyboardArrowDown sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Despliegue de Detalles Adicionales (Notas/Comentarios del Gasto) */}
        {gasto.notes && (
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: "1px dashed #EAEAEA",
                bgcolor: "#FAFAFA",
                p: 1.5,
                borderRadius: "8px",
              }}
            >
              <Typography
                variant='caption'
                fontWeight={700}
                color='#2A2628'
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <LocalOffer sx={{ fontSize: 10, color: "#6B6567" }} /> NOTAS
                INTERNAS:
              </Typography>
              <Typography
                variant='caption'
                color='#554D4F'
                sx={{ whiteSpace: "pre-line" }}
              >
                {gasto.notes}
              </Typography>
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseMobileCard;
