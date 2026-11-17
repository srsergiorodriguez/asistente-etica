<!-- src/lib/components/ui/Glosario.svelte -->
<script>
  import { onMount } from 'svelte';
  let { cerrarGlosario } = $props();

  let terminos = $state([]);
  let busqueda = $state("");
  let cargando = $state(true);

  // Carga y procesamiento del archivo CSV estático
  async function cargarGlosario() {
    try {
      const response = await fetch('./glosario.csv');
      const text = await response.text();
      
      const lineas = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      terminos = lineas.slice(1).map(linea => {
        const [concepto, definicion, ejemplo] = linea.split(';');
        return { concepto, definicion, ejemplo };
      });
    } catch (error) {
      console.error("Error cargando el glosario:", error);
    } finally {
      cargando = false;
    }
  }

  // Filtrado reactivo en tiempo real
  let terminosFiltrados = $derived(
    terminos.filter(t => 
      t.concepto?.toLowerCase().includes(busqueda.toLowerCase()) || 
      t.definicion?.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  onMount(cargarGlosario);
</script>

<div class="modal-overlay">
  <!-- Utilizamos una variable de estilo en línea mínima solo para ajustar el ancho de este modal en particular -->
  <div class="modal-content" style="max-width: 700px;">
    
    <div class="modal-header">
      <h3 class="modal-title">Glosario de ética</h3>
      <button class="btn btn-secondary" onclick={cerrarGlosario}>Cerrar</button>
    </div>

    <div class="search-container">
      <input 
        type="text" 
        class="input-field" 
        placeholder="Buscar un concepto (ej. Riesgo, Anonimato)..." 
        bind:value={busqueda}
      />
    </div>

    <div class="modal-body">
      {#if cargando}
        <p class="estado-mensaje">Cargando conceptos...</p>
      {:else if terminosFiltrados.length === 0}
        <p class="estado-mensaje">No se encontraron términos para "{busqueda}".</p>
      {:else}
        {#each terminosFiltrados as termino}
          <div class="termino-tarjeta">
            <h4 class="termino-titulo">{termino.concepto}</h4>
            <p class="termino-definicion">{termino.definicion}</p>
            
            <div class="termino-ejemplo">
              <strong>EJEMPLO PRÁCTICO:</strong>
              <span>"{termino.ejemplo}"</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>

  </div>
</div>

<style>
  /* --- Ajustes específicos del Glosario --- */
  
  .modal-title {
    margin: 0; 
    color: var(--color-text-main); 
    font-size: 1.25rem;
  }

  .search-container {
    margin-bottom: 1.5rem;
  }

  .estado-mensaje {
    text-align: center; 
    color: var(--color-text-muted);
  }

  /* --- Tarjetas de Conceptos --- */
  .termino-tarjeta {
    background: var(--color-bg-app); 
    border: 1px solid var(--color-border); 
    border-radius: var(--radius-sm); 
    padding: 1.2rem; 
    margin-bottom: 1rem;
  }

  .termino-titulo {
    margin-top: 0; 
    color: #000; 
    font-size: 1.1rem; 
    border-bottom: 2px solid var(--color-primary); 
    display: inline-block; 
    padding-bottom: 0.2rem;
    margin-bottom: 0.8rem;
  }

  .termino-definicion {
    font-size: 0.95rem; 
    line-height: 1.5; 
    color: var(--color-text-main); 
    margin-top: 0;
    margin-bottom: 0.8rem;
  }

  .termino-ejemplo {
    background: rgba(255, 193, 7, 0.1); 
    padding: 0.8rem; 
    border-radius: var(--radius-sm); 
    border-left: 3px solid var(--color-primary);
  }

  .termino-ejemplo strong {
    font-size: 0.85rem; 
    color: var(--color-text-muted); 
    display: block; 
    margin-bottom: 0.3rem;
  }

  .termino-ejemplo span {
    font-size: 0.9rem; 
    font-style: italic; 
    color: var(--color-text-main);
  }
</style>