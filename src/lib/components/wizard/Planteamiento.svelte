<!-- src/lib/components/wizard/Planteamiento.svelte -->
<script>
  import { store } from '$state/store.svelte.js';
  import { onMount } from 'svelte';
  
  import { 
    plantillasEnfoque, plantillasMetodos, plantillasFases, 
    plantillasAlmacenamiento, plantillasRetencion, 
    plantillasAcceso, plantillasContencion 
  } from '$data/plantillas.js';

  onMount(() => {
    if (!store.proyectoCore.muestrasBiologicas) {
      store.proyectoCore.muestrasBiologicas = "El proyecto, debido a que se desarrolla en el marco de las prácticas de las artes y las humanidades, no corresponde a una investigación en ciencias naturales y no contempla la toma de muestras biológicas de ningún tipo.";
    }

    if (!store.diagnostico.temasSensibles && !store.diagnostico.usaHumanos && !store.diagnostico.usaMenores) {
      if (!store.proyectoCore.contencionEmocional) {
        const plantillaNula = plantillasContencion.find(p => p.id === 'sin-riesgo-archivo');
        if (plantillaNula) store.proyectoCore.contencionEmocional = plantillaNula.texto;
      }
    }
  });

  // Función simplificada: sin alertas, reemplazo instantáneo para exploración rápida
  function aplicarPlantilla(campoStore, evento, listaPlantillas) {
    const idSeleccionado = evento.target.value;
    if (!idSeleccionado) return;
    
    const plantilla = listaPlantillas.find(p => p.id === idSeleccionado);
    if (plantilla) {
      store.proyectoCore[campoStore] = plantilla.texto;
    }
    evento.target.value = ""; // Resetea para permitir clics repetidos
  }
</script>

<div class="panel">
  <h2 style="margin-bottom: 0.5rem;">Planteamiento general del proyecto</h2>
  <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
    Esta información servirá como base unificada para generar los documentos requeridos por el comité de ética.
  </p>

  <!-- TARJETA 1: IDENTIDAD -->
  <div class="card">
    <h3 class="card-title">Identidad y objetivos</h3>
    
    <div class="input-group">
      <label class="input-label">Título del proyecto</label>
      <input type="text" class="input-field" bind:value={store.proyectoCore.titulo} placeholder="Ej. Etnografía de los mundos del arte contemporáneo" />
    </div>

    <!-- El label cambia dinámicamente según el diagnóstico -->
    <div class="input-group" style="margin-top: 1rem;">
      <label class="input-label">{store.diagnostico.esEstudiante ? 'Nombre del estudiante (Investigador principal)' : 'Investigador principal y datos de contacto'}</label>
      {#if !store.diagnostico.esEstudiante}
        <div class="hint-institucional" style="margin-bottom: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
          Indique quién lidera el proyecto, sus correos institucionales, y a quién deben dirigirse los participantes.
        </div>
      {/if}
      <input type="text" class="input-field" bind:value={store.proyectoCore.investigadorPrincipal} placeholder={store.diagnostico.esEstudiante ? "Ej. Nombre del estudiante" : "Ej. Prof. P. Pérez (ppp@uniandes.edu.co)"} />
    </div>

    {#if store.diagnostico.esEstudiante}
      <div class="input-group" style="margin-top: 1rem;">
        <label class="input-label">Profesor tutor o coordinador</label>
        <div class="hint-institucional" style="margin-bottom: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
          Indique el nombre de la persona que avala el documento para el comité.
        </div>
        <input type="text" class="input-field" bind:value={store.proyectoCore.nombreTutor} placeholder="Ej. Prof. Camilo Martínez o María José Afanador Llach" />
      </div>
    {/if}

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
      <div class="input-group">
        <label class="input-label">Acción u objeto (Qué)</label>
        <textarea class="input-field" bind:value={store.proyectoCore.accionObjeto} placeholder="Ej. Explorar dinámicas artísticas en..." rows="3"></textarea>
      </div>
      <div class="input-group">
        <label class="input-label">Medio (Cómo)</label>
        <textarea class="input-field" bind:value={store.proyectoCore.medio} placeholder="Ej. Mediante entrevistas a curadores..." rows="3"></textarea>
      </div>
      <div class="input-group">
        <label class="input-label">Finalidad (Para qué)</label>
        <textarea class="input-field" bind:value={store.proyectoCore.finalidad} placeholder="Ej. Entender el mercado local..." rows="3"></textarea>
      </div>
    </div>
  </div>

  <!-- TARJETA 2: METODOLOGÍA -->
  <div class="card">
    <h3 class="card-title">Arquitectura metodológica</h3>
    
    <div class="hint-institucional">
      El comité evalúa el rigor a través de un orden secuencial. Aunque en la investigación-creación o el trabajo de campo el proceso sea iterativo, es necesario plantear etapas concretas (ej. indagación material, desarrollo de obra, exposición).
    </div>

    <div class="input-group">
      <div class="template-header">
        <label class="input-label">Enfoque general</label>
        <select class="template-select" onchange={(e) => aplicarPlantilla('enfoqueYFases', e, plantillasEnfoque)}>
          <option value="">Explorar borradores sugeridos...</option>
          {#each plantillasEnfoque as p} <option value={p.id}>{p.titulo}</option> {/each}
        </select>
      </div>
      <textarea class="input-field" bind:value={store.proyectoCore.enfoqueYFases} placeholder="Describa el paradigma cualitativo, creativo o hermenéutico..."></textarea>
    </div>

    <div class="input-group">
      <div class="template-header">
        <label class="input-label">Métodos específicos</label>
        <select class="template-select" onchange={(e) => aplicarPlantilla('metodosRecoleccion', e, plantillasMetodos)}>
          <option value="">Explorar borradores sugeridos...</option>
          {#each plantillasMetodos as p} <option value={p.id}>{p.titulo}</option> {/each}
        </select>
      </div>
      <textarea class="input-field" bind:value={store.proyectoCore.metodosRecoleccion}></textarea>
    </div>

    <div class="input-group">
      <div class="template-header">
        <label class="input-label">Fases del estudio</label>
        <select class="template-select" onchange={(e) => aplicarPlantilla('fasesEstudio', e, plantillasFases)}>
          <option value="">Explorar borradores sugeridos...</option>
          {#each plantillasFases as p} <option value={p.id}>{p.titulo}</option> {/each}
        </select>
      </div>
      <textarea class="input-field" bind:value={store.proyectoCore.fasesEstudio}></textarea>
    </div>
  </div>

  <!-- TARJETA 3: DATOS Y CUIDADO -->
  <div class="card">
    <h3 class="card-title">Datos, privacidad y cuidado</h3>
    
    <div class="hint-institucional">
      En los formularios de ética, un dato no es solo información numérica. Una libreta de campo, un boceto original, un registro sonoro o una bitácora audiovisual son "datos" que deben protegerse y almacenarse de forma segura.
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div class="input-group">
        <div class="template-header">
          <label class="input-label">Almacenamiento</label>
          <select class="template-select" onchange={(e) => aplicarPlantilla('almacenamiento', e, plantillasAlmacenamiento)}>
            <option value="">Explorar...</option>
            {#each plantillasAlmacenamiento as p} <option value={p.id}>{p.titulo}</option> {/each}
          </select>
        </div>
        <textarea class="input-field" bind:value={store.proyectoCore.almacenamiento}></textarea>
      </div>

      <div class="input-group">
        <div class="template-header">
          <label class="input-label">Tiempo de retención</label>
          <select class="template-select" onchange={(e) => aplicarPlantilla('retencion', e, plantillasRetencion)}>
            <option value="">Explorar...</option>
            {#each plantillasRetencion as p} <option value={p.id}>{p.titulo}</option> {/each}
          </select>
        </div>
        <!-- HINT ACTUALIZADO -->
        <div class="hint-institucional" style="margin-bottom: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.75rem;">
          En ciencias clínicas los datos se destruyen rápido. En humanidades, suele aplicarse el mandato del "public scholarship" (hacer público el conocimiento a largo plazo). Defina si el archivo será patrimonio o si se destruirá.
        </div>
        <textarea class="input-field" bind:value={store.proyectoCore.retencion}></textarea>
      </div>
    </div>

    <div class="input-group">
      <div class="template-header">
        <label class="input-label">Acceso y privacidad (Habeas Data)</label>
        <select class="template-select" onchange={(e) => aplicarPlantilla('accesoPrivacidad', e, plantillasAcceso)}>
          <option value="">Explorar borradores sugeridos...</option>
          {#each plantillasAcceso as p} <option value={p.id}>{p.titulo}</option> {/each}
        </select>
      </div>
      <textarea class="input-field" bind:value={store.proyectoCore.accesoPrivacidad}></textarea>
    </div>

    <div class="input-group">
      <div class="template-header">
        <label class="input-label">Contención emocional</label>
        <select class="template-select" onchange={(e) => aplicarPlantilla('contencionEmocional', e, plantillasContencion)}>
          <option value="">Explorar borradores sugeridos...</option>
          {#each plantillasContencion as p} <option value={p.id}>{p.titulo}</option> {/each}
        </select>
      </div>
      <div class="hint-institucional" style="margin-bottom: 0.5rem; border-left-color: var(--color-risk-min); font-size: 0.8rem; padding: 0.5rem;">
        Si una entrevista o taller puede generar fatiga, tensión intelectual o incomodidad, explique quién es el responsable de brindar apoyo empático o hacer una pausa (ej. el propio investigador, un par, o la decanatura). Además, el comité necesita saber si los temas abordados (duelo, memoria, conflicto) podrían vulnerar a los participantes o al propio investigador, y cómo se actuaría ante una crisis, incluso si el proyecto es enteramente artístico.
      </div>
      <textarea class="input-field" bind:value={store.proyectoCore.contencionEmocional}></textarea>
      {#if !store.diagnostico.temasSensibles && !store.diagnostico.usaHumanos}
        <small style="color: var(--color-risk-none); margin-top: 0.25rem;">
          Autocompletado basado en su diagnóstico de bajo riesgo.
        </small>
      {/if}
    </div>
  </div>

  <!-- TARJETA 4: EXENCIÓN -->
  <div class="card" style="background-color: var(--color-bg-app); border-color: transparent;">
    <h3 class="card-title" style="color: var(--color-text-muted); border-bottom: none; margin-bottom: 0;">Muestras biológicas</h3>
    <div class="hint-institucional" style="border-left-color: var(--color-text-muted); margin-bottom: 0.5rem; background-color: #fff;">
      Las plataformas del comité suelen exigir este campo por defecto. Se ha prellenado una respuesta estándar de exención institucional para disciplinas humanísticas.
    </div>
    <textarea class="input-field" bind:value={store.proyectoCore.muestrasBiologicas} rows="2" style="background-color: #fff;"></textarea>
  </div>

</div>