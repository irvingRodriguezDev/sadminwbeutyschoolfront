import { supabase } from "../config/supabaseClient";

export const escuelasService = {
  registrarEscuelaCompleta: async (datos) => {
    const { data, error } = await supabase.functions.invoke(
      "crear-escuela-admin",
      {
        body: datos, // 👈 Debe ser { name: "...", emailAdmin: "..." }
      },
    );

    if (error) {
      // Supabase devuelve el error de la función dentro de error.message o response
      throw new Error(error.message || "Error al invitar al administrador.");
    }

    return data;
  },
};
