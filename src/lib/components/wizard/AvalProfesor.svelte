<!-- src/lib/components/wizard/AvalProfesor.svelte -->
<script>
  import { store } from '$state/store.svelte.js';
  import { copiarTexto, exportarWord, exportarPDF } from '$utils/exportador.js';
  
  import DocumentToolbar from '$components/ui/DocumentToolbar.svelte';

  function handleCopiar() {
    copiarTexto('documento-legal-exportable-aval');
  }

  function handleWord() {
    // Usamos el nombre del estudiante para el archivo
    const nombre = `Aval_${store.proyectoCore.investigadorPrincipal ? store.proyectoCore.investigadorPrincipal.replace(/\s+/g, '_') : 'Estudiante'}`;
    exportarWord('documento-legal-exportable-aval', nombre);
  }

  function handlePDF() {
    const nombre = `Aval_${store.proyectoCore.investigadorPrincipal ? store.proyectoCore.investigadorPrincipal.replace(/\s+/g, '_') : 'Estudiante'}`;
    exportarPDF('documento-legal-exportable-aval', nombre);
  }
</script>

<div class="panel doc-layout">
  
  <!-- Usamos el componente reutilizable desactivando la IA -->
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
      
      <p class="doc-center doc-bold">Universidad de los Andes - Facultad de Artes y Humanidades</p>
      <p class="doc-title-main">Aval de tutor o coordinador de proyecto</p>
      
      <p class="doc-text-ai doc-spacing-md">
        Fecha: ______________________________
      </p>

      <p class="doc-text-ai doc-spacing-md">
        Señores<br>
        <span class="doc-bold">Comité de Ética en Investigación</span><br>
        Facultad de Artes y Humanidades<br>
        Universidad de los Andes
      </p>

      <p class="doc-text-ai doc-spacing-md">
        Respetados miembros del comité,
      </p>

      <p class="doc-text-ai doc-spacing-md">
        Por medio de la presente comunicación, yo, <span class="doc-bold">{store.proyectoCore.nombreTutor || '[Nombre del profesor/tutor]'}</span>, manifiesto que obro en calidad de profesor tutor / coordinador del estudiante <span class="doc-bold">{store.proyectoCore.investigadorPrincipal || '[Nombre del estudiante]'}</span>.
      </p>

      <p class="doc-text-ai doc-spacing-md">
        He revisado detalladamente el planteamiento, los objetivos y la arquitectura metodológica del proyecto titulado <span class="doc-bold">"{store.proyectoCore.titulo || '[Título del proyecto]'}"</span>. Certifico que he discutido a cabalidad las implicaciones y posibles riesgos éticos de esta investigación con el/la estudiante, asegurando que se han contemplado las medidas de mitigación, privacidad y contención adecuadas para el trabajo en nuestra disciplina.
      </p>

      <p class="doc-text-ai doc-spacing-lg">
        Por lo anterior, apruebo formalmente los instrumentos de recolección y los consentimientos informados aquí presentados, y otorgo mi aval para que el/la estudiante envíe esta solicitud para la revisión oficial de su comité.
      </p>

      <p class="doc-text-ai doc-spacing-lg">
        Cordialmente,
      </p>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box">
            <p class="doc-sig-line">Firma del profesor avalador</p>
            <p class="doc-sig-text">Nombre: {store.proyectoCore.nombreTutor || '________________________'}</p>
            <p class="doc-sig-text">Cargo / Afiliación: ________________________</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>