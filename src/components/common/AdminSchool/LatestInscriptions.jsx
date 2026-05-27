import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
const LatestInscriptions = ({ ultimasInscripciones }) => {
  return (
    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
        <Typography variant='h6' fontWeight='bold' mb={3}>
          Últimas Inscripciones
        </Typography>
        <Stack spacing={3}>
          {ultimasInscripciones.map((inscription, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: i % 2 === 0 ? "#f06292" : "#7b1fa2" }}>
                {inscription.initial}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant='subtitle2' fontWeight='bold'>
                  {inscription.studentName}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  Inscrita en: {inscription.courseName}
                </Typography>
              </Box>
              <Typography
                variant='caption'
                fontWeight='bold'
                sx={{
                  bgcolor:
                    inscription.status === "Pagado" ? "#E8F5E9" : "#E1F5FE",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              >
                {inscription.status === "Pagado" ? (
                  <CheckCircleIcon
                    sx={{
                      color: "#4caf50",
                      bg: "#e8f5e9",
                      fontSize: "16px",
                      marginTop: "3px",
                    }}
                  />
                ) : (
                  <HourglassTopIcon
                    sx={{
                      color: "#0288d1",
                      bg: "#e1f5fe",
                      fontSize: "16px",
                    }}
                  />
                )}{" "}
                {inscription.status}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Grid>
  );
};

export default LatestInscriptions;
