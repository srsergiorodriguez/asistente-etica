<!-- src/lib/components/ui/Instrucciones.svelte -->
<script>
  let { cerrarGuia } = $props();
</script>

<div class="modal-overlay">
  <div class="modal-content">
    
    <div class="modal-header">
      <h3 style="margin: 0; color: var(--color-text-main); font-size: 1.25rem;">Guía de uso: suite de ética de investigación</h3>
      <button class="btn btn-secondary" onclick={cerrarGuia}>Cerrar</button>
    </div>
    
    <div class="modal-body grid-dos-columnas">
      <div>
        <h4 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1rem;">1. Jerarquía de documentos</h4>
        <p style="margin-top: 0; margin-bottom: 1.2rem; color: var(--color-text-muted); font-size: 0.95rem;">
          El formulario <strong>Planteamiento general</strong> es la base obligatoria. Al llenarlo, la aplicación diagnosticará su nivel de riesgo y habilitará en el panel central los documentos anexos que usted necesita (Consentimiento, Asentimiento, Aval o Derechos de autor). Toda la información se hereda de este planteamiento.
        </p>
        
        <h4 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1rem;">2. Trámite institucional</h4>
        <p style="margin-top: 0; margin-bottom: 0; color: var(--color-text-muted); font-size: 0.95rem;">
          Para formalizar su solicitud, copie los textos generados aquí en el formulario oficial de <a href="https://platypus.uniandes.edu.co" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary-hover); font-weight: bold;">Platypus</a> y suba sus anexos exportados en PDF. <br><br>
          Recuerde adjuntar el certificado del curso de ética (<a href="https://investigacioncreacion.uniandes.edu.co/sites/default/files/anexo6-infografia-certificacion-cursos-etica.png" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary-hover);">ver instructivo</a>).
        </p>
      </div>

      <div>
        <h4 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1rem;">3. Asistencia de inteligencia artificial (100% privada)</h4>
        <p style="margin-top: 0; margin-bottom: 0.8rem; color: var(--color-text-muted); font-size: 0.95rem;">
          Esta suite procesa la redacción directamente en su navegador, garantizando que sus datos nunca se envíen a servidores externos.
        </p>
        <ul style="margin-top: 0; padding-left: 1.2rem; margin-bottom: 1.2rem; color: var(--color-text-muted); font-size: 0.95rem;">
          <li style="margin-bottom: 0.4rem;"><strong>Autocompletado:</strong> En los anexos de Consentimiento y Asentimiento, use el botón de generación IA. El asistente redactará las cláusulas completas basándose en su planteamiento.</li>
          <li><strong>Revisión humana:</strong> Al ser un modelo ligero, la IA puede cometer errores. Lea y edite siempre el documento antes de exportarlo.</li>
        </ul>

        <h4 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1rem;">4. Herramientas de apoyo</h4>
        <p style="margin-top: 0; margin-bottom: 0; color: var(--color-text-muted); font-size: 0.95rem;">
          Utilice el <strong>Glosario</strong> en la barra superior para aclarar términos técnicos. Los documentos fijos, como la Política de datos y el Aval de profesor, ya incluyen los textos jurídicos exigidos por la facultad listos para descargar.
        </p>
      </div>
    </div>

  </div>
</div>