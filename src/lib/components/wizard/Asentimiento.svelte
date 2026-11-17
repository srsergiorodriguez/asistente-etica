<!-- src/lib/components/wizard/Asentimiento.svelte -->
<script>
  import { store, flujo } from '$state/store.svelte.js';
  import { aiState, generarConIA } from '$utils/ai-engine.svelte.js';
  import { copiarTexto, exportarWord, exportarPDF } from '$utils/exportador.js';
  
  import DocumentToolbar from '$components/ui/DocumentToolbar.svelte';
  import AiGenerationStatus from '$components/ui/AiGenerationStatus.svelte';

  let isGenerating = $state(false);
  let errorMsg = $state("");
  let textoEnBruto = $state("");

  if (!store.documentos.asentimiento) {
    store.documentos.asentimiento = {
      introduccion: "",
      actividades: "",
      riesgos: "",
      beneficios: "",
      derechos: ""
    };
  }

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
      `;

      const promptSistema = "Eres un sistema de procesamiento de datos. Responde estrictamente con JSON válido sin bloques de código ni texto adicional.";
      
      const promptUsuario = `Eres un experto en comunicación empática con menores de edad. Extrae la información del proyecto y reescríbela para un Asentimiento Informado dirigido a un niño, niña o adolescente (nivel de lectura promedio de 10 a 12 años). Usa un tono cercano, amigable y háblale de "tú". Evita por completo la jerga académica.
      
      INFORMACIÓN DEL PROYECTO:
      ${contexto}
      
      REGLA VITAL: Devuelve ÚNICAMENTE un objeto JSON válido con estas 5 claves:
      {
        "introduccion": "Explica el propósito del estudio de forma interesante. Escribe un párrafo.",
        "actividades": "Explica el paso a paso de lo que tendrá que hacer como si le contaras una actividad. Escribe un párrafo detallado.",
        "riesgos": "Explica los riesgos de cansancio o aburrimiento y dile claramente que si se siente mal puede parar. Escribe un párrafo.",
        "beneficios": "Aclara si hay premios o solo aprenderemos cosas nuevas. Escribe un párrafo corto.",
        "derechos": "Recuérdale que nadie le obliga, que puede decir NO en cualquier momento y que su información es privada. Escribe un párrafo."
      }`;

      const respuestaTexto = await generarConIA(promptSistema, promptUsuario, (textoActual) => {
        textoEnBruto = textoActual;
      });
      
      const jsonLimpio = respuestaTexto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const datosParseados = JSON.parse(jsonLimpio);

      if (datosParseados.introduccion) store.documentos.asentimiento.introduccion = datosParseados.introduccion;
      if (datosParseados.actividades) store.documentos.asentimiento.actividades = datosParseados.actividades;
      if (datosParseados.riesgos) store.documentos.asentimiento.riesgos = datosParseados.riesgos;
      if (datosParseados.beneficios) store.documentos.asentimiento.beneficios = datosParseados.beneficios;
      if (datosParseados.derechos) store.documentos.asentimiento.derechos = datosParseados.derechos;

    } catch (error) {
      console.error("Error en sincronización:", error);
      errorMsg = "Hubo un error al procesar el texto o la IA no devolvió el formato JSON esperado. Revise la consola.";
    } finally {
      isGenerating = false;
    }
  }

  function handleCopiar() {
    copiarTexto('documento-legal-exportable-asentimiento');
  }

  function handleWord() {
    const nombre = `Asentimiento_${store.proyectoCore.titulo || 'Proyecto'}`;
    exportarWord('documento-legal-exportable-asentimiento', nombre);
  }

  function handlePDF() {
    const nombre = `Asentimiento_${store.proyectoCore.titulo || 'Proyecto'}`;
    exportarPDF('documento-legal-exportable-asentimiento', nombre);
  }
</script>

<div class="panel doc-layout">
  
  <DocumentToolbar 
    titulo="Asentimiento informado (Menores)"
    subtitulo="Documento mediante el cual el menor expresa su acuerdo para participar en la investigación."
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
    <div id="documento-legal-exportable-asentimiento" class="doc-content">
      
      <p class="doc-center doc-bold">Universidad de los Andes - Facultad de Artes y Humanidades</p>
      <p class="doc-title-main">Asentimiento informado para participación en investigación</p>
      
      <p class="doc-section-title">Título del proyecto: <span class="doc-font-normal">{store.proyectoCore.titulo || '[Título del proyecto no definido]'}</span></p>
      
      <p class="doc-section-title doc-spacing-md">Investigador responsable: <span class="doc-font-normal">{store.proyectoCore.investigadorPrincipal || '[Nombre del investigador no definido]'} {store.proyectoCore.datosContacto ? `(${store.proyectoCore.datosContacto})` : ''}</span></p>
      
      <p class="doc-section-title">1. ¿De qué se trata esto?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.introduccion} {store.documentos.asentimiento.introduccion} {:else} <span class="doc-placeholder">[Haga clic en 'Autocompletar con IA' para redactar esta sección].</span> {/if}
      </p>

      <p class="doc-section-title">2. ¿Qué tendrás que hacer?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.actividades} {store.documentos.asentimiento.actividades} {:else} <span class="doc-placeholder">[Detalle aquí la metodología en lenguaje sencillo].</span> {/if}
      </p>

      <p class="doc-section-title">3. ¿Podría haber algún problema o molestia?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.riesgos} {store.documentos.asentimiento.riesgos} {:else} <span class="doc-placeholder">[Describa aquí si puede aburrirse o cansarse y qué harán al respecto].</span> {/if}
      </p>

      <p class="doc-section-title">4. ¿Por qué es importante tu ayuda?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.beneficios} {store.documentos.asentimiento.beneficios} {:else} <span class="doc-placeholder">[Aclare los beneficios o la ausencia de premios].</span> {/if}
      </p>

      <p class="doc-section-title">5. Tus derechos y tu información:</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.derechos} {store.documentos.asentimiento.derechos} {:else} <span class="doc-placeholder">[Explique el anonimato y la voluntariedad de manera simple].</span> {/if}
      </p>

      {#if store.diagnostico.recolectaDatosPersonales}
        <p class="doc-section-title">6. Autorización de datos personales (Para ti y tus padres/tutores):</p>
        <p class="doc-text-ai" style="font-size: 0.85rem;">
          La Universidad de los Andes, como institución que almacena y recolecta datos personales, requiere obtener su autorización para recolectar, usar, suprimir, procesar, verificar, dar tratamiento, actualizar y disponer de los datos que han sido suministrados y que se han incorporado en las bases de datos con que cuenta la Universidad (incluyendo fotografía o producción Audiovisual, biométricos). La información será utilizada para el desarrollo de las funciones propias de la Universidad en su condición de institución de educación superior, de forma directa o a través de terceros.
        </p>
        <p class="doc-text-ai" style="font-size: 0.85rem;">
          De igual manera usted declara que está al tanto de los derechos que le asisten como titular de datos, especialmente los de conocer, actualizar y rectificar sus datos personales frente a la Universidad de los Andes, y los demás consagrados en el Manual de Política de Tratamiento de Datos Personales de la Universidad, las normas pertinentes y aplicables, así como del carácter facultativo de la respuesta a las preguntas, si se le llegasen a hacer, cuando estas versen sobre datos sensibles o sobre los datos de las niñas, niños y adolescentes.
        </p>
        <p class="doc-text-ai" style="font-size: 0.85rem;">
          Para ejercer su derecho de Habeas Data, usted puede direccionar sus peticiones al correo: habeasdata@uniandes.edu.co.
        </p>
      {/if}

      <p class="doc-section-title">7. Tu decisión:</p>
      <ul style="list-style: none; padding-left: 0; margin-bottom: 2rem; font-family: Arial, sans-serif; font-size: 11pt;">
        <li style="margin-bottom: 0.8rem;">
          He leído y comprendido la información proporcionada. Acepto participar en el estudio.<br>
          <strong>Sí ___ No ___</strong>
        </li>
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
            Autorizo de forma no exclusiva la utilización de mis derechos de imagen para su fijación sobre fotografías o producciones audiovisuales:<br>
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

      <p class="doc-text-ai doc-spacing-lg">
        Recuerda que este documento debe estar acompañado por el consentimiento firmado de tus padres o tutor legal.
      </p>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del participante:</p>
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