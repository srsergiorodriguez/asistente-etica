<!-- src/lib/components/wizard/BorradorPlatypus.svelte -->
<script>
  import { store } from '$state/store.svelte.js';

  // Ensamblaje dinámico de los campos de Platypus
  let descPlatypus = $derived(
    `${store.proyectoCore.enfoqueYFases}\n\n${store.proyectoCore.metodosRecoleccion}\n\n${store.proyectoCore.fasesEstudio}`.trim()
  );

  let objPlatypus = $derived(
    `${store.proyectoCore.accionObjeto} ${store.proyectoCore.medio} ${store.proyectoCore.finalidad}`.trim()
  );

  let datosPlatypus = $derived(
    `Almacenamiento: ${store.proyectoCore.almacenamiento}\n\nRetención: ${store.proyectoCore.retencion}\n\nAcceso: ${store.proyectoCore.accesoPrivacidad}`.trim()
  );

  function copiarTexto(texto) {
    if (!texto) return;
    navigator.clipboard.writeText(texto).then(() => {
      // Aquí podríamos usar un toast notification más adelante, por ahora un alert sutil
      alert("Texto copiado al portapapeles.");
    });
  }
</script>

<div class="panel">
  <h2 style="margin-bottom: 0.5rem;">Borrador para la Plataforma Platypus</h2>
  <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
    Estos textos han sido ensamblados a partir de su Planteamiento General. Copie y pegue cada bloque en los campos correspondientes de Platypus.
  </p>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      <h3 class="card-title" style="border: none; padding: 0; margin: 0;">Descripción del proyecto</h3>
      <button class="btn btn-secondary" onclick={() => copiarTexto(descPlatypus)}>📋 Copiar</button>
    </div>
    <div style="background-color: var(--color-bg-app); padding: 1rem; border-radius: var(--radius-sm); white-space: pre-wrap; font-size: 0.95rem;">
      {descPlatypus || "[Debe llenar la metodología en el Planteamiento General]"}
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      <h3 class="card-title" style="border: none; padding: 0; margin: 0;">Objetivo general de la propuesta</h3>
      <button class="btn btn-secondary" onclick={() => copiarTexto(objPlatypus)}>📋 Copiar</button>
    </div>
    <div style="background-color: var(--color-bg-app); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.95rem;">
      {objPlatypus || "[Debe llenar la Identidad en el Planteamiento General]"}
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      <h3 class="card-title" style="border: none; padding: 0; margin: 0;">Protocolo de manejo de datos</h3>
      <button class="btn btn-secondary" onclick={() => copiarTexto(datosPlatypus)}>📋 Copiar</button>
    </div>
    <div style="background-color: var(--color-bg-app); padding: 1rem; border-radius: var(--radius-sm); white-space: pre-wrap; font-size: 0.95rem;">
      {datosPlatypus || "[Debe llenar la sección de Datos en el Planteamiento General]"}
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      <h3 class="card-title" style="border: none; padding: 0; margin: 0;">Contención emocional</h3>
      <button class="btn btn-secondary" onclick={() => copiarTexto(store.proyectoCore.contencionEmocional)}>📋 Copiar</button>
    </div>
    <div style="background-color: var(--color-bg-app); padding: 1rem; border-radius: var(--radius-sm); white-space: pre-wrap; font-size: 0.95rem;">
      {store.proyectoCore.contencionEmocional || "No aplica para este proyecto."}
    </div>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      <h3 class="card-title" style="border: none; padding: 0; margin: 0;">Toma de muestras biológicas</h3>
      <button class="btn btn-secondary" onclick={() => copiarTexto(store.proyectoCore.muestrasBiologicas)}>📋 Copiar</button>
    </div>
    <div style="background-color: var(--color-bg-app); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.95rem;">
      {store.proyectoCore.muestrasBiologicas}
    </div>
  </div>
</div>