<!-- src/lib/components/wizard/Asentimiento.svelte -->
<script>
  import { store } from '$state/store.svelte.js';
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
    subtitulo="Formato adaptado para ser comprendido por niños, niñas y adolescentes."
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
      <p class="doc-title-main">Formato de asentimiento informado (Para menores de edad)</p>
      
      <p class="doc-section-title">Título del proyecto: <span class="doc-font-normal">{store.proyectoCore.titulo || '[Título del proyecto no definido]'}</span></p>
      
      <p class="doc-section-title doc-spacing-md">Investigador responsable: <span class="doc-font-normal">{store.proyectoCore.investigadorPrincipal || '[Nombre del investigador no definido]'} {store.proyectoCore.datosContacto ? `(${store.proyectoCore.datosContacto})` : ''}</span></p>
      
      <p class="doc-section-title">¿De qué se trata esto?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.introduccion} {store.documentos.asentimiento.introduccion} {:else} <span class="doc-placeholder">[Haga clic en 'Autocompletar con IA' para redactar esta sección].</span> {/if}
      </p>

      <p class="doc-section-title">¿Qué tendrás que hacer?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.actividades} {store.documentos.asentimiento.actividades} {:else} <span class="doc-placeholder">[Detalle aquí la metodología en lenguaje sencillo].</span> {/if}
      </p>

      <p class="doc-section-title">¿Podría haber algún problema o molestia?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.riesgos} {store.documentos.asentimiento.riesgos} {:else} <span class="doc-placeholder">[Describa aquí si puede aburrirse o cansarse y qué harán al respecto].</span> {/if}
      </p>

      <p class="doc-section-title">¿Por qué es importante tu ayuda?</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.beneficios} {store.documentos.asentimiento.beneficios} {:else} <span class="doc-placeholder">[Aclare los beneficios o la ausencia de premios].</span> {/if}
      </p>

      <p class="doc-section-title">Tus derechos y tu información:</p>
      <p class="doc-text-ai">
        {#if store.documentos.asentimiento?.derechos} {store.documentos.asentimiento.derechos} {:else} <span class="doc-placeholder">[Explique el anonimato y la voluntariedad de manera simple].</span> {/if}
      </p>

      <p class="doc-section-title">Tu decisión:</p>
      <p class="doc-text-ai doc-spacing-lg">
        Recuerda que no tienes que participar si no quieres, y si dices que sí ahora, puedes arrepentirte más tarde sin que nadie se enoje. Además de ti, tus padres o tutores también tienen que estar de acuerdo. Si tienes alguna pregunta, puedes hacerla ahora.
      </p>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma o nombre del participante (Menor):</p>
            <p class="doc-sig-text">Nombre: </p>
            <p class="doc-sig-text">Fecha: </p>
          </div>
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del padre, madre o tutor:</p>
            <p class="doc-sig-text">Nombre: </p>
            <p class="doc-sig-text">Parentesco: </p>
          </div>
        </div>

        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del investigador responsable:</p>
            <p class="doc-sig-text">Nombre: {store.proyectoCore.investigadorPrincipal || '________________________'}</p>
          </div>
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del testigo:</p>
            <p class="doc-sig-text">Nombre: </p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>