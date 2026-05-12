import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejo de CORS (Preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Llave maestra segura
    );

    const { name, address, lat, lng, emailAdmin } = await req.json();

    // 1. Insertar Escuela
    const { data: escuela, error: errorEscuela } = await supabaseAdmin
      .from("schools")
      .insert([
        {
          name,
          address,
          location: `POINT(${lng} ${lat})`,
          slug: name.toLowerCase().replace(/ /g, "-"),
        },
      ])
      .select()
      .single();

    if (errorEscuela) throw errorEscuela;

    // 2. Crear usuario administrador e invitarlo
    // Esto crea el registro en auth.users
    const { data: inviteData, error: errorInvite } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(emailAdmin, {
        redirectTo: 'http://localhost:5173/complete-setup',
        data: {
          full_name: "Admin " + name,
          is_school_admin: true,
        },
      });

    if (errorInvite) throw errorInvite;

    // 3. Vincular el perfil creado automáticamente con la escuela
    // (Asumiendo que tienes un trigger que crea el perfil o lo creamos aquí)
    const { error: errorPerfil } = await supabaseAdmin
      .from("profiles")
      .update({
        school_id: escuela.id,
        rol: "school_admin",
        name: "Administrador " + name,
      })
      .eq("id", inviteData.user.id);

    if (errorPerfil) throw errorPerfil;

    return new Response(
      JSON.stringify({
        message: "Escuela y Admin creados con éxito",
        escuelaId: escuela.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
