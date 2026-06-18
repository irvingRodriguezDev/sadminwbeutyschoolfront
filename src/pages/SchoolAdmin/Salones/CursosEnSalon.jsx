import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  CircularProgress,
  Chip,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { motion, AnimatePresence } from "framer-motion";
import FormatDate from "../../../utils/FormatDate";
// Cliente de Supabase e utilitario de fecha que limpiamos ayer
import { supabase } from "../../../config/supabaseClient";

const COLORS = {
  brandPink: "#DF228A",
  deepText: "#2A2628",
  softBg: "rgba(223, 34, 138, 0.02)",
  white: "#ffffff",
  border: "rgba(223, 34, 138, 0.12)",
};

const CursosEnSalon = ({ open, idSalon, handleClose }) => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCursosDelSalon = async () => {
      if (!idSalon || !open) return;

      setLoading(true);
      try {
        // 1. Obtenemos la fecha de hoy limpia en formato México YYYY-MM-DD
        const hoy = new Date().toLocaleDateString("sv-SE", {
          timeZone: "America/Mexico_City",
        });

        // 2. Traemos los cursos asignados a este salón que inicien hoy o después
        const { data, error } = await supabase
          .from("cursos")
          .select(
            `
            id,
            titulo,
            maestro,
            fecha_inicio,
            tipo_curso,
            sold_out,
            enrollments(count)
          `,
          )
          .eq("salon_id", idSalon)
          .gte("fecha_inicio", hoy) // Próximos o actuales
          .order("fecha_inicio", { ascending: true }); // El más cercano primero

        if (error) throw error;
        setCursos(data || []);
      } catch (err) {
        console.error("❌ Error al cargar cursos del salón:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursosDelSalon();
  }, [idSalon, open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "28px",
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.white,
            p: { xs: 1, sm: 2.5 },
            boxShadow: "0px 24px 60px rgba(42, 38, 40, 0.12)",
          },
        },
      }}
    >
      {/* CABECERA EDITORIAL */}
      <DialogTitle
        component='div'
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack spacing={0.5}>
          <Typography
            sx={{
              letterSpacing: 3,
              fontWeight: 800,
              color: COLORS.brandPink,
              fontSize: "0.65rem",
              textTransform: "uppercase",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Agenda del Espacio
          </Typography>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 400,
              color: COLORS.deepText,
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "1.5rem",
            }}
          >
            Próximos Cursos
          </Typography>
        </Stack>

        <IconButton
          onClick={handleClose}
          sx={{
            color: "rgba(42, 38, 40, 0.4)",
            "&:hover": { color: COLORS.brandPink },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* CONTENIDO DEL MODAL */}
      <DialogContent sx={{ p: 2, mt: 1 }}>
        <AnimatePresence mode='wait'>
          {loading ? (
            /* LAYER DE CARGA PREMIUM */
            <Grid
              container
              sx={{
                py: 6,
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
              }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography sx={{ textAlign: "center" }}>
                <CircularProgress size={40} sx={{ color: COLORS.brandPink }} />
              </Typography>
            </Grid>
          ) : cursos.length === 0 ? (
            /* ESTADO VACÍO ELEGANTE */
            <Grid
              container
              direction='column'
              alignItems='center'
              justifyContent='center'
              sx={{ py: 6, textAlign: "center" }}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Typography sx={{ textAlign: "center" }}>
                <CalendarMonthRoundedIcon
                  sx={{
                    fontSize: 48,
                    color: "rgba(42, 38, 40, 0.15)",
                    mb: 1.5,
                  }}
                />
              </Typography>
              <Typography
                sx={{
                  color: "#8A8487",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                No hay cursos programados próximamente para este salón.
              </Typography>
            </Grid>
          ) : (
            /* LISTADO ACCESIBLE TIPO TIMELINE ASIMÉTRICO */
            <Stack
              spacing={2}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {cursos.map((curso, idx) => {
                const totalInscritas = curso.enrollments?.[0]?.count || 0;

                return (
                  <Grid
                    container
                    key={curso.id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                      bgcolor: COLORS.softBg,
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: "rgba(223, 34, 138, 0.2)",
                        bgcolor: "#ffffff",
                        boxShadow: "0px 10px 25px rgba(223, 34, 138, 0.04)",
                      },
                    }}
                  >
                    {/* INFO PRINCIPAL DEL EVENTO */}
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Typography
                        variant='body1'
                        sx={{
                          fontWeight: 700,
                          color: COLORS.deepText,
                          fontFamily: "'Montserrat', sans-serif",
                          lineHeight: 1.3,
                          mb: 0.5,
                        }}
                      >
                        {curso.titulo}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          color: "#8A8487",
                          display: "block",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Instructor: <strong>{curso.maestro}</strong>
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          color: COLORS.brandPink,
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Inicio: {FormatDate(curso.fecha_inicio)}
                      </Typography>
                    </Grid>

                    {/* METRICAS DE OCUPACIÓN Y TIPO */}
                    <Grid
                      size={{ xs: 12, sm: 5 }}
                      container
                      justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                      sx={{ mt: { xs: 1.5, sm: 0 } }}
                    >
                      <Stack
                        sx={{ alignItems: "center" }}
                        direction='row'
                        spacing={1}
                      >
                        <Chip
                          label={curso.tipo_curso}
                          size='small'
                          sx={{
                            textTransform: "uppercase",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            bgcolor: "rgba(0,0,0,0.04)",
                            color: COLORS.deepText,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        />
                        <Chip
                          icon={
                            <GroupsRoundedIcon
                              style={{
                                fontSize: 14,
                                color: curso.sold_out ? "#d81b60" : "inherit",
                              }}
                            />
                          }
                          label={`${totalInscritas} ${curso.sold_out ? "¡Lleno!" : "Alumnas"}`}
                          size='small'
                          sx={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: curso.sold_out
                              ? "rgba(223, 34, 138, 0.1)"
                              : "rgba(0,0,0,0.02)",
                            color: curso.sold_out
                              ? COLORS.brandPink
                              : COLORS.deepText,
                            border: curso.sold_out
                              ? `1px solid rgba(223, 34, 138, 0.15)`
                              : "none",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                );
              })}
            </Stack>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CursosEnSalon;
