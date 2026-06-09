import {
  Grid,
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";

import { motion } from "framer-motion";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useState } from "react";
import DetalleEscuela from "./DetalleEscuela";
import InfoIcon from "@mui/icons-material/Info";
import copiarLink from "../../utils/CopiarLink";
const CardEscuela = ({ escuela, index }) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleOpen = (school) => {
    setSelectedSchool(school);
    setOpenDetail(true);
  };

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: index * 0.05,
        }}
        whileHover={{
          y: -6,
          scale: 1.01,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: "100%",
            borderRadius: "18px",
            border: "1px solid rgba(0,0,0,0.07)",
            bgcolor: "#fff",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all .25s ease",
            "&:hover": {
              borderColor: "rgba(240,98,146,.25)",
              boxShadow: "0 18px 40px rgba(240,98,146,.10)",
            },
          }}
        >
          {/* Barra superior */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: "#f06292",
            }}
          />

          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "rgba(240,98,146,.12)",
                color: "#d81b60",
                fontWeight: 800,
                fontSize: "1rem",
              }}
            >
              {escuela.name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 800,
                  color: "#1a1a1a",
                  lineHeight: 1.3,
                  letterSpacing: "-0.3px",
                }}
              >
                {escuela.name}
              </Typography>

              <Typography
                variant='caption'
                sx={{
                  color: "#9e9e9e",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Academia
              </Typography>
              <br />
              <Typography
                variant='caption'
                sx={{
                  color: "#9e9e9e",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                {escuela.perfil.email}
              </Typography>
            </Box>
          </Box>

          {/* Dirección */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              minHeight: 50,
            }}
          >
            <LocationOnIcon
              sx={{
                fontSize: 18,
                color: "#f06292",
                mt: 0.2,
              }}
            />

            <Typography
              variant='body2'
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                fontSize: ".85rem",
                lineHeight: 1.4,
              }}
            >
              {escuela.address || "Ubicación no definida"}
            </Typography>
          </Box>

          {/* Espaciador */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              mt: 2,
              borderTop: "1px solid rgba(0,0,0,.05)",
            }}
          >
            <Chip
              icon={
                escuela.stripe_account_id ? (
                  <CheckCircleIcon />
                ) : (
                  <PendingIcon />
                )
              }
              label={escuela.stripe_account_id ? "CONECTADO" : "PENDIENTE"}
              size='small'
              sx={{
                bgcolor: escuela.stripe_account_id
                  ? "rgba(46,125,50,.08)"
                  : "rgba(237,108,2,.08)",
                color: escuela.stripe_account_id ? "#2e7d32" : "#ed6c02",
                fontWeight: 800,
                fontSize: ".68rem",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: escuela.stripe_account_id
                  ? "rgba(46,125,50,.15)"
                  : "rgba(237,108,2,.15)",
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Tooltip title='Copiar enlace'>
                <IconButton
                  size='small'
                  onClick={() =>
                    copiarLink({
                      data: `${import.meta.env.VITE_URL_CLIENT}plantel/${escuela.slug}`,
                    })
                  }
                  sx={{
                    color: "#f06292",
                    bgcolor: "rgba(240,98,146,.06)",
                    transition: ".2s",
                    "&:hover": {
                      bgcolor: "rgba(240,98,146,.15)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Detalles de la escuela'>
                <IconButton
                  size='small'
                  onClick={() => handleOpen(escuela)}
                  sx={{
                    color: "#f06292",
                    bgcolor: "rgba(240,98,146,.06)",
                    transition: ".2s",
                    "&:hover": {
                      bgcolor: "rgba(240,98,146,.15)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <InfoIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </Box>
      {selectedSchool && (
        <DetalleEscuela
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          school={selectedSchool}
        />
      )}
    </>
  );
};

export default CardEscuela;
