import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { FormatCurrency } from "../../../utils/FormatCurrency";
import {
  AccountBalanceWallet as WalletIcon,
  AttachMoney as CashIcon,
  CreditCard as CardIcon,
  SendAndArchive as TransferIcon,
} from "@mui/icons-material";
const IndicatorsFinances = ({ COLORS, cashboxSummary }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Total Ingresos Hoy */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4, xl: 2.4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            border: `1px solid ${COLORS.borderPink}`,
            background: "linear-gradient(135deg, #FFF9FA 0%, #FFFFFF 100%)",
            boxShadow: "0px 10px 30px rgba(242, 32, 140, 0.02)",
          }}
        >
          <CardContent>
            <Stack
              direction='row'
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  Ingreso Total Hoy
                </Typography>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 900, color: COLORS.dark, mt: 0.5 }}
                >
                  {FormatCurrency(cashboxSummary.totalToday)}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "rgba(226, 32, 140, 0.1)",
                  color: COLORS.accent,
                  width: 46,
                  height: 46,
                }}
              >
                <WalletIcon />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Efectivo */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4, xl: 2.4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(76, 175, 80, 0.15)",
            background: "linear-gradient(135deg, #F4FBF4 0%, #FFFFFF 100%)",
            boxShadow: "0px 10px 30px rgba(76, 175, 80, 0.02)",
          }}
        >
          <CardContent>
            <Stack
              direction='row'
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  Efectivo en Caja
                </Typography>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 900, color: COLORS.success, mt: 0.5 }}
                >
                  {FormatCurrency(cashboxSummary.cashToday)}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  color: COLORS.success,
                  width: 46,
                  height: 46,
                }}
              >
                <CashIcon />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Terminal */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4, xl: 2.4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(2, 136, 209, 0.15)",
            background: "linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)",
            boxShadow: "0px 10px 30px rgba(2, 136, 209, 0.02)",
          }}
        >
          <CardContent>
            <Stack
              direction='row'
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  Ventas Terminal
                </Typography>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 900, color: "#0288d1", mt: 0.5 }}
                >
                  {FormatCurrency(cashboxSummary.cardToday)}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "rgba(2, 136, 209, 0.1)",
                  color: "#0288d1",
                  width: 46,
                  height: 46,
                }}
              >
                <CardIcon />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Transferencias */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4, xl: 2.4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(237, 108, 2, 0.15)",
            background: "linear-gradient(135deg, #FFFDF9 0%, #FFFFFF 100%)",
            boxShadow: "0px 10px 30px rgba(237, 108, 2, 0.02)",
          }}
        >
          <CardContent>
            <Stack
              direction='row'
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  Pagos (stripe)
                </Typography>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 900, color: COLORS.warning, mt: 0.5 }}
                >
                  {FormatCurrency(cashboxSummary.stripe)}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "rgba(237, 108, 2, 0.1)",
                  color: COLORS.warning,
                  width: 46,
                  height: 46,
                }}
              >
                <TransferIcon />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      {/**Totales en transferencia bancaria */}
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4, xl: 2.4 }}>
        <Card
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(76, 175, 80, 0.15)",
            background: "linear-gradient(135deg, #fccce7 0%, #FFFFFF 100%)",
            boxShadow: "0px 10px 30px rgba(76, 175, 80, 0.02)",
          }}
        >
          <CardContent>
            <Stack
              direction='row'
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Box>
                <Typography
                  variant='caption'
                  color='textSecondary'
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  Trans. Bancaria
                </Typography>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 900, color: "#E8408F", mt: 0.5 }}
                >
                  {FormatCurrency(cashboxSummary.bank_transfer)}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "rgba(175, 76, 144, 0.1)",
                  color: "#E8408F",
                  width: 46,
                  height: 46,
                }}
              >
                <CashIcon />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default IndicatorsFinances;
