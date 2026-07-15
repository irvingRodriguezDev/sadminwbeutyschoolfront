import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import React from "react";
import TipTapEditor from "../../../../pages/SchoolAdmin/Cursos/TipTapEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const StepperOne = ({ formData, setFormData }) => {
  // Aseguramos que temario siempre sea un arreglo para evitar fallos de renderizado
  const temario = Array.isArray(formData.temario) ? formData.temario : [];

  // 1. Agregar una nueva semana/módulo al temario
  const handleAddSemana = () => {
    const nuevaSemana = {
      titulo: `Semana ${temario.length + 1}: [Nombre del módulo]`,
      puntos: [""], // Inicia con un punto vacío listo para escribir
    };
    setFormData({
      ...formData,
      temario: [...temario, nuevaSemana],
    });
  };

  // 2. Modificar el título de una semana en específico
  const handleUpdateTituloSemana = (semanaIdx, nuevoTitulo) => {
    const nuevoTemario = [...temario];
    nuevoTemario[semanaIdx].titulo = nuevoTitulo;
    setFormData({ ...formData, temario: nuevoTemario });
  };

  // 3. Agregar un punto clave a una semana específica
  const handleAddPunto = (semanaIdx) => {
    const nuevoTemario = [...temario];
    nuevoTemario[semanaIdx].puntos.push("");
    setFormData({ ...formData, temario: nuevoTemario });
  };

  // 4. Modificar un punto específico de una semana específica
  const handleUpdatePunto = (semanaIdx, puntoIdx, valor) => {
    const nuevoTemario = [...temario];
    nuevoTemario[semanaIdx].puntos[puntoIdx] = valor;
    setFormData({ ...formData, temario: nuevoTemario });
  };

  // 5. Eliminar un punto específico
  const handleRemovePunto = (semanaIdx, puntoIdx) => {
    const nuevoTemario = [...temario];
    nuevoTemario[semanaIdx].puntos = nuevoTemario[semanaIdx].puntos.filter(
      (_, idx) => idx !== puntoIdx,
    );
    setFormData({ ...formData, temario: nuevoTemario });
  };

  // 6. Eliminar una semana completa
  const handleRemoveSemana = (semanaIdx) => {
    const nuevoTemario = temario.filter((_, idx) => idx !== semanaIdx);
    setFormData({ ...formData, temario: nuevoTemario });
  };

  return (
    <Grid container spacing={3}>
      {/* 📝 SECCIÓN 1: DESCRIPCIÓN GENERAL (Ocupa la mitad de la pantalla) */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant='subtitle2'
          gutterBottom
          color='#f06292'
          fontWeight='bold'
        >
          Descripción del Curso
        </Typography>
        <Typography
          variant='caption'
          color='text.secondary'
          display='block'
          sx={{ mb: 1 }}
        >
          Escribe la introducción comercial del curso (para quién es,
          beneficios, etc.).
        </Typography>
        <TipTapEditor
          value={formData.descripcion || ""}
          onChange={(content) =>
            setFormData({ ...formData, descripcion: content })
          }
          placeholder='Escribe la introducción atractiva del curso...'
        />
      </Grid>

      {/* 💅 SECCIÓN 2: LISTA DE MATERIALES (Ocupa la otra mitad) */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant='subtitle2'
          gutterBottom
          color='#f06292'
          fontWeight='bold'
        >
          Lista de Materiales Requeridos
        </Typography>
        <Typography
          variant='caption'
          color='text.secondary'
          display='block'
          sx={{ mb: 1 }}
        >
          Detalla qué materiales incluye la inscripción y cuáles debe traer la
          alumna.
        </Typography>
        <TipTapEditor
          value={formData.lista_materiales || ""}
          placeholder='Escribe la lista de acrílicos, pinceles, tips u otros insumos...'
          onChange={(content) =>
            setFormData({ ...formData, lista_materiales: content })
          }
        />
      </Grid>

      {/* 📚 SECCIÓN 3: CONSTRUCTOR DE TEMARIO SEMANAL DINÁMICO (JSONB) */}
      <Grid size={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant='subtitle1' color='#f06292' fontWeight='bold'>
              Temario Semanal / Módulos
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Estructura el contenido de manera ordenada. Esto se mostrará como
              un elegante acordeón colapsable en la web.
            </Typography>
          </Box>
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={handleAddSemana}
            sx={{
              borderColor: "#f06292",
              color: "#f06292",
              "&:hover": { borderColor: "#d81b60", bgcolor: "#fdf2f5" },
            }}
          >
            Agregar Semana / Módulo
          </Button>
        </Box>

        {temario.length === 0 ? (
          <Paper
            variant='outlined'
            sx={{
              p: 4,
              textAlign: "center",
              borderStyle: "dashed",
              borderColor: "rgba(0, 0, 0, 0.12)",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              No hay módulos definidos. Haz clic en "Agregar Semana / Módulo"
              para estructurar el plan de estudios.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {temario.map((semana, semanaIdx) => (
              <Grid size={{ xs: 12, md: 6 }} key={semanaIdx}>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    bgcolor: "#fffdfd",
                    position: "relative",
                  }}
                >
                  {/* Cabecera de la Semana */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      size='small'
                      label='Nombre de la Semana / Módulo'
                      variant='outlined'
                      value={semana.titulo}
                      onChange={(e) =>
                        handleUpdateTituloSemana(semanaIdx, e.target.value)
                      }
                    />
                    <IconButton
                      color='error'
                      onClick={() => handleRemoveSemana(semanaIdx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {/* Lista de Puntos Clave */}
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    fontWeight='bold'
                  >
                    Puntos del temario:
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    {semana.puntos.map((punto, puntoIdx) => (
                      <ListItem
                        key={puntoIdx}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            edge='end'
                            size='small'
                            onClick={() =>
                              handleRemovePunto(semanaIdx, puntoIdx)
                            }
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        }
                        sx={{ mb: 1 }}
                      >
                        <TextField
                          fullWidth
                          size='small'
                          placeholder='Ej. Bioseguridad y morfología de la uña'
                          variant='standard'
                          value={punto}
                          onChange={(e) =>
                            handleUpdatePunto(
                              semanaIdx,
                              puntoIdx,
                              e.target.value,
                            )
                          }
                          sx={{ pr: 4 }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    size='small'
                    startIcon={<AddIcon />}
                    onClick={() => handleAddPunto(semanaIdx)}
                    sx={{ color: "#d81b60", mt: 1, textTransform: "none" }}
                  >
                    Agregar Tema
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default StepperOne;
