import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Button,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormatDate from "../../utils/FormatDate";
import { Link } from "react-router-dom";
import { FormatCurrency } from "../../utils/FormatCurrency";
import copiarLink from "../../utils/CopiarLink";
const StatCard = ({ icon, value, label }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "12px",
        border: "1px solid rgba(240, 98, 146, 0.6)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
          color: "#f06292",
        }}
      >
        {icon}
      </Box>

      <Typography variant='h5' fontWeight={800}>
        {value}
      </Typography>

      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Paper>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        py: 1.5,
      }}
    >
      <Box sx={{ color: "#f06292" }}>{icon}</Box>

      <Box>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: "block" }}
        >
          {label}
        </Typography>

        <Typography variant='body2' fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default function DetalleEscuela({ open, onClose, school }) {
  const data = school;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle
        sx={{
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 58,
                height: 58,
                bgcolor: "rgba(229, 176, 195, 0.6)",
                color: "#f06292",
                fontWeight: 800,
              }}
            >
              W
            </Avatar>

            <Box>
              <Typography
                variant='h5'
                fontWeight={800}
                sx={{ color: "#f06292" }}
              >
                {data.name}
              </Typography>

              <Typography
                variant='body2'
                sx={{ color: "#f06292" }}
                fontWeight={700}
              >
                Información completa de la escuela
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* KPIS */}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<PeopleIcon />}
              value={data.total_estudiantes}
              label='Alumnos Registrados'
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<MenuBookIcon />}
              value={data.total_cursos}
              label='Cursos Activos'
            />
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<AttachMoneyIcon />}
              value={FormatCurrency(data.ingresos_20_dias)}
              label='Ingresos (Últimos 20 días)'
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* INFORMACIÓN GENERAL */}

          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                border: "1px solid rgba(240,98,146,.6)",
              }}
            >
              <Typography variant='h6' fontWeight={700} mb={2}>
                Información General
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <InfoRow
                icon={<SchoolIcon />}
                label='Escuela'
                value={data.name}
              />

              <InfoRow
                icon={<LocationOnIcon />}
                label='Dirección'
                value={data.address}
              />

              <InfoRow
                icon={<EmailIcon />}
                label='Correo'
                value={data.perfil?.email}
              />

              <InfoRow
                icon={<LanguageIcon />}
                label='Sitio Web'
                value={`${import.meta.env.VITE_URL_CLIENT}academia/${data.slug}`}
              />
            </Paper>
          </Grid>

          {/* STRIPE */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                border: "1px solid rgba(240,98,146,.6)",
                mb: 3,
              }}
            >
              <Typography variant='h6' fontWeight={700} mb={2}>
                Stripe
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Chip
                icon={<CheckCircleIcon sx={{ color: "#2e7d32" }} />}
                label='Conectado'
                sx={{
                  bgcolor: "rgba(46,125,50,.08)",
                  color: "#2e7d32",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <br />
              <Typography variant='caption' color='text.secondary'>
                Stripe Account ID
              </Typography>

              <Typography variant='body2' fontWeight={700} mb={2}>
                {data.stripe_account_id}
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                Fecha de Registro
              </Typography>

              <Typography variant='body2' fontWeight={700} mb={2}>
                {FormatDate(data.created_at)}
              </Typography>
            </Paper>

            {/* ACCIONES */}

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                border: "1px solid rgba(240,98,146,.6)",
              }}
            >
              <Typography variant='h6' fontWeight={700} mb={2}>
                Acciones
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Button
                  fullWidth
                  startIcon={<ContentCopyIcon />}
                  variant='outlined'
                  onClick={() =>
                    copiarLink({
                      data: `${import.meta.env.VITE_URL_CLIENT}academia/${data.slug}`,
                    })
                  }
                >
                  Copiar URL Pública
                </Button>

                <Link
                  to={`${import.meta.env.VITE_URL_CLIENT}academia/${data.slug}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    fullWidth
                    startIcon={<OpenInNewIcon />}
                    variant='contained'
                    sx={{
                      bgcolor: "#f06292",
                      "&:hover": {
                        bgcolor: "#f06292",
                      },
                    }}
                  >
                    Ver Portal
                  </Button>
                </Link>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
