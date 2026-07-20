import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ReceiptLong as ReceiptIcon,
  Refresh as RefreshIcon,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";
import { useFinance } from "../../../context/FinanzeContext";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import LoadingScreen from "../../../components/common/LoadingScreen";
import IndicatorsFinances from "./IndicatorsFinances";
import IncomingsToday from "./IncomingsToday";
import Cobrance from "./Cobrance";
import { useAuth } from "../../../context/AuthContext";

// 🌸 Paleta de Colores Luxury del Sistema (Consistencia Floreciendo Juntas)
const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2A2628",
  borderPink: "rgba(240, 98, 146, 0.12)",
  success: "#4caf50",
  warning: "#ed6c02",
};

const GestionFinanzas = () => {
  const { profile } = useAuth();
  const theme = useTheme();

  // Detectamos si es pantalla pequeña (móvil o tablet pequeña)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    cashboxSummary,
    transactions,
    debtors,
    loadingFinance,
    error,
    refrescarFinanzas,
  } = useFinance();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    refrescarFinanzas();
  }, [refrescarFinanzas]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 💬 Generador Automático de Mensaje de Cobro para WhatsApp
  const handleWhatsAppCobro = (row) => {
    const telefonoLimpio = row.studentPhone
      ? row.studentPhone.replace(/\D/g, "")
      : "";

    if (!telefonoLimpio) {
      alert("Esta alumna no tiene un número de teléfono válido registrado.");
      return;
    }

    let fechaFormateada = row.fechaInicioCurso || "";
    if (fechaFormateada.includes("-")) {
      const [year, month, day] = fechaFormateada.split("-");
      fechaFormateada = `${day}/${month}/${year}`;
    }

    const nombreEscuela = profile?.escuela?.name || "la academia";

    const textoMensaje =
      `Hola, *${row.studentName}*. Te saludamos de ${nombreEscuela}.\n\n` +
      `Te recordamos de manera atenta que cuentas con un saldo pendiente de *${FormatCurrency(row.debt)}* ` +
      `en tu inscripción al curso *${row.courseTitle}*, el cual dará inicio el día *${fechaFormateada}*.\n\n` +
      `Puedes liquidar o realizar un abono directamente en el mostrador antes de iniciar tu sesión. ¡Que tengas un excelente día!`;

    const mensajeURL = encodeURIComponent(textoMensaje);

    window.open(
      `https://api.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensajeURL}`,
      "_blank",
    );
  };

  if (loadingFinance)
    return <LoadingScreen message='Abriendo caja y cargando reportes...' />;

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* CABECERA DE LA SECCIÓN */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 900,
            background: `linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.primary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
          }}
        >
          Control Financiero y Caja
        </Typography>
        <Typography
          variant='body2'
          color='textSecondary'
          sx={{ mt: 0.5, maxWidth: 500, lineHeight: 1.4 }}
        >
          Monitorea los ingresos de la academia, revisa cortes de caja diarios y
          gestiona la cartera vencida.
        </Typography>
      </Grid>

      {/* BOTÓN DE ACCIÓN ACCESIBLE */}
      <Grid
        size={{ xs: 12, md: 4 }}
        sx={{
          display: "flex",
          justifyContent: { xs: "stretch", md: "end" },
          alignItems: "center",
        }}
      >
        <Button
          variant='outlined'
          fullWidth={isMobile}
          startIcon={<RefreshIcon />}
          onClick={refrescarFinanzas}
          sx={{
            borderColor: COLORS.primary,
            color: COLORS.primary,
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 700,
            py: { xs: 1.2, md: 1 },
            "&:hover": {
              borderColor: COLORS.accent,
              backgroundColor: "rgba(240, 98, 146, 0.04)",
            },
          }}
        >
          Actualizar Cuentas
        </Button>
      </Grid>

      {/* MANEJO DE ERRORES */}
      <Grid size={12}>
        {error && (
          <Alert
            severity='error'
            sx={{
              borderRadius: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            {error}
          </Alert>
        )}
      </Grid>

      {/* INDICADORES / KPIS */}
      <Grid size={12}>
        <IndicatorsFinances COLORS={COLORS} cashboxSummary={cashboxSummary} />
      </Grid>

      {/* CONTENEDOR PRINCIPAL TABS & CONTENIDO */}
      <Grid size={12}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            border: `1px solid ${COLORS.borderPink}`,
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0px 12px 35px rgba(242, 32, 140, 0.02)",
          }}
        >
          {/* NAVEGACIÓN TOTALMENTE RESPONSIVA */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            centered={isMobile}
            sx={{
              px: { xs: 1, md: 3 },
              pt: 2,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              backgroundColor: "#FAF8F9", // Un fondo sutil para separar el área de navegación
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.accent,
                height: 3,
                borderRadius: "3px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 800,
                fontSize: { xs: "0.82rem", sm: "0.95rem" },
                minHeight: 48,
                color: "#776E71",
                gap: 1,
                "&.Mui-selected": { color: COLORS.accent },
              },
            }}
          >
            <Tab
              icon={<ReceiptIcon sx={{ fontSize: 18 }} />}
              iconPosition={isMobile ? "top" : "start"} // En móviles el icono va arriba para ganar espacio horizontal
              label={
                isMobile
                  ? `Ingresos (${cashboxSummary.transactionCount})`
                  : `Ingresos de Hoy (${cashboxSummary.transactionCount})`
              }
            />
            <Tab
              icon={<WarningIcon sx={{ fontSize: 18 }} />}
              iconPosition={isMobile ? "top" : "start"}
              label={
                isMobile
                  ? `Cobranza (${debtors.length})`
                  : `Cartera Vencida (${debtors.length})`
              }
            />
          </Tabs>

          {/* ÁREA DE CONTENIDO */}
          <Box sx={{ p: { xs: 1.5, md: 0 } }}>
            {/* PESTAÑA 1: TRANSACCIONES DEL DÍA */}
            {activeTab === 0 && (
              <IncomingsToday transactions={transactions} COLORS={COLORS} />
            )}

            {/* PESTAÑA 2: CARTERA VENCIDA / COBRANZA */}
            {activeTab === 1 && (
              <Cobrance
                debtors={debtors}
                handleWhatsAppCobro={handleWhatsAppCobro}
                COLORS={COLORS}
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GestionFinanzas;
