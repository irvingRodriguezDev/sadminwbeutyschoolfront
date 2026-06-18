import React, { useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { CheckCircle, Cancel, CenterFocusStrong } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { supabase } from "../../../config/supabaseClient";

// Instancia de tu cliente de Supabase

const MySwal = withReactContent(Swal);

// --- PALETA COHERENTE CON EL BRANDING PREMIUN ---
const COLORS = {
  brandPink: "#DF228A", // Fucsia Identitario Wapizima
  deepText: "#2A2628", // Oscuro Orgánico Editorial
  softBg: "#FAFAFA", // Lienzo Limpio
  white: "#ffffff",
  success: "#4caf50",
  error: "#f44336",
};

const ScannerView = () => {
  const scanLock = useRef(false);
  const lastScanRef = useRef({ code: null, time: 0 });

  const [isScanning, setIsScanning] = useState(false);
  const [lastStatus, setLastStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (detectedCodes) => {
    // LOCK ABSOLUTO INMEDIATO PARA PREVENIR DOBLE LLAMADA EN RENDER
    if (scanLock.current) return;
    scanLock.current = true;

    try {
      if (!detectedCodes || detectedCodes.length === 0) {
        scanLock.current = false;
        return;
      }

      const code = detectedCodes[0]?.rawValue;
      if (!code) {
        scanLock.current = false;
        return;
      }

      const now = Date.now();
      // Anti-bounce de 3 segundos para el mismo código
      if (
        lastScanRef.current.code === code &&
        now - lastScanRef.current.time < 3000
      ) {
        scanLock.current = false;
        return;
      }

      lastScanRef.current = { code, time: now };
      setIsScanning(false);
      setLoading(true);

      // ==========================================
      // 🚀 LOGICA DE NEGOCIO REAL CON SUPABASE
      // ==========================================

      // 1. Verificar si el QR existe y la inscripción está LIQUIDADA ('completed')
      const { data: enrollment, error: enrollmentErr } = await supabase
        .from("enrollments")
        .select(
          `
          id,
          status,
          student_id,
          course_id,
          students ( name ),
          cursos ( titulo, tipo_curso )
        `,
        )
        .eq("qr_code_token", code)
        .maybeSingle();

      if (enrollmentErr) throw enrollmentErr;

      if (!enrollment) {
        throw new Error(
          "El código QR escaneado no corresponde a ninguna inscripción registrada.",
        );
      }

      if (enrollment.status !== "completed") {
        setLastStatus("error");
        await MySwal.fire({
          icon: "warning",
          title: "ACCESO DENEGADO",
          text: `La alumna ${enrollment.students.name} tiene un saldo pendiente. Debe liquidar en mostrador.`,
          showConfirmButton: true,
          confirmButtonColor: COLORS.brandPink,
        });
        return;
      }

      const fechaHoy = new Date().toISOString().split("T")[0];

      // 2. Ejecutar validación dependiendo de si es Curso o Taller
      if (enrollment.cursos.tipo_curso === "Taller") {
        // Si es taller, no importa la fecha, solo puede existir UNA asistencia en la vida
        const { data: extAttendance } = await supabase
          .from("attendance")
          .select("id")
          .eq("enrollment_id", enrollment.id)
          .maybeSingle();

        if (extAttendance) {
          throw new Error(
            `Este pase de Taller ya fue utilizado anteriormente.`,
          );
        }
      } else {
        // Si es curso, validamos que no se haya registrado ya el día de HOY
        const { data: extAttendance } = await supabase
          .from("attendance")
          .select("id")
          .eq("student_id", enrollment.student_id)
          .eq("course_id", enrollment.course_id)
          .eq("fecha_asistencia", fechaHoy)
          .maybeSingle();

        if (extAttendance) {
          throw new Error(
            `La asistencia de hoy para este curso ya fue registrada.`,
          );
        }
      }

      // 3. Registrar la asistencia de manera oficial
      const { error: insertErr } = await supabase.from("attendance").insert({
        enrollment_id: enrollment.id,
        student_id: enrollment.student_id,
        course_id: enrollment.course_id,
        fecha_asistencia: fechaHoy,
        // scanned_by: (aquí puedes inyectar el id del admin logueado si lo tienes)
      });

      if (insertErr) throw insertErr;

      // Éxito Absoluto
      setLastStatus("success");
      await MySwal.fire({
        icon: "success",
        title: "ACCESO CONCEDIDO",
        html: `<strong>Alumna:</strong> ${enrollment.students.name}<br/><strong>Evento:</strong> ${enrollment.cursos.titulo}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error en control de acceso:", error.message);
      setLastStatus("error");
      await MySwal.fire({
        icon: "error",
        title: "ENTRADA RECHAZADA",
        text: error.message || "Error al conectar con el servidor",
        showConfirmButton: false,
        // timer: 2500,
      });
    } finally {
      setLoading(false);
      // Retardo estético para reactivar la cámara de inmediato al terminar la alerta
      setTimeout(() => {
        setIsScanning(true);
        scanLock.current = false;
      }, 500);
    }
  };

  return (
    <Grid
      container
      sx={{
        background: "#FDF7F9",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        backgroundImage: `radial-gradient(circle at 50% 10%, rgba(223, 34, 138, 0.02) 0%, transparent 50%)`,
      }}
    >
      <Container maxWidth='sm'>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: "36px",
              overflow: "hidden",
              background: COLORS.white,
              p: { xs: 4, sm: 5 },
              textAlign: "center",
              border: `1px solid rgba(223, 34, 138, 0.12)`,
              boxShadow: "0px 32px 64px rgba(42, 38, 40, 0.04)",
            }}
          >
            {/* ENCABEZADO EDITORIAL DE MARCA */}
            <Stack spacing={0.5} sx={{ mb: 4 }}>
              <Typography
                sx={{
                  letterSpacing: 4,
                  fontWeight: 800,
                  color: COLORS.brandPink,
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Wapizima: Check-in
              </Typography>
              <Typography
                variant='h5'
                sx={{
                  fontWeight: 400,
                  color: COLORS.deepText,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.75rem",
                }}
              >
                {isScanning ? "Escaneando pases..." : "Control de Asistencia"}
              </Typography>
            </Stack>

            {/* VISOR OSCURO PREMIUM REINVENTADO */}
            <Grid
              container
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: "28px",
                overflow: "hidden",
                bgcolor: "#1A1718", // Fondo más inmersivo oscuro
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid rgba(0, 0, 0, 0.04)`,
                boxShadow: "inset 0px 4px 20px rgba(0, 0, 0, 0.4)",
                transition: "all 0.4s ease",
              }}
            >
              <AnimatePresence mode='wait'>
                {isScanning ? (
                  <motion.div
                    key='scanner'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {/* Enmarcado y Mira Láser Fina */}
                    <Grid
                      container
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 2,
                        pointerEvents: "none",
                        border: "45px solid rgba(26, 23, 24, 0.65)", // Máscara cinemática
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Grid
                        sx={{
                          width: "100%",
                          height: "100%",
                          border: `2px solid ${COLORS.brandPink}`,
                          borderRadius: "16px",
                          position: "relative",
                          // Línea láser horizontal dinámica
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            width: "100%",
                            height: "2px",
                            backgroundColor: COLORS.brandPink,
                            top: "50%",
                            left: 0,
                            boxShadow: `0px 0px 10px ${COLORS.brandPink}`,
                          },
                        }}
                      />
                    </Grid>

                    <Scanner
                      formats={["qr_code"]}
                      onScan={handleScan}
                      onError={(error) => console.log("Lector Error:", error)}
                      constraints={{ facingMode: "environment" }}
                      styles={{
                        container: { width: "100%", height: "100%" },
                        video: {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        },
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key='status'
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {loading ? (
                      <CircularProgress
                        sx={{ color: COLORS.brandPink }}
                        size={50}
                      />
                    ) : lastStatus === "success" ? (
                      <CheckCircle
                        sx={{ fontSize: 90, color: COLORS.success }}
                      />
                    ) : lastStatus === "error" ? (
                      <Cancel sx={{ fontSize: 90, color: COLORS.error }} />
                    ) : (
                      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                        <CenterFocusStrong
                          sx={{ fontSize: 64, color: "rgba(255,255,255,0.25)" }}
                        />
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            letterSpacing: 2,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          SISTEMA LISTO
                        </Typography>
                      </Stack>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>

            {/* BOTÓN UNIFICADO ESTILO PASARELA */}
            <Stack spacing={2} sx={{ mt: 4 }}>
              <Button
                fullWidth
                variant='contained'
                disableElevation
                disabled={loading}
                onClick={() => {
                  setLastStatus(null);
                  setIsScanning(true);
                }}
                sx={{
                  py: 2,
                  borderRadius: "99px",
                  background: `linear-gradient(90deg, ${COLORS.deepText} 0%, #463D40 100%)`,
                  color: COLORS.white,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "1px",
                  textTransform: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  boxShadow: "0 12px 32px rgba(42, 36, 38, 0.15)",
                  display: isScanning ? "none" : "flex",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: COLORS.brandPink,
                    boxShadow: "0 12px 32px rgba(223, 34, 138, 0.25)",
                  },
                }}
              >
                {lastStatus
                  ? "Escanear Siguiente Pase"
                  : "Iniciar Lector de Pases ⚡"}
              </Button>

              {isScanning && (
                <Button
                  fullWidth
                  variant='outlined'
                  onClick={() => setIsScanning(false)}
                  sx={{
                    py: 1.5,
                    borderRadius: "99px",
                    borderColor: "rgba(42, 38, 40, 0.2)",
                    color: COLORS.deepText,
                    fontWeight: 700,
                    textTransform: "none",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.85rem",
                    "&:hover": {
                      borderColor: COLORS.brandPink,
                      color: COLORS.brandPink,
                      backgroundColor: "rgba(223, 34, 138, 0.02)",
                    },
                  }}
                >
                  Apagar Cámara
                </Button>
              )}
            </Stack>

            <Typography
              sx={{
                mt: 4,
                fontSize: "0.65rem",
                color: "rgba(65, 59, 61, 0.4)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Pases de Acceso • Control de Asistencia Diaria
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Grid>
  );
};

export default ScannerView;
