import React, { useState, useEffect } from "react";
import { useMonth } from "../../context/monthContext";

function RangoFechas() {
  const { rangoFechas, definirRangoFechas } = useMonth();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (rangoFechas?.inicio && rangoFechas?.fin) {
      setFechaInicio(rangoFechas.inicio);
      setFechaFin(rangoFechas.fin);
    }
  }, [rangoFechas]);

  useEffect(() => {
    const inicio = parseInt(fechaInicio);
    const fin = parseInt(fechaFin);

    if (!fechaInicio || !fechaFin) {
      setMensaje("");
      return;
    }

    if (inicio < 1 || inicio > 31 || fin < 1 || fin > 31) {
      setMensaje("⚠️ Las fechas deben estar entre 1 y 31.");
      setTipoMensaje("warning");
      return;
    }

    if (inicio > fin) {
      setMensaje(`Período asignado: Del ${inicio} del mes anterior al ${fin} del mes actual`);
      setTipoMensaje("warning");
    } else {
      setMensaje("Se ha definido un periodo en el mes activo");
      setTipoMensaje("warning");
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    if (tipoMensaje === "success") {
      const timer = setTimeout(() => setMensaje(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [tipoMensaje]);

  const manejarCambio = async () => {
    if (!fechaInicio || !fechaFin) {
      setMensaje("Completa ambos campos antes de guardar.");
      setTipoMensaje("danger");
      return;
    }
    setGuardando(true);
    try {
      await definirRangoFechas({ inicio: fechaInicio, fin: fechaFin });
      setMensaje("✅ Rango de fechas guardado correctamente.");
      setTipoMensaje("success");
    } catch (error) {
      setMensaje(`🚨 Error al guardar el rango de fechas. ${error} `);
      setTipoMensaje("danger");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="config-box">
      <h4>📆 Rango de Fechas</h4>
      <p>
        Actualmente filtrando datos del <strong>{fechaInicio || "Cargando..."}</strong> al{" "}
        <strong>{fechaFin || "Cargando..."}</strong>.
      </p>

      <label>Fecha inicio:</label>
      <input
        type="number"
        min="1"
        max="31"
        value={fechaInicio}
        onChange={(e) => setFechaInicio(e.target.value)}
        className="form-control mb-2"
      />

      <label>Fecha fin:</label>
      <input
        type="number"
        min="1"
        max="31"
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
        className="form-control mb-2"
      />

      <button
        className="btn btn-primary mt-2"
        onClick={manejarCambio}
        disabled={guardando || !fechaInicio || !fechaFin}
      >
        {guardando ? "Guardando..." : "Guardar Rango"}
      </button>

      {mensaje && (
        <div className={`alert alert-${tipoMensaje} mt-3`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default RangoFechas;