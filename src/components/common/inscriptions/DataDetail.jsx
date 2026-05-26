import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import BookIcon from "@mui/icons-material/Book";
import EventIcon from "@mui/icons-material/Event";
const DataDetail = ({ enrollmentData, COLORS }) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: COLORS.lightBg,
        borderRadius: "20px",
        border: `1px solid ${COLORS.borderPink}`,
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction='row' spacing={1} sx={{ alignItems: "center" }}>
          <BookIcon sx={{ color: COLORS.accent, fontSize: 20 }} />
          <Typography
            variant='subtitle2'
            sx={{ mountaineer: 800, color: COLORS.dark, fontWeight: 700 }}
          >
            {enrollmentData.cursos?.titulo}
          </Typography>
        </Stack>
        <Stack direction='row' spacing={1} sx={{ alignItems: "center" }}>
          <EventIcon sx={{ color: "text.secondary", fontSize: 18 }} />
          <Typography variant='caption' color='textSecondary'>
            Salón:{" "}
            <strong>
              {enrollmentData.cursos?.salones?.nombre || "General"}
            </strong>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DataDetail;
