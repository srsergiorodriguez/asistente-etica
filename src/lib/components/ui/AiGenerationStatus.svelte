<!-- src/lib/components/ui/AiGenerationStatus.svelte -->
<script>
  let { isGenerating, textoEnBruto, errorMsg } = $props();
</script>

{#if isGenerating}
  <div class="ai-stream-container">
    <div class="ai-stream-header">
      <div class="spinner"></div>
      <strong class="ai-stream-title">Redactando borrador en tiempo real...</strong>
    </div>
    <pre class="ai-stream-box">{textoEnBruto}</pre>
  </div>
{/if}

{#if errorMsg}
  <div class="error-banner">
    {errorMsg}
  </div>
{/if}