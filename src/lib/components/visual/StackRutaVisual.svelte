<!-- src/lib/components/visual/StackRutaVisual.svelte -->
<script>
  import { store, flujo } from '$state/store.svelte.js';

  // UI Helper: Valida si el documento ya tiene la información necesaria para considerarse "listo"
  function verificarEstado(id) {
    if (id === 'planteamiento') {
      return flujo.estaCompletado('planteamiento');
    }
    if (id === 'consentimiento') {
      return store.documentos.consentimiento.justificacion?.trim() !== "";
    }
    if (id === 'asentimiento') {
      return store.documentos.asentimiento?.introduccion?.trim() !== "";
    }
    // Las plantillas estáticas no requieren generación, siempre están listas para descargar
    if (['aval', 'derechosAutor'].includes(id)) {
      return true;
    }
    return false;
  }
</script>

<div class="stack-container">
  <div class="risk-badge" style="background-color: {flujo.nivelRiesgo.color}">
    Riesgo Sugerido: <strong>{flujo.nivelRiesgo.nivel}</strong>
  </div>

  <div class="nodes-wrapper">
    {#each flujo.documentosRequeridos as doc, i}
      <div class="node-item">
        
        <button 
          class="node-box 
                 {store.documentoActivo === doc.id ? 'activo' : ''} 
                 {doc.id === 'planteamiento' ? 'node-root' : ''}"
          onclick={() => flujo.seleccionarDocumento(doc.id)}
        >
          <span class="node-title">{doc.titulo}</span>
          
          <!-- Indicador de estado (Checkmark) -->
          {#if verificarEstado(doc.id)}
            <div class="status-indicator" title="Documento listo o con datos">
              ✓
            </div>
          {/if}
        </button>
        
        <!-- Flecha de conexión -->
        {#if i < flujo.documentosRequeridos.length - 1}
          <svg class="node-arrow" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 4v16M18 14l-6 6-6-6" stroke="#adb5bd" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}

      </div>
    {/each}
  </div>
</div>

<style>
  .stack-container {
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    overflow-y: auto;
  }

  .risk-badge {
    align-self: center;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    color: #000000;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .nodes-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }

  .node-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .node-box {
    width: 100%;
    background-color: var(--color-bg-app);
    border: 1px solid var(--color-border);
    padding: 0.85rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    
    /* Configuración flex para separar texto del indicador de estado */
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .node-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-main);
  }

  /* Estados y Modificadores del Nodo */
  .node-box:hover {
    border-color: var(--color-primary-hover);
    background-color: #fff;
    transform: translateY(-2px);
  }

  .node-box.activo {
    border-color: var(--color-primary);
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
  }

  /* El Nodo Raíz (Planteamiento) se destaca fuertemente */
  .node-box.node-root {
    border: 2px solid #343a40;
    background-color: #ffffff;
  }
  .node-box.node-root .node-title {
    color: #000;
  }

  /* El indicador de Check */
  .status-indicator {
    background-color: var(--color-risk-none);
    color: #fff;
    font-size: 0.75rem;
    font-weight: bold;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .node-arrow {
    margin: 0.2rem 0;
  }
</style>