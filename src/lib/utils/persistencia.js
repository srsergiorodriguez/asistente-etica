import { store } from '$state/store.svelte.js';

export function guardarProyectoLocal() {
  // Convertimos el estado actual a formato JSON
  const datos = JSON.stringify({
    diagnostico: store.diagnostico,
    proyectoCore: store.proyectoCore,
    documentos: store.documentos
  }, null, 2);

  // Creamos un archivo virtual y forzamos la descarga
  const blob = new Blob([datos], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Usamos el título del proyecto o un nombre genérico para el archivo
  const nombreArchivo = store.proyectoCore.titulo 
    ? `Proyecto_Etica_${store.proyectoCore.titulo.replace(/\s+/g, '_')}.json` 
    : 'Nuevo_Proyecto_Etica.json';
    
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function cargarProyectoLocal(evento) {
  const archivo = evento.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = (e) => {
    try {
      const datos = JSON.parse(e.target.result);
      
      // Reasignamos las propiedades para mantener la reactividad del $state
      if (datos.diagnostico) Object.assign(store.diagnostico, datos.diagnostico);
      if (datos.proyectoCore) Object.assign(store.proyectoCore, datos.proyectoCore);
      if (datos.documentos) Object.assign(store.documentos, datos.documentos);
      
      alert("Proyecto cargado exitosamente.");
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      alert("El archivo no tiene un formato válido.");
    }
  };
  lector.readAsText(archivo);
  
  // Reseteamos el input para permitir cargar el mismo archivo varias veces si es necesario
  evento.target.value = '';
}