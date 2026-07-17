import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";
import { supabase } from "../config/supabaseClient";
import { alerts } from "../utils/alerts";
import Swal from "sweetalert2";

const ExpensesContext = createContext(null);

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async (schoolId) => {
    setLoadingExpenses(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("expense_date", { ascending: false });

      if (error) throw error;

      setExpenses(data || []);
    } catch (err) {
      console.error("Error al obtener los gastos:", err.message);
      setError(err.message);
    } finally {
      setLoadingExpenses(false);
    }
  }, []);
  // 2. 🌟 NUEVA FUNCIÓN: Borrado lógico
  const deleteExpenseLogical = useCallback(async (expenseId) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ deleted_at: new Date().toISOString() }) // Seteamos la fecha de eliminación
        .eq("id", expenseId);

      if (error) throw error;

      // Actualización reactiva instantánea sin hacer otra petición a la BD
      setExpenses((prevExpenses) =>
        prevExpenses.filter((exp) => exp.id !== expenseId),
      );

      return { success: true };
    } catch (err) {
      console.error("Error en borrado lógico:", err.message);
      return { success: false, error: err.message };
    }
  }, []);
  const fetchCourses = async (schoolId) => {
    if (!open || !schoolId) return;
    try {
      setLoadingCourses(true);
      const { data, error } = await supabase
        .from("cursos")
        .select("id, titulo")
        .eq("school_id", schoolId)
        .order("titulo", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error("Error cargando cursos:", err);
    } finally {
      setLoadingCourses(false);
    }
  };
  // Métricas optimizadas con useMemo (calculan solo sobre gastos activos)
  const totalSpend = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses]);

  const totalSpendLast30Days = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    return expenses
      .filter((expense) => {
        if (!expense.expense_date) return false;
        const expenseDate = new Date(expense.expense_date);
        return expenseDate >= thirtyDaysAgo && expenseDate <= today;
      })
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [expenses]);

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loadingExpenses,
        error,
        totalSpend, // Exportamos el total histórico
        totalSpendLast30Days, // 🌟 Exportamos la nueva métrica cute de los últimos 30 días
        fetchExpenses,
        fetchCourses,
        courses,
        loadingCourses,
        deleteExpenseLogical,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
};
