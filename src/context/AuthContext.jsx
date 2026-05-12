import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Definimos la función para obtener el perfil
    const fetchProfile = async (sessionUser) => {
      try {
        if (!sessionUser) {
          setProfile(null);
          return;
        }

        // Importante: Verifica que tu tabla se llame 'perfiles' o 'profiles'
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        if (error) {
          console.warn(
            "No se encontró perfil para este usuario:",
            error.message,
          );
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Error inesperado en AuthContext:", err);
      } finally {
        setLoading(false); // Siempre quitamos el loading al terminar
      }
    };

    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // 2. Escuchar cambios de estado
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
