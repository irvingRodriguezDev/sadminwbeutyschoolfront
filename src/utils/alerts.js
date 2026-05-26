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
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      // 🚀 LA SOLUCIÓN: Forzamos a que el contenedor del Toast flote sobre los modales de MUI
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        // Inyectamos el z-index de forma directa al elemento del Toast
        toast.style.zIndex = "10600";
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
