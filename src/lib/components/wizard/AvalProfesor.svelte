<!-- src/lib/components/wizard/AvalProfesor.svelte -->
<script>
  // Añadimos 'flujo' para poder extraer el nivel de riesgo calculado dinámicamente
  import { store, flujo } from '$state/store.svelte.js';
  import { copiarTexto, exportarWord, exportarPDF } from '$utils/exportador.js';
  
  import DocumentToolbar from '$components/ui/DocumentToolbar.svelte';

  function handleCopiar() {
    copiarTexto('documento-legal-exportable-aval');
  }

  function handleWord() {
    const nombre = `Aval_${store.proyectoCore.investigadorPrincipal ? store.proyectoCore.investigadorPrincipal.replace(/\s+/g, '_') : 'Estudiante'}`;
    exportarWord('documento-legal-exportable-aval', nombre);
  }

  function handlePDF() {
    const nombre = `Aval_${store.proyectoCore.investigadorPrincipal ? store.proyectoCore.investigadorPrincipal.replace(/\s+/g, '_') : 'Estudiante'}`;
    exportarPDF('documento-legal-exportable-aval', nombre);
  }
</script>

<div class="panel doc-layout">
  
  <DocumentToolbar 
    titulo="Aval de tutor o coordinador"
    subtitulo="Formato requerido por el comité para proyectos de investigación formativa y trabajo de grado."
    isAiActivated={false}
    isAiReady={false}
    isGenerating={false}
    onGenerarIA={() => {}}
    onCopiar={handleCopiar}
    onWord={handleWord}
    onPdf={handlePDF}
  />

  <div class="doc-container">
    <div id="documento-legal-exportable-aval" class="doc-content">
      
      <!-- Título institucional en mayúsculas según el formato oficial -->
      <p class="doc-title-main" style="text-transform: uppercase; font-size: 1.1rem; line-height: 1.4;">
        Aval de profesor supervisor de trabajo de grado de posgrado para solicitar aval ético
      </p>
      
      <p class="doc-text-ai doc-spacing-md">
        Yo, <span class="doc-bold">{store.proyectoCore.nombreTutor || '[nombre completo del supervisor(a)]'}</span>, en calidad de profesor supervisor del trabajo de grado titulado provisionalmente <span class="doc-bold">"{store.proyectoCore.titulo || '[título del trabajo de grado]'}"</span>, desarrollado por <span class="doc-bold">{store.proyectoCore.investigadorPrincipal || '[nombre completo del/de la estudiante]'}</span>, del programa <span class="doc-bold">{store.proyectoCore.programa || '[nombre del programa]'}</span>, dejo constancia de que conozco la propuesta y he acompañado su formulación y revisión inicial desde el punto de vista ético. 
      </p>

      <p class="doc-text-ai doc-spacing-md">
        De acuerdo con esta revisión inicial, estimamos que el nivel de riesgo ético de este trabajo de grado es: <span class="doc-bold">{flujo.nivelRiesgo.nivel || '[nivel de riesgo]'}</span>.
      </p>

      <p class="doc-text-ai doc-spacing-lg">
        Con fundamento en la revisión realizada, otorgo mi aval para que el trabajo de grado sea presentado ante el Comité de Ética de la Universidad para el otorgamiento del aval. Este aval da cuenta de la revisión y orientación realizada en mi calidad de tutor(a), pero no sustituye la evaluación ni el concepto del Comité de Ética.
      </p>

      <!-- Bloque de firmas ajustado a las líneas continuas solicitadas -->
      <div class="doc-signatures" style="margin-top: 3rem;">
        
        <p class="doc-sig-text" style="margin-bottom: 0;">________________________________________________</p>
        <p class="doc-sig-text" style="margin-top: 0.2rem; margin-bottom: 2rem;">
          Nombre del director/directora: <span class="doc-bold">{store.proyectoCore.nombreTutor || ''}</span>
        </p>

        <p class="doc-sig-text" style="margin-bottom: 0;">________________________________________________</p>
        <p class="doc-sig-text" style="margin-top: 0.2rem; margin-bottom: 2rem;">Firma</p>

        <p class="doc-sig-text" style="margin-bottom: 0;">________________________________________________</p>
        <p class="doc-sig-text" style="margin-top: 0.2rem;">Fecha</p>
        
      </div>
      
    </div>
  </div>
</div>