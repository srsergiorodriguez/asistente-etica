<!-- src/App.svelte -->
<script>
  // Componentes del flujo (Wizard)
  import StackRutaVisual from '$components/visual/StackRutaVisual.svelte';
  import Diagnostico from '$components/wizard/Diagnostico.svelte';
  import Planteamiento from '$components/wizard/Planteamiento.svelte';
  import BorradorPlatypus from '$components/wizard/BorradorPlatypus.svelte';
  import Consentimiento from '$components/wizard/Consentimiento.svelte';
  import ConsentimientoPadres from '$components/wizard/ConsentimientoPadres.svelte';
  import Asentimiento from '$components/wizard/Asentimiento.svelte';
  import AvalProfesor from '$components/wizard/AvalProfesor.svelte';
  import DerechosAutor from '$components/wizard/DerechosAutor.svelte';
  import PoliticaDatos from '$components/wizard/PoliticaDatos.svelte';

  // Componentes de interfaz de usuario (Modales)
  import Glosario from '$components/ui/Glosario.svelte';
  import Instrucciones from '$components/ui/Instrucciones.svelte';
  import ModalAdvertenciaIA from '$components/ui/ModalAdvertenciaIA.svelte';
  
  // Estado global y utilidades
  import { store, inyectarDatosPrueba } from '$state/store.svelte.js';
  import { aiState, initAIEngine } from '$utils/ai-engine.svelte.js';
  import { guardarProyectoLocal, cargarProyectoLocal } from '$utils/persistencia.js';

  // Control de visibilidad de modales globales
  let mostrarModalIA = $state(false);
  let mostrarGlosario = $state(false);
  let mostrarInstrucciones = $state(false);

  // Inicialización del motor de IA
  function aceptarIA() {
    aiState.isActivated = true;
    mostrarModalIA = false;
    initAIEngine();
  }
</script>

<div class="layout-app">
  
  <!-- ENCABEZADO GLOBAL -->
  <header class="header-app">
    <div class="header-titles">
      <h1>Suite de ética de investigación - Artes y Humanidades</h1>
    </div>
    
    <!-- CONTROLES GLOBALES Y HERRAMIENTAS -->
    <div class="header-actions">
      
      <!-- Botón de pruebas (Eliminar antes de producción) -->
      <button class="btn btn-secondary" style="background-color: #f1f5f9; color: #475569; border-color: #cbd5e1;" onclick={inyectarDatosPrueba} title="Llenar datos de prueba">
        Test
      </button>

      <!-- Controles de guardado y carga -->
      <div style="display: flex; gap: 0.5rem; border-right: 1px solid var(--color-border); border-left: 1px solid var(--color-border); padding: 0 1rem; margin: 0 0.5rem;">
        <button class="btn btn-secondary" onclick={guardarProyectoLocal} title="Guardar proyecto en su computador">
          Guardar
        </button>
        
        <label class="btn btn-secondary" style="cursor: pointer; margin: 0;" title="Cargar un proyecto guardado">
          Cargar
          <input type="file" accept=".json" onchange={cargarProyectoLocal} style="display: none;" />
        </label>
      </div>

      <!-- NUEVO: Botón renombrado para la ayuda del software -->
      <button class="btn btn-secondary" onclick={() => mostrarInstrucciones = true}>
        Instrucciones rápidas
      </button>

      <!-- NUEVO: Enlace de descarga directa del documento de la coordinadora -->
      <!-- Se usa ruta relativa para que funcione correctamente en GitHub Pages -->
      <a href="GuiaSolicitudAvalEtico.pdf" target="_blank" download="GuiaSolicitudAvalEtico.pdf" class="btn btn-secondary" style="text-decoration: none;">
        Guía institucional (PDF)
      </a>

      <button class="btn btn-secondary" onclick={() => mostrarGlosario = true}>
        Glosario
      </button>

      <!-- ESTADO Y ACTIVACIÓN DE IA -->
      {#if !aiState.isActivated}
        <button class="btn btn-secondary" onclick={() => mostrarModalIA = true}>
          Activar IA
        </button>
      {:else if aiState.isInitializing}
        <div class="ai-progress-container">
          <span>Preparando IA: {aiState.progressPercent}%</span>
          <div class="ai-progress-bar-bg">
            <div class="ai-progress-bar-fill" style="width: {aiState.progressPercent}%;"></div>
          </div>
        </div>
      {:else if aiState.isReady}
        <span class="ai-ready-badge">
          ✓ Asistente IA Listo
        </span>
      {/if}
    </div>
  </header>

  <!-- ÁREA DE TRABAJO PRINCIPAL -->
  <main class="grid-tres-columnas">
    
    <!-- Columna 1: Cuestionario inicial y condicionales -->
    <section class="columna col-diagnostico">
      <Diagnostico />
    </section>

    <!-- Columna 2: Mapa arquitectónico de documentos requeridos -->
    <section class="columna col-stack">
      <StackRutaVisual />
    </section>

    <!-- Columna 3: Editor dinámico según selección del usuario -->
    <section class="columna col-editor">
      {#if store.documentoActivo === 'planteamiento'}
        <Planteamiento />
      {:else if store.documentoActivo === 'platypus'}
        <BorradorPlatypus />
      {:else if store.documentoActivo === 'aval'}
        <AvalProfesor />
      {:else if store.documentoActivo === 'consentimiento'}
        <Consentimiento />
      {:else if store.documentoActivo === 'consentimientoPadres'}
        <ConsentimientoPadres />
      {:else if store.documentoActivo === 'asentimiento'}
        <Asentimiento />
      {:else if store.documentoActivo === 'derechosAutor'}
        <DerechosAutor />
      {:else if store.documentoActivo === 'politica'}
        <PoliticaDatos />
      {:else}
        <div class="panel empty-workspace">
          <h2>Área de Trabajo</h2>
          <p>El documento seleccionado ({store.documentoActivo}) aún está en construcción.</p>
        </div>
      {/if}
    </section>
  </main>

  <!-- MODALES SUPERPUESTOS -->
  {#if mostrarModalIA}
    <ModalAdvertenciaIA 
      onCancelar={() => mostrarModalIA = false} 
      onAceptar={aceptarIA} 
    />
  {/if}

  {#if mostrarGlosario}
    <Glosario cerrarGlosario={() => mostrarGlosario = false} />
  {/if}

  {#if mostrarInstrucciones}
    <Instrucciones cerrarGuia={() => mostrarInstrucciones = false} />
  {/if}
</div>

<style>
  /* Layout Base */
  .layout-app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  /* Encabezado */
  .header-app {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: var(--color-bg-panel);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }
  .header-titles h1 {
    margin: 0; 
    font-size: 1.5rem;
  }
  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  /* Grilla principal */
  .grid-tres-columnas {
    display: grid;
    grid-template-columns: 350px 240px 1fr;
    gap: 1rem;
    padding: 1rem;
    flex: 1;
    overflow: hidden; 
  }
  .columna {
    display: flex;
    flex-direction: column;
    overflow-y: auto; 
    padding-right: 0.5rem; 
  }

  /* Elementos específicos de IA y empty states */
  .ai-progress-container {
    display: flex; 
    flex-direction: column; 
    align-items: flex-end; 
    font-size: 0.85rem; 
    color: var(--color-text-muted);
  }
  .ai-progress-bar-bg {
    width: 150px; 
    background-color: var(--color-border); 
    height: 4px; 
    border-radius: 2px; 
    margin-top: 4px; 
    overflow: hidden;
  }
  .ai-progress-bar-fill {
    height: 100%; 
    background-color: var(--color-primary); 
    transition: width 0.3s;
  }
  .ai-ready-badge {
    font-size: 0.85rem; 
    font-weight: 600; 
    color: var(--color-risk-none); 
    background-color: rgba(32, 201, 151, 0.1); 
    padding: 0.5rem 1rem; 
    border-radius: 20px;
  }
  
  .empty-workspace {
    height: 100%;
  }
  .empty-workspace h2 {
    color: var(--color-primary); 
    border-bottom: 2px solid var(--color-border); 
    padding-bottom: 0.5rem;
  }
  .empty-workspace p {
    color: var(--color-text-muted);
  }
</style>