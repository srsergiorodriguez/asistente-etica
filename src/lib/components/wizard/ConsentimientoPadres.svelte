<!-- src/lib/components/wizard/ConsentimientoPadres.svelte -->
<script>
  import { store, flujo } from '$state/store.svelte.js';
  import { aiState, generarConIA } from '$utils/ai-engine.svelte.js';
  import { copiarTexto, exportarWord, exportarPDF } from '$utils/exportador.js';
  
  import DocumentToolbar from '$components/ui/DocumentToolbar.svelte';
  import AiGenerationStatus from '$components/ui/AiGenerationStatus.svelte';

  let isGenerating = $state(false);
  let errorMsg = $state("");
  let textoEnBruto = $state("");

  async function generarBorradorIA() {
    isGenerating = true;
    errorMsg = "";
    textoEnBruto = "";

    try {
      const contexto = `
        TÍTULO: ${store.proyectoCore.titulo}
        OBJETIVO: ${store.proyectoCore.accionObjeto}
        METODOLOGÍA: ${store.proyectoCore.metodosRecoleccion}
        RIESGO: ${store.proyectoCore.contencionEmocional}
        DATOS: ${store.proyectoCore.almacenamiento}
      `;

      const promptSistema = "Eres un sistema de procesamiento de datos. Responde estrictamente con JSON válido sin bloques de código ni texto adicional.";
      
      const promptUsuario = `Eres un asistente experto en ética. Extrae la información para un Consentimiento dirigido a los PADRES de un menor que participará en el estudio (lenguaje empático: "Su hijo/a participará...").
      
      INFORMACIÓN DEL PROYECTO:
      ${contexto}
      
      Devuelve ÚNICAMENTE un JSON con estas claves:
      {
        "justificacion": "Propósito del estudio y por qué se invita a su hijo/a.",
        "procedimientos": "Qué tendrá que hacer el menor paso a paso.",
        "riesgos": "Incomodidades posibles y cómo se protegerá al menor.",
        "beneficios": "Beneficios de la participación del menor.",
        "manejoDatos": "Cómo se protegerá la privacidad del menor."
      }`;

      const respuestaTexto = await generarConIA(promptSistema, promptUsuario, (textoActual) => {
        textoEnBruto = textoActual;
      });
      
      const jsonLimpio = respuestaTexto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const datosParseados = JSON.parse(jsonLimpio);

      // Si el objeto consentimientoPadres no existe aún en el store, lo inicializamos temporalmente aquí
      if (!store.documentos.consentimientoPadres) {
        store.documentos.consentimientoPadres = {};
      }

      if (datosParseados.justificacion) store.documentos.consentimientoPadres.justificacion = datosParseados.justificacion;
      if (datosParseados.procedimientos) store.documentos.consentimientoPadres.procedimientos = datosParseados.procedimientos;
      if (datosParseados.riesgos) store.documentos.consentimientoPadres.riesgos = datosParseados.riesgos;
      if (datosParseados.beneficios) store.documentos.consentimientoPadres.beneficios = datosParseados.beneficios;
      if (datosParseados.manejoDatos) store.documentos.consentimientoPadres.manejoDatos = datosParseados.manejoDatos;

    } catch (error) {
      console.error("Error:", error);
      errorMsg = "Error al procesar el JSON con la IA.";
    } finally {
      isGenerating = false;
    }
  }

  function handleCopiar() { copiarTexto('doc-consentimiento-padres'); }
  function handleWord() { exportarWord('doc-consentimiento-padres', `Consentimiento_Padres_${store.proyectoCore.titulo || 'Proyecto'}`); }
  function handlePDF() { exportarPDF('doc-consentimiento-padres', `Consentimiento_Padres_${store.proyectoCore.titulo || 'Proyecto'}`); }
</script>

<div class="panel doc-layout">
  
  <DocumentToolbar 
    titulo="Consentimiento para padres/acudientes"
    subtitulo="Documento que autoriza la participación de un menor."
    isAiActivated={aiState.isActivated}
    isAiReady={aiState.isReady}
    isGenerating={isGenerating}
    onGenerarIA={generarBorradorIA}
    onCopiar={handleCopiar}
    onWord={handleWord}
    onPdf={handlePDF}
  />

  <AiGenerationStatus isGenerating={isGenerating} textoEnBruto={textoEnBruto} errorMsg={errorMsg} />

  <div class="doc-container">
    <div id="doc-consentimiento-padres" class="doc-content">
      
      <p class="doc-center doc-bold">Universidad de los Andes - Facultad de Artes y Humanidades</p>
      <p class="doc-title-main">Consentimiento informado para padres o acudientes</p>
      
      <p class="doc-section-title">Título del proyecto: <span class="doc-font-normal">{store.proyectoCore.titulo || '[Título]'}</span></p>
      <p class="doc-section-title doc-spacing-md">Investigador: <span class="doc-font-normal">{store.proyectoCore.investigadorPrincipal || '[Nombre]'}</span></p>
      
      <p class="doc-section-title">1. Introducción y justificación:</p>
      <p class="doc-text-ai">{store.documentos.consentimientoPadres?.justificacion || '[Haga clic en Autocompletar con IA]'}</p>

      <p class="doc-section-title">2. Descripción del procedimiento:</p>
      <p class="doc-text-ai">{store.documentos.consentimientoPadres?.procedimientos || '[Detalle qué hará el menor]'}</p>

      <p class="doc-section-title">3. Riesgos y beneficios:</p>
      <p class="doc-text-ai">Riesgo: <span class="doc-bold">{flujo.nivelRiesgo.nivel.toLowerCase()}</span>. {store.documentos.consentimientoPadres?.riesgos || '[Riesgos]'} {store.documentos.consentimientoPadres?.beneficios || '[Beneficios]'}</p>

      <p class="doc-section-title">4. Manejo de datos y Habeas Data:</p>
      <p class="doc-text-ai">
        {store.documentos.consentimientoPadres?.manejoDatos || '[Manejo de datos]'}
        <br><br>
        Al autorizar, usted permite a la Universidad de los Andes recolectar, usar y proteger los datos del menor según el Manual de Política de Tratamiento de Datos Personales (habeasdata@uniandes.edu.co). Entendiendo el carácter facultativo de las respuestas sobre datos de niños, niñas y adolescentes.
      </p>

      <p class="doc-section-title">5. Autorizaciones (Marque Sí o No):</p>
      <ul style="list-style: none; padding-left: 0; margin-bottom: 2rem; font-family: Arial, sans-serif; font-size: 11pt;">
        <li style="margin-bottom: 0.8rem;">He comprendido la información y autorizo que mi hijo/a participe: <br><strong>Sí ___ No ___</strong></li>
        
        {#if store.diagnostico.recolectaDatosPersonales}
          <li style="margin-bottom: 0.8rem;">Autorizo el tratamiento de sus datos personales: <br><strong>Sí ___ No ___</strong></li>
          <li style="margin-bottom: 0.8rem;">Autorizo el uso de su imagen (fotografía/video): <br><strong>Sí ___ No ___</strong></li>
          <li style="margin-bottom: 0.8rem;">Autorizo grabación/transcripción de audio y video: <br><strong>Sí ___ No ___</strong></li>
        {/if}
      </ul>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma Padre/Madre/Acudiente 1:</p>
            <p class="doc-sig-text">Nombre: </p>
            <p class="doc-sig-text">Documento: </p>
          </div>
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma Padre/Madre/Acudiente 2:</p>
            <p class="doc-sig-text">Nombre: </p>
            <p class="doc-sig-text">Documento: </p>
          </div>
        </div>
        <p class="doc-text-ai doc-spacing-md" style="font-size: 0.8rem; text-align: center;"><em>* Se requiere la firma de ambos padres[cite: 11].</em></p>
      </div>
      
    </div>
  </div>
</div>