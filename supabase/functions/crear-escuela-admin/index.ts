import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejo de CORS (Preflight para navegadores)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Admin (necesario para auth.admin)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { name, emailAdmin } = await req.json();

    if (!emailAdmin || !name) {
      throw new Error("El nombre de la escuela y el email del admin son obligatorios.");
    }

    // 1. Insertar la Escuela en la tabla 'schools'
    const { data: escuela, error: errorEscuela } = await supabaseAdmin
      .from("schools")
      .insert([
        {
          name,
          slug: name.toLowerCase().trim().replace(/\s+/g, "-"),
        },
      ])
      .select()
      .single();

    if (errorEscuela) throw errorEscuela;

    // 2. Invitar al Administrador
    // Enviamos 'school_id' y 'rol' en los metadatos (user_metadata)
    // El Trigger de Postgres los leerá automáticamente al insertar en 'profiles'
    const { data: inviteData, error: errorInvite } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(emailAdmin, {
        redirectTo: 'http://localhost:5173/completed-setup',
        data: {
          name: `Administrador ${name}`,
          rol: "school_admin",
          school_id: escuela.id, 
        },
      });

    if (errorInvite) {
      // Si la invitación falla, podrías considerar borrar la escuela creada (rollback manual)
      // aunque lo ideal es que el admin verifique si el usuario ya existe.
      throw errorInvite;
    }

    return new Response(
      JSON.stringify({
        message: "Escuela creada y administrador invitado exitosamente.",
        escuelaId: escuela.id,
        userId: inviteData.user.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});