import { supabase } from "../config/supabaseClient";

export const escuelasService = {
  async crearEscuela(datosEscuela, adminEmail) {
    // 1. Insertar la escuela
    const { data: escuela, error: errorEscuela } = await supabase
      .from("schools")
      .insert([datosEscuela])
      .select()
      .single();

    if (errorEscuela) throw errorEscuela;

    // 2. Aquí llamaríamos a una Edge Function para crear al Admin de la escuela
    // y enviarle su correo de bienvenida.
    return escuela;
  },

  async obtenerEscuelas() {
    const { data, error } = await supabase.from("schools").select("*");
    if (error) throw error;
    return data;
  },
};
