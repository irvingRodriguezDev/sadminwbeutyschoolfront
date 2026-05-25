import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, Divider, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { supabase } from "../../../config/supabaseClient";
import DataDetail from "../../../components/common/inscriptions/DataDetail";
import FinancyData from "../../../components/common/inscriptions/FinancyData";
import AccessQr from "../../../components/common/inscriptions/AccessQr";
import HistoryPayments from "../../../components/common/inscriptions/HistoryPayments";
import StudentProfile from "../../../components/common/inscriptions/StudentProfile";

const COLORS = {
  primary: "#f06292",
  accent: "#e2208c",
  dark: "#2D2D2D",
  lightBg: "#FFF9FA",
  borderPink: "rgba(240, 98, 146, 0.15)",
};

const InscriptionDetail = ({ open, onClose, enrollmentData }) => {
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Cargar el historial de pagos cuando se selecciona una inscripción
  useEffect(() => {
    if (open && enrollmentData?.id) {
      const getHistory = async () => {
        setLoadingPayments(true);
        try {
          const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("enrollment_id", enrollmentData.id)
            .order("created_at", { ascending: false }); // Últimos pagos primero

          if (error) throw error;
          setPayments(data || []);
        } catch (e) {
          console.error("Error cargando historial de pagos:", e.message);
        } finally {
          setLoadingPayments(false);
        }
      };
      getHistory();
    }
  }, [open, enrollmentData]);

  if (!enrollmentData) return null;

  const total = Number(enrollmentData.total_amount || 0);
  const pagado = Number(enrollmentData.payment_amount || 0);
  const restante = total - pagado;
  const isLiquidado = enrollmentData.status === "completed";

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          borderTopLeftRadius: "32px",
          borderBottomLeftRadius: "32px",
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER PREMIUM */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${COLORS.lightBg} 0%, #FFFFFF 100%)`,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16, color: COLORS.dark }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            color: COLORS.dark,
            mt: 1,
          }}
        >
          Detalle de Inscripción
        </Typography>
        <Typography variant='caption' color='textSecondary'>
          ID único: {enrollmentData.id?.substring(0, 12)}...
        </Typography>
      </Box>

      <Divider />

      {/* CONTENIDO DEL DETALLE */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          flexGrow: 1,
          overflowY: "auto",
          pb: 5,
        }}
      >
        {/* 1. SECCIÓN: Perfil de la Alumna */}
        <StudentProfile enrollmentData={enrollmentData} COLORS={COLORS} />
        <Divider sx={{ borderStyle: "dashed" }} />

        {/* 2. SECCIÓN: Datos del Curso */}
        <DataDetail enrollmentData={enrollmentData} COLORS={COLORS} />

        {/* 3. SECCIÓN: Estado Financiero / Caja */}
        <FinancyData
          total={total}
          pagado={pagado}
          restante={restante}
          COLORS={COLORS}
        />

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* 4. SECCIÓN: Pase de Acceso (QR) */}
        <AccessQr
          enrollmentData={enrollmentData}
          isLiquidado={isLiquidado}
          restante={restante}
          COLORS={COLORS}
        />
        <Divider sx={{ borderStyle: "dashed" }} />

        {/* 5. SECCIÓN: Historial Cronológico de Pagos */}
        <HistoryPayments
          loadingPayments={loadingPayments}
          payments={payments}
          COLORS={COLORS}
        />
      </Box>
    </Drawer>
  );
};

export default InscriptionDetail;
