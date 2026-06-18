import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Tabs,
  Tab,
  Button,
  Alert,
  Grid,
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

// 🌸 Paleta de Colores Luxury del Sistema
const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2D2D2D",
  borderPink: "rgba(240, 98, 146, 0.15)",
  success: "#4caf50",
  warning: "#ed6c02",
};

const GestionFinanzas = () => {
  const { profile } = useAuth();

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
    // 1. Limpiamos el teléfono: dejamos solo números (quita espacios, "+", "-", etc.)
    // Importante para México: debe llevar el código de país (ej: 521XXXXXXXXXX o 52XXXXXXXXXX)
    const telefonoLimpio = row.studentPhone
      ? row.studentPhone.replace(/\D/g, "")
      : "";

    if (!telefonoLimpio) {
      alert("Esta alumna no tiene un número de teléfono válido registrado.");
      return;
    }

    // 2. Formateamos la fecha a algo más humano (Ej: de 2026-05-27 a 27/05/2026)
    let fechaFormateada = row.fechaInicioCurso || "";
    if (fechaFormateada.includes("-")) {
      const [year, month, day] = fechaFormateada.split("-");
      fechaFormateada = `${day}/${month}/${year}`;
    }

    // 3. Nombre de la escuela dinámico y seguro
    const nombreEscuela = profile?.escuela?.name || "la academia";

    // 4. Construimos el mensaje usando \n explícitos para saltos de línea perfectos
    // Usamos los asteriscos (*) que WhatsApp reconoce de forma nativa para poner texto en NEGRITA
    const textoMensaje =
      `Hola, *${row.studentName}*. Te saludamos de ${nombreEscuela}.\n\n` +
      `Te recordamos de manera atenta que cuentas con un saldo pendiente de *${FormatCurrency(row.debt)}* ` +
      `en tu inscripcion al curso *${row.courseTitle}*, el cual dara inicio el dia *${fechaFormateada}*.\n\n` +
      `Puedes liquidar o realizar un abono directamente en el mostrador antes de iniciar tu sesion. ¡Que tengas un excelente dia!`;

    // 5. Codificamos el string plano de forma segura
    const mensajeURL = encodeURIComponent(textoMensaje);

    // 6. Abrimos la API universal de WhatsApp (funciona en móvil y PC de corrido)
    window.open(
      `https://api.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensajeURL}`,
      "_blank",
    );
  };

  if (loadingFinance)
    return <LoadingScreen message='Abriendo caja y cargando reportes...' />;

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 900,
            background: `linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.primary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Control Financiero y caja
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant='body2' color='textSecondary'>
          Monitorea los ingresos de la academia, revisa cortes de caja diarios y{" "}
          <br />
          gestiona la cartera vencida.{" "}
        </Typography>
      </Grid>
      <Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={refrescarFinanzas}
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
          Actualizar Cuentas
        </Button>
      </Grid>
      <Grid size={12}>
        {error && (
          <Alert severity='error' sx={{ mb: 3, borderRadius: "14px" }}>
            {error}
          </Alert>
        )}
      </Grid>
      <Grid size={12}>
        <IndicatorsFinances COLORS={COLORS} cashboxSummary={cashboxSummary} />
      </Grid>
      <Grid size={12}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            border: `1px solid ${COLORS.borderPink}`,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0px 15px 40px rgba(242, 32, 140, 0.03)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              pt: 2,
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.accent,
                height: 3,
                borderRadius: "3px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#777",
                "&.Mui-selected": { color: COLORS.accent },
              },
            }}
          >
            <Tab
              icon={<ReceiptIcon sx={{ fontSize: 18 }} />}
              iconPosition='start'
              label={`Ingresos de Hoy (${cashboxSummary.transactionCount})`}
            />
            <Tab
              icon={<WarningIcon sx={{ fontSize: 18 }} />}
              iconPosition='start'
              label={`Cartera Vencida (${debtors.length})`}
            />
          </Tabs>

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
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GestionFinanzas;
