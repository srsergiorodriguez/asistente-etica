<!-- src/App.svelte -->
<script>
  import { onMount } from 'svelte';

  import StackRutaVisual from '$components/visual/StackRutaVisual.svelte';
  import Diagnostico from '$components/wizard/Diagnostico.svelte';
  import Planteamiento from '$components/wizard/Planteamiento.svelte';
  import BorradorPlatypus from '$components/wizard/BorradorPlatypus.svelte';
  import Consentimiento from '$components/wizard/Consentimiento.svelte';
  import Asentimiento from '$components/wizard/Asentimiento.svelte';
  
  import AvalProfesor from '$components/wizard/AvalProfesor.svelte';
  import DerechosAutor from '$components/wizard/DerechosAutor.svelte';
  import PoliticaDatos from '$components/wizard/PoliticaDatos.svelte';
  
  import { store, inyectarDatosPrueba } from '$state/store.svelte.js';
  import { aiState, initAIEngine } from '$utils/ai-engine.svelte.js';

  // Estado local para controlar la visibilidad del modal global
  let mostrarModalIA = $state(false);

  // Función global para activar la IA
  function aceptarIA() {
    aiState.isActivated = true;
    mostrarModalIA = false;
    initAIEngine(); // Comienza la descarga en segundo plano
  }

  // Ejecución automática al montar la aplicación
  onMount(() => {
    // TODO: Comentar o eliminar esta línea antes de compilar para producción
    inyectarDatosPrueba();
  });
</script>

<div class="layout-app">
  <!-- ENCABEZADO GLOBAL -->
  <header class="header-app" style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <h1 style="margin: 0; font-size: 1.5rem;">Suite de ética de investigación - Artes y Humanidades</h1>
    </div>
    
    <!-- CONTROLES GLOBALES DE IA -->
    <div>
      {#if !aiState.isActivated}
        <button class="btn btn-secondary" onclick={() => mostrarModalIA = true}>
          Activar Asistente IA
        </button>
      {:else if aiState.isInitializing}
        <div style="display: flex; flex-direction: column; align-items: flex-end; font-size: 0.85rem; color: var(--color-text-muted);">
          <span>Preparando IA: {aiState.progressPercent}%</span>
          <div style="width: 150px; background-color: var(--color-border); height: 4px; border-radius: 2px; margin-top: 4px; overflow: hidden;">
            <div style="height: 100%; background-color: var(--color-primary); width: {aiState.progressPercent}%; transition: width 0.3s;"></div>
          </div>
        </div>
      {:else if aiState.isReady}
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-risk-none); background-color: rgba(32, 201, 151, 0.1); padding: 0.5rem 1rem; border-radius: 20px;">
          ✓ Asistente IA Listo
        </span>
      {/if}
    </div>
  </header>

  <main class="grid-tres-columnas">
    <section class="columna col-diagnostico">
      <Diagnostico />
    </section>

    <section class="columna col-stack">
      <StackRutaVisual />
    </section>

    <section class="columna col-editor">
      {#if store.documentoActivo === 'planteamiento'}
        <Planteamiento />
      {:else if store.documentoActivo === 'platypus'}
        <BorradorPlatypus />
      {:else if store.documentoActivo === 'aval'}
        <AvalProfesor />
      {:else if store.documentoActivo === 'consentimiento'}
        <Consentimiento />
      {:else if store.documentoActivo === 'asentimiento'}
        <Asentimiento />
      {:else if store.documentoActivo === 'derechosAutor'}
        <DerechosAutor />
      {:else if store.documentoActivo === 'politica'}
        <PoliticaDatos />
      {:else}
        <div class="panel" style="height: 100%;">
          <h2 style="color: var(--color-primary); border-bottom: 2px solid var(--color-border); padding-bottom: 0.5rem;">Área de Trabajo</h2>
          <p style="color: var(--color-text-muted);">El documento seleccionado ({store.documentoActivo}) aún está en construcción.</p>
        </div>
      {/if}
    </section>
  </main>

  <!-- MODAL GLOBAL DE ADVERTENCIA ÉTICA -->
  {#if mostrarModalIA}
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: #fff; padding: 2rem; border-radius: var(--radius-md); max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <h3 style="margin-top: 0; color: var(--color-text-main);">Asistencia de Redacción Inteligente</h3>
        <p style="font-size: 0.95rem; color: var(--color-text-muted);">
          Esta herramienta utiliza Inteligencia Artificial local para ayudarle a redactar los textos con el tono adecuado para el comité de ética.
        </p>
        <div style="background-color: rgba(232, 126, 20, 0.1); border-left: 3px solid var(--color-risk-high); padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.9rem;">
          <strong>Importante:</strong> Como cualquier modelo de lenguaje, la IA puede omitir información, alterar el sentido original o cometer errores de redacción. Por favor, <strong>revise y valide siempre</strong> el texto generado.
        </div>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">
          <strong>Privacidad total:</strong> Los datos nunca salen de su computador. Para lograr esto, su navegador descargará un motor de IA por única vez (aprox. 800 MB).
        </p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick={() => mostrarModalIA = false}>Cancelar</button>
          <button class="btn btn-primary" onclick={aceptarIA}>Entendido, activar IA</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Mantenga los mismos estilos que habíamos definido para el layout */
  .layout-app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .header-app {
    padding: 1rem 1.5rem;
    background-color: var(--color-bg-panel);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }
  .grid-tres-columnas {
    display: grid;
    grid-template-columns: 350px 240px 1fr;
    gap: .1rem;
    padding: 1rem 1rem;
    flex: 1;
    overflow: hidden; 
  }
  .columna {
    display: flex;
    flex-direction: column;
    overflow-y: auto; 
    padding-right: 0.5rem; 
  }
</style>