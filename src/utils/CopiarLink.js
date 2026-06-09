import { alerts } from "./Alerts";
const copiarLink = async ({ data }) => {
  console.log(data);

  try {
    // Reemplaza escuela.link por el atributo que utilizarás
    await navigator.clipboard.writeText(data);

    alerts.toast("¡Enlace copiado al portapapeles!");
  } catch (error) {
    console.error(error);
  }
};
export default copiarLink;
