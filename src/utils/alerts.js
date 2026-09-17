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
  // Loader de carga con spinner rosa integrado directamente
  loading: (
    title = "Subiendo Contenido",
    text = "Espera un momento, no cierres la página...",
  ) => {
    return MySwal.fire({
      ...premiumConfig,
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
        // Inyección directa del color rosa en el spinner sin requerir CSS externo
        const loader = Swal.getPopup()?.querySelector(".swal2-loader");
        if (loader) {
          loader.style.borderColor = "#f06292 transparent #f06292 transparent";
        }
      },
    });
  },
};
