// src/lib/utils/exportador.js
import html2pdf from 'html2pdf.js';

export function copiarTexto(elementoId) {
  const elemento = document.getElementById(elementoId);
  if (!elemento) return;
  navigator.clipboard.writeText(elemento.innerText).then(() => {
    alert("Documento copiado al portapapeles.");
  });
}

export function exportarWord(elementoId, nombreBase) {
  const elemento = document.getElementById(elementoId);
  if (!elemento) return;

  const clon = elemento.cloneNode(true);

  // Inyección estricta de estilos en línea para Microsoft Word
  const todosLosNodos = clon.querySelectorAll('*');
  todosLosNodos.forEach(nodo => {
    // Tipografía base
    nodo.style.fontFamily = "Arial, sans-serif";
    nodo.style.fontSize = "11pt";
    nodo.style.lineHeight = "1.5";
    
    // Mapeo de nuestras clases CSS a estilos en línea puros
    if (nodo.classList.contains('doc-center')) {
      nodo.style.textAlign = 'center';
    }
    if (nodo.classList.contains('doc-bold')) {
      nodo.style.fontWeight = 'bold';
    }
    if (nodo.classList.contains('doc-title-main')) {
      nodo.style.textAlign = 'center';
      nodo.style.fontWeight = 'bold';
      nodo.style.marginBottom = '24pt';
    }
    if (nodo.classList.contains('doc-section-title')) {
      nodo.style.fontWeight = 'bold';
      nodo.style.marginTop = '12pt';
      nodo.style.marginBottom = '4pt';
    }
    if (nodo.classList.contains('doc-text-ai')) {
      nodo.style.textAlign = 'justify';
      nodo.style.marginBottom = '12pt';
      // Convertimos los saltos de línea (\n) a <br> porque Word ignora white-space
      nodo.innerHTML = nodo.innerHTML.replace(/\n/g, '<br>');
    }
    if (nodo.classList.contains('doc-sig-row')) {
      nodo.style.width = '100%';
      nodo.style.clear = 'both';
      nodo.style.marginBottom = '30pt';
    }
    if (nodo.classList.contains('doc-sig-box')) {
      nodo.style.width = '45%';
      nodo.style.float = 'left';
    }
    if (nodo.classList.contains('doc-sig-line')) {
      nodo.style.borderTop = '1px solid black';
      nodo.style.paddingTop = '6pt';
      nodo.style.fontWeight = 'bold';
      // Inyectamos saltos de línea físicos porque Word ignora el margin-top aquí
      nodo.insertAdjacentHTML('beforebegin', '<br><br><br><br>');
    }
  });

  const docHTML = clon.innerHTML;
  
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${nombreBase}</title>
    </head>
    <body>
  `;
  const footer = "</body></html>";
  
  const blob = new Blob(['\ufeff', header + docHTML + footer], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  
  const nombreLimpio = nombreBase ? nombreBase.replace(/\s+/g, '_') : 'Documento_Etica';
  enlace.download = `${nombreLimpio}.doc`;
  
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

export function exportarPDF(elementoId, nombreBase) {
  const elemento = document.getElementById(elementoId);
  if (!elemento) return;

  const nombreLimpio = nombreBase ? nombreBase.replace(/\s+/g, '_') : 'Documento_Etica';

  const opciones = {
    margin:       15, // Márgenes en milímetros
    filename:     `${nombreLimpio}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opciones).from(elemento).save();
}