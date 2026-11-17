<!-- src/lib/components/wizard/Consentimiento.svelte -->
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
        OBJETIVO: ${store.proyectoCore.accionObjeto} ${store.proyectoCore.medio} ${store.proyectoCore.finalidad}
        METODOLOGÍA Y FASES: ${store.proyectoCore.metodosRecoleccion} - ${store.proyectoCore.fasesEstudio}
        RIESGO Y CONTENCIÓN: ${store.proyectoCore.contencionEmocional}
        DATOS (ALMACENAMIENTO/RETENCIÓN): ${store.proyectoCore.almacenamiento} - ${store.proyectoCore.retencion} - ${store.proyectoCore.accesoPrivacidad}
      `;

      const promptSistema = "Eres un sistema de procesamiento de datos. Responde estrictamente con JSON válido sin bloques de código ni texto adicional.";
      
      const promptUsuario = `Eres un asistente experto en ética de investigación. Extrae la información del proyecto y reescríbela para un Consentimiento Informado dirigido a participantes (lenguaje sencillo, empático y en segunda persona: "Usted participará..."). No asumas cosas que no están en el texto, pero redacta fluidamente.
      
      INFORMACIÓN DEL PROYECTO:
      ${contexto}
      
      REGLA VITAL: Devuelve ÚNICAMENTE un objeto JSON válido con estas 5 claves:
      {
        "justificacion": "Propósito del estudio y por qué se le invita a participar. Escribe un párrafo bien desarrollado.",
        "procedimientos": "Qué tendrá que hacer el participante paso a paso. Describe las actividades y duración.",
        "riesgos": "Incomodidades posibles y estrategias previstas para minimizar el riesgo y brindar apoyo. Párrafo desarrollado.",
        "beneficios": "Aclarar si hay beneficios o compensaciones económicas. Escribe un párrafo claro.",
        "manejoDatos": "Cómo se protegerá su privacidad, quién tendrá acceso y cuánto tiempo se guardará la información."
      }`;

      const respuestaTexto = await generarConIA(promptSistema, promptUsuario, (textoActual) => {
        textoEnBruto = textoActual;
      });
      
      const jsonLimpio = respuestaTexto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const datosParseados = JSON.parse(jsonLimpio);

      if (datosParseados.justificacion) store.documentos.consentimiento.justificacion = datosParseados.justificacion;
      if (datosParseados.procedimientos) store.documentos.consentimiento.procedimientos = datosParseados.procedimientos;
      if (datosParseados.riesgos) store.documentos.consentimiento.riesgos = datosParseados.riesgos;
      if (datosParseados.beneficios) store.documentos.consentimiento.beneficios = datosParseados.beneficios;
      if (datosParseados.manejoDatos) store.documentos.consentimiento.manejoDatos = datosParseados.manejoDatos;

    } catch (error) {
      console.error("Error en sincronización:", error);
      errorMsg = "Hubo un error al procesar el texto o la IA no devolvió el formato JSON esperado. Revise la consola.";
    } finally {
      isGenerating = false;
    }
  }

  function handleCopiar() {
    copiarTexto('documento-legal-exportable-consentimiento');
  }

  function handleWord() {
    const nombre = `Consentimiento_${store.proyectoCore.titulo || 'Proyecto'}`;
    exportarWord('documento-legal-exportable-consentimiento', nombre);
  }

  function handlePDF() {
    const nombre = `Consentimiento_${store.proyectoCore.titulo || 'Proyecto'}`;
    exportarPDF('documento-legal-exportable-consentimiento', nombre);
  }
</script>

<div class="panel doc-layout">
  
  <DocumentToolbar 
    titulo="Consentimiento informado"
    subtitulo="Documento general para participantes adultos."
    isAiActivated={aiState.isActivated}
    isAiReady={aiState.isReady}
    isGenerating={isGenerating}
    onGenerarIA={generarBorradorIA}
    onCopiar={handleCopiar}
    onWord={handleWord}
    onPdf={handlePDF}
  />

  <AiGenerationStatus 
    isGenerating={isGenerating}
    textoEnBruto={textoEnBruto}
    errorMsg={errorMsg}
  />

  <div class="doc-container">
    <div id="documento-legal-exportable-consentimiento" class="doc-content">
      
      <p class="doc-center doc-bold">Universidad de los Andes - Facultad de Artes y Humanidades</p>
      <p class="doc-title-main">Consentimiento informado para participación en investigación</p>
      
      <p class="doc-section-title">Título del proyecto: <span class="doc-font-normal">{store.proyectoCore.titulo || '[Título del proyecto no definido]'}</span></p>
      
      <p class="doc-section-title doc-spacing-md">Investigador responsable: <span class="doc-font-normal">{store.proyectoCore.investigadorPrincipal || '[Nombre del investigador no definido]'} {store.proyectoCore.datosContacto ? `(${store.proyectoCore.datosContacto})` : ''}</span></p>
      
      <p class="doc-section-title">1. Introducción y justificación:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.justificacion} {store.documentos.consentimiento.justificacion} {:else} <span class="doc-placeholder">[Haga clic en 'Autocompletar con IA' para redactar esta sección].</span> {/if}
      </p>

      <p class="doc-section-title">2. Descripción del procedimiento:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.procedimientos} {store.documentos.consentimiento.procedimientos} {:else} <span class="doc-placeholder">[Detalle aquí en qué consistirá la participación].</span> {/if}
      </p>

      <p class="doc-section-title">3. Riesgos, molestias y contención:</p>
      <p class="doc-text-ai">
        Esta investigación se clasifica con un nivel de <span class="doc-bold">{flujo.nivelRiesgo.nivel.toLowerCase()}</span>. 
        {#if store.documentos.consentimiento.riesgos} {store.documentos.consentimiento.riesgos} {:else} <span class="doc-placeholder">[Describa aquí los riesgos, molestias y el apoyo brindado].</span> {/if}
      </p>

      <p class="doc-section-title">4. Beneficios esperados:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.beneficios} {store.documentos.consentimiento.beneficios} {:else} <span class="doc-placeholder">[Aclare si existe remuneración y el beneficio de la investigación].</span> {/if}
      </p>

      <p class="doc-section-title">5. Confidencialidad y manejo de datos:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.manejoDatos} {store.documentos.consentimiento.manejoDatos} {:else} <span class="doc-placeholder">[Describa aquí los protocolos de privacidad y retención].</span> {/if}
      </p>

      {#if store.diagnostico.recolectaDatosPersonales}
        <p class="doc-section-title">6. Autorización de datos personales (Habeas Data):</p>
        <p class="doc-text-ai">
          La Universidad de los Andes, como institución que almacena y recolecta datos personales, requiere obtener su autorización para recolectar, usar, suprimir, procesar, verificar, dar tratamiento, actualizar y disponer de los datos que han sido suministrados y que se han incorporado en las bases de datos con que cuenta la Universidad (incluyendo fotografía o producción Audiovisual, biométricos). La información será utilizada para el desarrollo de las funciones propias de la Universidad en su condición de institución de educación superior.
        </p>
        <p class="doc-text-ai">
          De igual manera usted declara que está al tanto de los derechos que le asisten como titular de datos, especialmente los de conocer, actualizar y rectificar sus datos personales frente a la Universidad de los Andes, y los demás consagrados en el Manual de Política de Tratamiento de Datos Personales de la Universidad, así como del carácter facultativo de la respuesta a las preguntas, si se le llegasen a hacer, cuando estas versen sobre datos sensibles.
        </p>
        <p class="doc-text-ai">
          Para ejercer su derecho de Habeas Data, usted puede direccionar sus peticiones al correo: habeasdata@uniandes.edu.co.
        </p>
      {/if}

      <p class="doc-section-title">7. Voluntariedad, derecho a retirarse y contacto:</p>
      <p class="doc-text-ai">
        Su participación es completamente voluntaria. Puede retirarse en cualquier momento sin que ello le afecte. Si tiene alguna duda sobre los procedimientos, riesgos o beneficios, puede contactar al equipo investigador en cualquier etapa del estudio.
      </p>

      <p class="doc-section-title">8. Declaraciones y autorizaciones:</p>
      <ul style="list-style: none; padding-left: 0; margin-bottom: 2rem; font-family: Arial, sans-serif; font-size: 11pt;">
        <li style="margin-bottom: 0.8rem;">
          He leído y comprendido la información proporcionada. Acepto participar en el estudio.<br>
          <strong>Sí ___ No ___</strong>
        </li>
        <!-- Condicional global para todo lo relacionado con datos y registros -->
        {#if store.diagnostico.recolectaDatosPersonales}
          <li style="margin-bottom: 0.8rem;">
            Autorizo el tratamiento de datos personales:<br>
            <strong>Sí ___ No ___</strong>
          </li>
          {#if store.diagnostico.temasSensibles}
            <li style="margin-bottom: 0.8rem;">
              Autorizo el tratamiento de datos sensibles:<br>
              <strong>Sí ___ No ___</strong>
            </li>
          {/if}
          <li style="margin-bottom: 0.8rem;">
            Autorizo de forma no exclusiva la utilización de mis derechos de imagen (fotografía/video) para los fines de esta investigación:<br>
            <strong>Sí ___ No ___</strong>
          </li>
          <li style="margin-bottom: 0.8rem;">
            Autorizo grabación de audio y/o video:<br>
            <strong>Sí ___ No ___</strong>
          </li>
          <li style="margin-bottom: 0.8rem;">
            Autorizo la transcripción del audio y/o video:<br>
            <strong>Sí ___ No ___</strong>
          </li>
        {/if}
      </ul>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del participante:</p>
            <p class="doc-sig-text">Nombre: </p>
            <p class="doc-sig-text">No. Documento: </p>
            <p class="doc-sig-text">Fecha: </p>
          </div>
        </div>

        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma testigo 1:</p>
            <p class="doc-sig-text">Nombre y doc: </p>
          </div>
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma testigo 2:</p>
            <p class="doc-sig-text">Nombre y doc: </p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>