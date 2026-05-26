import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
const StudentProfile = ({ enrollmentData, COLORS }) => {
  return (
    <Box>
      <Stack direction='row' spacing={2} sx={{ mb: 2, alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: COLORS.primary,
            width: 48,
            height: 48,
            fontWeight: 700,
          }}
        >
          {enrollmentData.students?.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 800, color: COLORS.dark }}
          >
            {enrollmentData.students?.name || "Nombre del Estudiante"}
          </Typography>
          <Stack
            direction='row'
            spacing={0.5}
            sx={{ color: "#25D366", cursor: "pointer", alignItems: "center" }}
          >
            <WhatsAppIcon fontSize='small' />
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {enrollmentData.students?.phone}
            </Typography>
          </Stack>
          {enrollmentData.students?.email && (
            <Typography variant='caption' color='textSecondary'>
              {enrollmentData.students?.email}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default StudentProfile;
