const form = document.querySelector('#download-form');
const input = document.querySelector('#video-url');
const button = document.querySelector('#download-button');
const status = document.querySelector('#status');

function setStatus(message, kind = '') { status.textContent = message; status.className = `status ${kind}`; }

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const format = document.querySelector('input[name="format"]:checked').value;
  button.disabled = true;
  setStatus('Obtendo o arquivo no seu computador. Isso pode levar alguns minutos…');
  try {
    const response = await fetch('/api/download', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({url: input.value.trim(), format}) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Falha ao baixar.');
    setStatus(`${result.message} Arquivo: ${result.file}`, 'success');
  } catch (error) { setStatus(error.message, 'error'); }
  finally { button.disabled = false; }
});
