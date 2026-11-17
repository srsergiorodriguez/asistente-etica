<!-- src/lib/components/ui/ModalAdvertenciaIA.svelte -->
<script>
  let { onCancelar, onAceptar } = $props();
</script>

<div class="modal-overlay">
  <div class="modal-content" style="max-width: 500px;">
    
    <div class="modal-header">
      <h3 style="margin: 0; color: var(--color-text-main); font-size: 1.25rem;">Asistencia de redacción inteligente</h3>
      <button class="btn btn-secondary" onclick={onCancelar}>Cerrar</button>
    </div>
    
    <div class="modal-body">
      <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-top: 0;">
        Esta herramienta utiliza inteligencia artificial local para ayudarle a redactar los textos con el tono adecuado para el comité de ética.
      </p>
      
      <!-- Bloque de advertencia con colores de riesgo institucional -->
      <div style="background-color: rgba(232, 126, 20, 0.1); border-left: 3px solid var(--color-risk-high); padding: 0.75rem 1rem; margin: 1.5rem 0; font-size: 0.9rem;">
        <strong>Importante:</strong> Como cualquier modelo de lenguaje, la IA puede omitir información, alterar el sentido original o cometer errores de redacción. Por favor, <strong>revise y valide siempre</strong> el texto generado.
      </div>
      
      <p style="font-size: 0.9rem; color: var(--color-text-muted);">
        <strong>Privacidad total:</strong> Los datos nunca salen de su computador. Para lograr esto, su navegador descargará un motor de IA por única vez (aprox. 800 MB).
      </p>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick={onCancelar}>Cancelar</button>
        <button class="btn btn-primary" onclick={onAceptar}>Entendido, activar IA</button>
      </div>
    </div>

  </div>
</div>