import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { FormatCurrency } from "../../utils/FormatCurrency";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5", // Una separación sutil para el logo
  },
  logoImage: {
    width: 120, // 🌟 Ajusta el ancho según la estética que busques
    height: "auto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#F472B6",
    pb: 15,
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#2A2628" },
  subtitle: { fontSize: 10, color: "#6B6567", marginTop: 4 },

  // KPIs
  kpiContainer: { flexDirection: "row", gap: 15, marginBottom: 25 },
  kpiCard: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  kpiLabel: {
    fontSize: 8,
    color: "#6B6567",
    fontWeight: "bold",
    marginBottom: 4,
  },
  kpiValue: { fontSize: 14, fontWeight: "bold", color: "#E53888" },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2A2628",
    marginTop: 15,
    marginBottom: 8,
  },

  // Tarjeta de Estudiante Premium con sus abonos
  studentCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3E8EE",
    borderRadius: 8,
    overflow: "hidden",
  },
  studentHeader: {
    backgroundColor: "#FDF2F8", // Tono rosa super cute de Wapizima
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#FBCFE8",
  },
  studentName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2A2628",
    letterSpacing: 0.5,
  },

  // Fila de abonos
  paymentRow: {
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E8EE",
    backgroundColor: "#FFFFFF",
  },
  paymentTotalRow: {
    flexDirection: "row",
    padding: 6,
    backgroundColor: "#FAFAFA",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  // Columnas fijas para alineación perfecta
  colConcepto: { width: "40%", fontSize: 9, color: "#554D4F" },
  colMonto: {
    width: "30%",
    fontSize: 9,
    textAlign: "right",
    fontWeight: "bold",
    color: "#2A2628",
  },
  colMetodo: {
    width: "30%",
    fontSize: 9,
    textAlign: "right",
    color: "#6B6567",
    textTransform: "uppercase",
  },

  // Tabla de Gastos
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  colGastoFecha: { width: "20%", fontSize: 9 },
  colGastoConcepto: { width: "50%", fontSize: 9 },
  colGastoMonto: {
    width: "30%",
    fontSize: 9,
    textAlign: "right",
    fontWeight: "bold",
    color: "#D81B60",
  },
  methodContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  methodCard: {
    flex: 1,
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    alignItems: "center",
  },
  methodLabel: { fontSize: 8, color: "#6B6567", textTransform: "uppercase" },
  methodValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 2,
  },
});

const UtilityReportTemplate = ({
  cursoData = {},
  gastos = [],
  metodosAgrupados = {},
  logo,
}) => {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* ENCABEZADO */}
        {logo && (
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} src={logo} />
          </View>
        )}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reporte de Utilidad por Curso</Text>
            <Text style={styles.subtitle}>
              Curso: {cursoData.nombre || "N/A"} - {cursoData.maestro}
            </Text>
          </View>
          <View style={{ alignItems: "right" }}>
            <Text style={{ fontSize: 9, color: "#6B6567" }}>Generado el:</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
              {new Date().toLocaleDateString("es-MX")}
            </Text>
          </View>
        </View>

        {/* KPIs GENERALES */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>(+) INGRESOS BRUTOS</Text>
            <Text style={[styles.kpiValue, { color: "#10B981" }]}>
              {FormatCurrency(cursoData.totalIngresos || 0)}
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>(-) GASTOS OPERATIVOS</Text>
            <Text style={[styles.kpiValue, { color: "#EF4444" }]}>
              {FormatCurrency(cursoData.totalGastos || 0)}
            </Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>(=) UTILIDAD NETA</Text>
            <Text style={[styles.kpiValue, { color: "#E53888" }]}>
              {FormatCurrency(
                (cursoData.totalIngresos || 0) - (cursoData.totalGastos || 0),
              )}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>2. Ingresos por Método de Pago</Text>
        <View style={styles.methodContainer}>
          {Object.entries(metodosAgrupados).map(([metodo, total]) => (
            <View style={styles.methodCard} key={metodo}>
              <Text style={styles.methodLabel}>{metodo}</Text>
              <Text style={styles.methodValue}>{FormatCurrency(total)}</Text>
            </View>
          ))}
        </View>

        {/* DETALLE DE ESTUDIANTES Y SUS ABONOS */}
        <Text style={styles.sectionTitle}>
          3. Desglose de Alumnos e Ingresos
        </Text>

        {cursoData.estudiantes?.map((alumno, index) => (
          <View
            style={styles.studentCard}
            key={index}
            break={index > 0 && index % 4 === 0}
          >
            {/* Encabezado con Nombre del Alumno */}
            <View style={styles.studentHeader}>
              <Text style={styles.studentName}>
                {alumno.estudiante.toUpperCase()}
              </Text>
            </View>

            {/* Listado de Abonos del Alumno */}
            {alumno.pagos.map((pago, idx) => (
              <View style={styles.paymentRow} key={idx}>
                <Text style={styles.colConcepto}>{pago.concepto}</Text>
                <Text style={styles.colMonto}>
                  {FormatCurrency(pago.monto)}
                </Text>
                <Text style={styles.colMetodo}>{pago.metodo}</Text>
              </View>
            ))}

            {/* Total acumulado de este Alumno */}
            <View style={styles.paymentTotalRow}>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "bold",
                  color: "#6B6567",
                  marginRight: 5,
                }}
              >
                Total Pagado:
              </Text>
              <Text
                style={{ fontSize: 10, fontWeight: "800", color: "#2A2628" }}
              >
                {FormatCurrency(alumno.totalEstudiante)}
              </Text>
            </View>
          </View>
        ))}

        {/* SECCIÓN DE GASTOS ASOCIADOS */}
        <Text style={styles.sectionTitle}>4. Gastos Asignados al Curso</Text>
        <View style={styles.tableRowHeader}>
          <Text style={styles.colGastoFecha}>Fecha</Text>
          <Text style={styles.colGastoConcepto}>Concepto</Text>
          <Text style={[styles.colGastoMonto, { textAlign: "right" }]}>
            Monto
          </Text>
        </View>
        {gastos.map((gasto) => (
          <View style={styles.tableRow} key={gasto.id}>
            <Text style={styles.colGastoFecha}>
              {new Date(gasto.expense_date).toLocaleDateString("es-MX")}
            </Text>
            <Text style={styles.colGastoConcepto}>{gasto.title}</Text>
            <Text style={styles.colGastoMonto}>
              {FormatCurrency(gasto.amount)}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default UtilityReportTemplate;
