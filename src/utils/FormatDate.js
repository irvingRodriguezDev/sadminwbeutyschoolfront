const FormatDate = (dateString) => {
  if (!dateString) return "Fecha no disponible";

  // Quita la Z para que no se interprete como UTC
  const localDateStr = dateString.replace("Z", "");
  const date = new Date(localDateStr);

  const formatted = date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export default FormatDate;
