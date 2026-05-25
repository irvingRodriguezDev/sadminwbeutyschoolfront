export const FormatCurrency = (amount) => {
  // Verificamos si amount es un número válido antes de formatear
  if (typeof amount !== "number" || isNaN(amount)) {
    return "$0.00"; // Retorna un valor por defecto o un string de error
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN", // Código ISO 4217 para el Peso Mexicano
    minimumFractionDigits: 2, // Asegura que siempre haya dos decimales
  }).format(amount);
};
