import { useState, useEffect } from "react";
import "./index.css";

function App() {
  // calcular la semana actual
  const fechaActual = new Date();
  const inicio = new Date(fechaActual.getFullYear(), 0, 1);
  const diferencia = (fechaActual.getTime() - inicio.getTime()) + ((inicio.getTimezoneOffset() - fechaActual.getTimezoneOffset()) * 60 * 1000);
  const unaSemana = 1000 * 60 * 60 * 24 * 7;
  const semanaActual = Math.floor(diferencia / unaSemana);
//////////////////////////////////////////////////////////////////////////////////////////////////
  const [indiceSemana, setIndiceSemana] = useState<number>(semanaActual);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(0);
  const [textTask, settextTask] = useState<string>("");
  const [tareas, setTareas] = useState<string[][][]>([]);

  // etiquetas de los días de la semana
  const etiquetasDias = [
    "Lunes (月曜日)", 
    "Martes (火曜日)", 
    "Miércoles (水曜日)", 
    "Jueves (木曜日)", 
    "Viernes (金曜日)", 
    "Sábado (土曜日)", 
    "Domingo (日曜日)"
  ];
  
  // función para avanzar a la siguiente semana
  const handleNextWeek = () => {
    setIndiceSemana((prev) => (prev < 51 ? prev + 1 : prev));
    setTareas((prev) => {
      const nuevasTareas = [...prev];
      if (!nuevasTareas[indiceSemana + 1]) {
        nuevasTareas[indiceSemana + 1] = Array.from({ length: 7 }, () => []);
      }
      return nuevasTareas;
    });
  };

  // función para restar semanas
  const handlePreviousWeek = () => {
    setIndiceSemana((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // funcion para agregar una nueva tarea
  const handleAddTask = () => {
    if (!textTask.trim()) return; 
    setTareas((prev) => {
      const nuevasTareas = [...prev]; // copia de la matriz de tareas
      if (!nuevasTareas[indiceSemana]) {
        nuevasTareas[indiceSemana] = Array.from({ length: 7 }, () => []); // matriz de tareas vacías para cada día
      }
      nuevasTareas[indiceSemana] = nuevasTareas[indiceSemana].map((taskDay, index) =>
        index === diaSeleccionado ? [...taskDay, textTask] : taskDay // agrega la tarea
      );
      return nuevasTareas;
    });
    settextTask(""); 
  };

  // función para eliminar una tarea
  const handleEliminarTarea = (diaIndex: number, tareaIndex: number) => {
    const nuevasTareas = [...tareas];
    if (nuevasTareas[indiceSemana]) {
      nuevasTareas[indiceSemana] = nuevasTareas[indiceSemana].map((taskDay, dayIndex) => {
        if (dayIndex === diaIndex) {
          return taskDay.filter((_, i) => i !== tareaIndex);
        }
        return taskDay;
      });
    }
    setTareas(nuevasTareas);
  };

  // useEffect para agregar una tarea usando la tecla enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTask();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textTask, diaSeleccionado, indiceSemana]);

  return (
    <article className="container">
      <section className="header">
        <h1>Calendario Semanal (週間カレンダー)</h1>
      </section>
      <section className="week-navigation">
        <button onClick={handlePreviousWeek} disabled={indiceSemana === 0}>
          Semana Anterior (先週)
        </button>
        <span>Semana {indiceSemana + 1} (第{indiceSemana + 1}週)</span>
        <button onClick={handleNextWeek} disabled={indiceSemana === 51}>
          Semana Siguiente (来週)
        </button>
      </section>
      <form className="form" onSubmit={(e) => {
        e.preventDefault();
        handleAddTask();
      }}>
        <label>
          Día:
          <select
            value={diaSeleccionado}
            onChange={(e) => setDiaSeleccionado(Number(e.target.value))}
            style={{ backgroundColor: "#C71585", color: "#fff" }}
          >
            {etiquetasDias.map((dia, index) => (
              <option key={index} value={index}>
                {dia}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tarea:
          <input
            type="text"
            value={textTask}
            onChange={(e) => settextTask(e.target.value)}
            placeholder="Escribe la tarea (追加)"
            style={{ backgroundColor: "#C71585", color: "#fff" }}
          />
        </label>
        <button type="submit">Añadir Tarea (追加)</button>
      </form>
      <section>
        <h2>Total de tareas esta semana: {tareas[indiceSemana]?.flat().length || 0}</h2>
        <aside className="calendar">
          {etiquetasDias.map((dia, index) => {
            const tareaCount = tareas[indiceSemana]?.[index]?.length || 0;
            let backgroundColor = "DimGray";
            if (tareaCount >= 6) backgroundColor = "Maroon";
            else if (tareaCount >= 4) {
              backgroundColor = "DarkOrange";
            }
            else if (tareaCount >= 1) backgroundColor = "MediumSeaGreen";

            return (
              <div className="day" key={index} style={{ backgroundColor }}>
                <h3>{dia} ({tareaCount} tareas)</h3>
                <ul className="task-list">
                  {tareas[indiceSemana]?.[index]?.map((tarea, taskIdx) => (
                    <li key={taskIdx}>
                      {tarea}
                      <button className="delete-button" onClick={() => handleEliminarTarea(index, taskIdx)}>
                        芥
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </aside>
      </section>
    </article>
  );
}
export default App;
