import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";

const StyledNavItem = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  backgroundColor: active ? "rgba(240, 98, 146, 0.15)" : "transparent",
  color: active ? "#f06292" : "#616161",
  "&:hover": {
    backgroundColor: "rgba(240, 98, 146, 0.08)",
  },
  "& .MuiListItemIcon-root": {
    color: active ? "#f06292" : "#616161",
  },
}));

export default StyledNavItem;
