// src/lib/state/store.svelte.js

export const store = $state({
  diagnostico: {
    usaHumanos: false,
    usaMenores: false,
    temasSensibles: false,
    recolectaDatosPersonales: false,
    esEstudiante: false, 
    usaMaterialArchivo: false, 
  },
  
  proyectoCore: {
    titulo: "",
    investigadorPrincipal: "", // Será el nombre del estudiante si esEstudiante es true
    datosContacto: "",
    nombreTutor: "", // Nueva variable para el aval
    
    accionObjeto: "",
    medio: "",
    finalidad: "",
    muestrasBiologicas: "", 
    
    enfoqueYFases: "",
    metodosRecoleccion: "",
    fasesEstudio: "",
    
    almacenamiento: "",
    retencion: "",
    accesoPrivacidad: "",
    contencionEmocional: "", 
  },

  documentos: {
    consentimiento: {
      justificacion: "",
      procedimientos: "",
      riesgos: "",
      beneficios: "",
      manejoDatos: ""
    },
    asentimiento: {
      introduccion: "",
      actividades: "",
      riesgos: "",
      beneficios: "",
      derechos: ""
    }
  },

  documentoActivo: 'planteamiento'
});

export const flujo = {
  get nivelRiesgo() {
    if (store.diagnostico.temasSensibles || store.diagnostico.usaMenores) {
      return { nivel: "Riesgo mayor al mínimo", color: "var(--color-risk-high, #e87e14)" };
    }
    if (store.diagnostico.usaHumanos) {
      return { nivel: "Riesgo mínimo", color: "var(--color-risk-min, #e5d827)" };
    }
    return { nivel: "Sin riesgo", color: "var(--color-risk-none, #20c997)" };
  },

  get documentosRequeridos() {
    let docs = [{ id: 'planteamiento', titulo: 'Planteamiento general' }];
    docs.push({ id: 'platypus', titulo: 'Borrador Platypus' });
    
    // Inyecciones condicionales en el Stack Visual
    if (store.diagnostico.esEstudiante) {
      docs.push({ id: 'aval', titulo: 'Aval de tutor o coordinador' });
    }
    if (store.diagnostico.usaHumanos) {
      docs.push({ id: 'consentimiento', titulo: 'Consentimiento informado' });
    }
    if (store.diagnostico.usaMenores) {
      docs.push({ id: 'asentimiento', titulo: 'Asentimiento informado' });
    }
    if (store.diagnostico.recolectaDatosPersonales) {
      docs.push({ id: 'politica', titulo: 'Política de datos' });
    }
    if (store.diagnostico.usaMaterialArchivo) {
      docs.push({ id: 'derechosAutor', titulo: 'Derechos de autor y archivo' });
    }
    
    return docs;
  },

  estaCompletado(id) {
    if (id === 'planteamiento') {
      // Exigimos que los campos principales no estén vacíos
      const p = store.proyectoCore;
      return p.titulo.trim() !== "" && 
             p.investigadorPrincipal.trim() !== "" && 
             p.accionObjeto.trim() !== "" &&
             p.enfoqueYFases.trim() !== "";
    }
    return false;
  },
  
  seleccionarDocumento(id) {
    store.documentoActivo = id;
  }
};

export function inyectarDatosPrueba() {
  // 1. Forzamos el diagnóstico para activar los requerimientos de Consentimiento y Habeas Data
  store.diagnostico.usaHumanos = true;
  store.diagnostico.recolectaDatosPersonales = true;
  store.diagnostico.temasSensibles = false;
  store.diagnostico.usaMenores = false;

  // 2. Llenamos el núcleo del proyecto con datos académicos realistas
  store.proyectoCore.titulo = "Prácticas de luthería electrónica y apropiación tecnológica en comunidades de creadores digitales";
  store.proyectoCore.investigadorPrincipal = "Sergio Rodríguez Gómez";
  store.proyectoCore.datosContacto = "Profesor y Coordinador (correo institucional). Responsable del archivo y contención.";
  
  store.proyectoCore.accionObjeto = "Documentar las dinámicas de diseño de interfaces de hardware (microcontroladores) y módulos de sintetizadores.";
  store.proyectoCore.medio = "Mediante entrevistas semiestructuradas, observación de talleres de ensamble y registro audiovisual de prácticas performativas.";
  store.proyectoCore.finalidad = "Para comprender cómo los artistas locales adaptan y construyen sus propias herramientas de procesamiento digital de señales (DSP).";
  
  store.proyectoCore.enfoqueYFases = "Investigación-creación cualitativa. Fase 1: Indagación de campo y revisión de repositorios. Fase 2: Desarrollo de prototipos en taller. Fase 3: Socialización y conciertos interactivos.";
  store.proyectoCore.metodosRecoleccion = "Entrevistas en video, grupos focales sobre diseño algorítmico, y recolección de repositorios de código abierto.";
  store.proyectoCore.fasesEstudio = "Se desarrollará a lo largo de un semestre académico, culminando en una exhibición pública de los dispositivos construidos.";
  
  store.proyectoCore.almacenamiento = "Discos duros externos cifrados custodiados en los laboratorios de la universidad, con copias de respaldo en SharePoint institucional.";
  store.proyectoCore.retencion = "Siguiendo el mandato del public scholarship, los datos anonimizados y el código fuente se conservarán indefinidamente como repositorio patrimonial abierto. Los audios y videos crudos se destruirán a los 2 años.";
  store.proyectoCore.accesoPrivacidad = "El equipo de investigación tendrá acceso a los datos crudos. En el contexto de la creación artística, los participantes podrán optar por el reconocimiento explícito de autoría en los créditos o solicitar anonimización estricta.";
  
  store.proyectoCore.contencionEmocional = "El diseño de hardware y la programación pueden generar frustración técnica o fatiga intelectual. El investigador facilitará pausas durante los talleres, y los participantes podrán retirar sus aportes en cualquier momento previo a la publicación del repositorio.";
  
  console.log("Datos de prueba inyectados correctamente en el store.");
}