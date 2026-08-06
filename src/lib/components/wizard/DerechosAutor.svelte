<!-- src/lib/components/wizard/DerechosAutor.svelte -->
<script>
  import { store } from '$state/store.svelte.js';
  import { copiarTexto, exportarWord, exportarPDF } from '$utils/exportador.js';
  
  import DocumentToolbar from '$components/ui/DocumentToolbar.svelte';

  function handleCopiar() {
    copiarTexto('documento-legal-exportable-derechos');
  }

  function handleWord() {
    const nombre = `Derechos_Autor_${store.proyectoCore.investigadorPrincipal ? store.proyectoCore.investigadorPrincipal.replace(/\s+/g, '_') : 'Investigador'}`;
    exportarWord('documento-legal-exportable-derechos', nombre);
  }

  function handlePDF() {
    const nombre = `Derechos_Autor_${store.proyectoCore.investigadorPrincipal ? store.proyectoCore.investigadorPrincipal.replace(/\s+/g, '_') : 'Investigador'}`;
    exportarPDF('documento-legal-exportable-derechos', nombre);
  }
</script>

<div class="panel doc-layout">
  
  <DocumentToolbar 
    titulo="Derechos de autor y uso de archivo"
    subtitulo="Declaración de responsabilidad sobre el uso de propiedad intelectual de terceros."
    isAiActivated={false}
    isAiReady={false}
    isGenerating={false}
    onGenerarIA={() => {}}
    onCopiar={handleCopiar}
    onWord={handleWord}
    onPdf={handlePDF}
  />

  <!-- Banner informativo para el usuario de la plataforma -->
  <div style="background-color: #e3f2fd; border: 1px solid #90caf9; border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 0.5rem;">
    <strong style="color: #0d47a1; font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">Gestión independiente de derechos</strong>
    <span style="color: #1565c0; font-size: 0.85rem;">
      El Comité de Ética evalúa el riesgo humano, pero no tramita licencias de uso de imagen, reproducción de obras ni permisos de archivos históricos. Usted debe gestionar esas autorizaciones por su cuenta antes de publicar los resultados. Este documento formaliza su compromiso de hacerlo.
    </span>
  </div>

  <div class="doc-container">
    <div id="documento-legal-exportable-derechos" class="doc-content">
      
      <p class="doc-center doc-bold">Universidad de los Andes - Facultad de Artes y Humanidades</p>
      <p class="doc-title-main">Declaración de compromiso de gestión de derechos de autor y uso de materiales</p>
      
      <p class="doc-text-ai doc-spacing-md">
        Bogotá, D.C., a los ____ días del mes de ____________ de 20__.
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
        Quien suscribe este documento, <span class="doc-bold">{store.proyectoCore.investigadorPrincipal || '[Nombre del investigador/estudiante]'}</span>, en calidad de investigador principal del proyecto titulado <span class="doc-bold">"{store.proyectoCore.titulo || '[Título del proyecto]'}"</span>, manifiesto que esta investigación contempla el uso, análisis o reproducción de documentos, imágenes, repositorios, obras artísticas, piezas de colecciones o material de archivo creado por terceros.
      </p>

      <p class="doc-text-ai doc-spacing-md">
        A través de esta declaración, asumo la responsabilidad legal, académica y personal de gestionar y obtener todos los permisos, licencias (incluidas las de tipo Creative Commons o verificaciones de Dominio Público) y autorizaciones necesarias de parte de los autores originarios, herederos, archivos, museos o instituciones depositarias, previo a cualquier publicación, exhibición o socialización pública de los resultados de este proyecto.
      </p>

      <p class="doc-text-ai doc-spacing-lg">
        En consecuencia, eximo al Comité de Ética en Investigación, a la Facultad de Artes y Humanidades y a la Universidad de los Andes de cualquier responsabilidad derivada de disputas o reclamaciones por infracción a la propiedad intelectual, derechos conexos o derechos de imagen que pudieran surgir como resultado de las actividades del proyecto en mención.
      </p>

      <p class="doc-text-ai doc-spacing-lg">
        Atentamente,
      </p>

      <div class="doc-signatures">
        <div class="doc-sig-row">
          <div class="doc-sig-box" style="width: 100%;">
            <p class="doc-sig-line" style="width: 45%;">Firma del investigador principal:</p>
            <p class="doc-sig-text">Nombre: {store.proyectoCore.investigadorPrincipal || '________________________'}</p>
            <p class="doc-sig-text">Documento de identidad: ________________________</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>