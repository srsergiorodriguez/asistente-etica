// src/lib/utils/ai-engine.svelte.js
import { CreateMLCEngine } from '@mlc-ai/web-llm';

let engine = null;

export const aiState = $state({
  isInitializing: false,
  isReady: false,
  isActivated: false,
  progressText: "Iniciando motor local...",
  progressPercent: 0
});

export async function initAIEngine() {
  if (engine || aiState.isInitializing) return;
  
  aiState.isInitializing = true;
  try {
    const selectedModel = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
    const engineConfig = {
      initProgressCallback: (progress) => {
        aiState.progressText = progress.text;
        aiState.progressPercent = Math.round((progress.progress || 0) * 100);
      }
    };
    const chatOpts = { context_window_size: 2048 };

    engine = await CreateMLCEngine(selectedModel, engineConfig, chatOpts);
    
    aiState.isReady = true;
    aiState.progressText = "IA lista y cargada en memoria.";
  } catch (error) {
    console.error("Error al cargar WebLLM:", error);
    aiState.progressText = "Error al cargar el modelo. Revise la consola.";
  } finally {
    aiState.isInitializing = false;
  }
}

// Generador con streaming inyectable
export async function generarConIA(promptSistema, promptUsuario, onChunk) {
  if (!aiState.isReady || !engine) {
    throw new Error("El motor de IA no está inicializado o no está listo.");
  }

  const chunks = await engine.chat.completions.create({
    messages: [
      { role: "system", content: promptSistema },
      { role: "user", content: promptUsuario }
    ],
    temperature: 0.2, // Temperatura baja para asegurar la estructura JSON
    stream: true,
  });

  let textoAcumulado = "";
  for await (const chunk of chunks) {
    const texto = chunk.choices[0]?.delta?.content || "";
    textoAcumulado += texto;
    if (onChunk) onChunk(textoAcumulado);
  }
  
  return textoAcumulado;
}