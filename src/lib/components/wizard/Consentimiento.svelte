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
        "procedimientos": "Qué tendrá que hacer el participante paso a paso. Describe las actividades de forma detallada y fluida.",
        "riesgos": "Clasificación de riesgo, incomodidades posibles y qué apoyo se le brindará. Escribe un párrafo bien desarrollado.",
        "beneficios": "Aclarar si hay remuneración y cuál es el beneficio social/académico. Escribe un párrafo claro.",
        "manejoDatos": "Cómo se protegerá su privacidad y cuánto tiempo se guardará la información. Escribe un párrafo bien desarrollado."
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
    copiarTexto('documento-legal-exportable');
  }

  function handleWord() {
    const nombre = `Consentimiento_${store.proyectoCore.titulo || 'Proyecto'}`;
    exportarWord('documento-legal-exportable', nombre);
  }

  function handlePDF() {
    const nombre = `Consentimiento_${store.proyectoCore.titulo || 'Proyecto'}`;
    exportarPDF('documento-legal-exportable', nombre);
  }
</script>

<div class="panel doc-layout">
  
  <DocumentToolbar 
    titulo="Consentimiento informado"
    subtitulo="Edite en su procesador de texto favorito tras exportar."
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
    <div id="documento-legal-exportable" class="doc-content">
      
      <p class="doc-center doc-bold">Universidad de los Andes - Facultad de Artes y Humanidades</p>
      <p class="doc-title-main">Formato de consentimiento informado</p>
      
      <p class="doc-section-title">Título del proyecto: <span class="doc-font-normal">{store.proyectoCore.titulo || '[Título del proyecto no definido]'}</span></p>
      
      <p class="doc-section-title doc-spacing-md">Investigador responsable: <span class="doc-font-normal">{store.proyectoCore.investigadorPrincipal || '[Nombre del investigador no definido]'} {store.proyectoCore.datosContacto ? `(${store.proyectoCore.datosContacto})` : ''}</span></p>
      
      <p class="doc-section-title">1. Justificación y objetivos:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.justificacion} {store.documentos.consentimiento.justificacion} {:else} <span class="doc-placeholder">[Haga clic en 'Autocompletar con IA' para redactar esta sección].</span> {/if}
      </p>

      <p class="doc-section-title">2. Procedimientos y participación:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.procedimientos} {store.documentos.consentimiento.procedimientos} {:else} <span class="doc-placeholder">[Detalle aquí en qué consistirá la participación].</span> {/if}
      </p>

      <p class="doc-section-title">3. Riesgos, molestias y contención:</p>
      <p class="doc-text-ai">
        De acuerdo con la Resolución 008430 de 1993 del Ministerio de Salud, esta investigación se clasifica como <span class="doc-bold">{flujo.nivelRiesgo.nivel.toLowerCase()}</span>. 
        {#if store.documentos.consentimiento.riesgos} {store.documentos.consentimiento.riesgos} {:else} <span class="doc-placeholder">[Describa aquí los riesgos o la ausencia de los mismos].</span> {/if}
      </p>

      <p class="doc-section-title">4. Beneficios esperados:</p>
      <p class="doc-text-ai">
        {#if store.documentos.consentimiento.beneficios} {store.documentos.consentimiento.beneficios} {:else} <span class="doc-placeholder">[Aclare si existe remuneración y el beneficio de la investigación].</span> {/if}
      </p>

      {#if store.diagnostico.recolectaDatosPersonales}
        <p class="doc-section-title">5. Cláusula de tratamiento de datos personales:</p>
        <p class="doc-text-ai">
          Al participar, usted autoriza el tratamiento de sus datos personales. {#if store.documentos.consentimiento.manejoDatos} {store.documentos.consentimiento.manejoDatos} {:else} <span class="doc-placeholder">[Describa aquí los protocolos de anonimización y retención].</span> {/if} Usted tiene el derecho legal de conocer, actualizar y solicitar el retiro o anonimización de sus datos en cualquier momento contactando al equipo investigador.
        </p>
      {:else}
        <p class="doc-section-title">5. Confidencialidad:</p>
        <p class="doc-text-ai">
          Este proyecto no recolecta datos personales que permitan su identificación. La información recopilada será de carácter general y anónimo desde su origen.
        </p>
      {/if}

      <p class="doc-section-title">Participación voluntaria:</p>
      <p class="doc-text-ai">
        Su participación es estrictamente voluntaria. Usted tiene total libertad de negarse a participar o retirar su consentimiento en cualquier etapa del estudio sin ninguna consecuencia negativa o penalidad.
      </p>

      <p class="doc-section-title">Declaración de consentimiento:</p>
      <p class="doc-text-ai doc-spacing-lg">
        He leído y comprendido la información proporcionada. Se me han explicado los objetivos, riesgos y beneficios del proyecto y todas mis preguntas han sido respondidas. Con pleno conocimiento, autorizo mi participación en la investigación.
      </p>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del participante:</p>
            <p class="doc-sig-text">Nombre: </p>
            <p class="doc-sig-text">Fecha: </p>
          </div>
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del investigador responsable:</p>
            <p class="doc-sig-text">Nombre: {store.proyectoCore.investigadorPrincipal || '________________________'}</p>
          </div>
        </div>

        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma testigo 1:</p>
            <p class="doc-sig-text">Nombre y relación: </p>
          </div>
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma testigo 2:</p>
            <p class="doc-sig-text">Nombre y relación: </p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>