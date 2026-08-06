<!-- src/lib/components/ui/DocumentToolbar.svelte -->
<script>
  let { 
    titulo, 
    subtitulo, 
    isAiActivated, 
    isAiReady, 
    isGenerating, 
    onGenerarIA, 
    onCopiar, 
    onWord, 
    onPdf 
  } = $props();
</script>

<div class="doc-toolbar">
  <div class="doc-toolbar-titles">
    <h2 class="doc-toolbar-title">{titulo}</h2>
    <p class="doc-toolbar-subtitle">{subtitulo}</p>
  </div>

  <div class="doc-toolbar-actions">
    {#if isAiActivated}
      <button class="btn btn-primary" onclick={onGenerarIA} disabled={isGenerating || !isAiReady}>
        {isGenerating ? 'Generando...' : (!isAiReady ? 'Cargando modelo...' : 'Autocompletar con IA')}
      </button>
    {/if}
    <button class="btn btn-secondary" onclick={onCopiar}>Copiar texto</button>
    <button class="btn btn-secondary" onclick={onWord}>Exportar a Word</button>
    <button class="btn btn-secondary" onclick={onPdf}>Guardar en PDF</button>
  </div>
</div>