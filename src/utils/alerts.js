import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Configuración base para el diseño Premium (Rosa/Elegante)
const premiumConfig = {
  confirmButtonColor: "#f06292", // Tu rosa principal
  cancelButtonColor: "#cfd8dc",
  reverseButtons: true,
  borderRadius: "1.5rem",
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
    });
  },

  // Toast (Notificación pequeña en la esquina)
  toast: (title, icon = "success") => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    return Toast.fire({
      icon,
      title,
      iconColor: icon === "success" ? "#f06292" : undefined,
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
