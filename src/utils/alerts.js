import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Configuración base para el diseño Premium (Rosa/Elegante)
const premiumConfig = {
  confirmButtonColor: "#f06292", // Tu rosa principal
  cancelButtonColor: "#cfd8dc",
  reverseButtons: true,
  customClass: {
    popup: "premium-swal-popup",
    title: "premium-swal-title",
    confirmButton: "premium-swal-confirm",
  },
};

export const alerts = {
  // Alerta de éxito con confirmación
  success: (title, text) => {
    return MySwal.fire({
      ...premiumConfig,
      icon: "success",
      title,
      text,
      iconColor: "#f06292",
      showConfirmButton: false,
      timer: 3000,
    });
  },

  // Toast (Notificación pequeña en la esquina)
  toast: (title, icon = "success") => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      iconColor: "#f06292",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      target: document.body,
    });
  },
  // Confirmación de acción (Ej: Borrar algo)
  confirm: async (title, text) => {
    return MySwal.fire({
      ...premiumConfig,
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });
  },

  // Alerta de error
  error: (title, text) => {
    return MySwal.fire({
      ...premiumConfig,
      icon: "error",
      title: title || "¡Ups!",
      text: text || "Algo salió mal, intenta de nuevo.",
      showConfirmButton: false,
      timer: 2500,
    });
  },
};
