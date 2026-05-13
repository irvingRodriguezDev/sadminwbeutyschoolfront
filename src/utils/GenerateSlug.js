const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Reemplaza espacios con -
    .replace(/[^\w-]+/g, "") // Elimina caracteres no permitidos
    .replace(/--+/g, "-"); // Reemplaza múltiples - con uno solo
};

export default generateSlug;
