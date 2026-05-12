import { supabase } from "../config/supabaseClient";

export const escuelasService = {
  async registrarEscuelaCompleta(datos) {
    const { data, error } = await supabase.functions.invoke(
      "crear-escuela-admin",
      {
        body: datos,
      },
    );

    if (error) throw error;
    return data;
  },
};
