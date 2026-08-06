<!-- src/lib/components/wizard/Paso1_Diagnostico.svelte -->
<script>
  import { store } from '$state/store.svelte.js';
</script>

<div class="panel">
  <h2>Diagnóstico ético del proyecto</h2>
  <p style="color: var(--color-text-muted);">
    Responda a las siguientes preguntas para definir el nivel de riesgo de su investigación y la ruta de aval ético requerida.
  </p>

  <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
    
    <label class="checkbox-group">
      <input type="checkbox" bind:checked={store.diagnostico.esEstudiante} />
      <span class="checkbox-label">
        <strong>Perfil del investigador:</strong> ¿Usted es estudiante y requiere este aval para su proyecto de grado o investigación formativa?
      </span>
    </label>

    <label class="checkbox-group">
      <input type="checkbox" bind:checked={store.diagnostico.usaHumanos} />
      <span class="checkbox-label">
        <strong>Interacción con sujetos humanos:</strong> ¿Su proyecto incluye metodologías como entrevistas, grupos focales, etnografía, observación participante o co-creación con personas?
      </span>
    </label>

    <label class="checkbox-group">
      <input type="checkbox" bind:checked={store.diagnostico.usaMenores} />
      <span class="checkbox-label">
        <strong>Población vulnerable o menores:</strong> ¿La población de su estudio incluye a menores de 18 años o grupos en condiciones de vulnerabilidad manifiesta?
      </span>
    </label>

    <label class="checkbox-group">
      <input type="checkbox" bind:checked={store.diagnostico.temasSensibles} />
      <span class="checkbox-label">
        <strong>Temáticas sensibles:</strong> ¿Su exploración abordará memorias traumáticas, duelo, historias de violencia o dinámicas que puedan generar impacto emocional negativo en los participantes?
      </span>
    </label>

    <label class="checkbox-group">
      <!-- Se añade el evento onchange para forzar usaHumanos a true -->
      <input 
        type="checkbox" 
        bind:checked={store.diagnostico.recolectaDatosPersonales} 
        onchange={() => { if (store.diagnostico.recolectaDatosPersonales) store.diagnostico.usaHumanos = true; }}
      />
      <span class="checkbox-label">
        <strong>Recolección de datos personales:</strong> ¿Recolectará información que permita identificar a las personas (nombres reales, fotografías, voces en audio, ubicaciones precisas)?
      </span>
    </label>

    <label class="checkbox-group">
      <input type="checkbox" bind:checked={store.diagnostico.usaMaterialArchivo} />
      <span class="checkbox-label">
        <strong>Derechos de autor y archivo:</strong> ¿Su proyecto utilizará documentos, imágenes, repositorios, obras artísticas o material de archivo que requiera consideraciones o gestión de propiedad intelectual?
      </span>
    </label>

  </div>
</div>