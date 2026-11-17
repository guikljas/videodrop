const form = document.querySelector('#download-form');
const input = document.querySelector('#video-url');
const button = document.querySelector('#download-button');
const status = document.querySelector('#status');

function setStatus(message, kind = '') {
  status.textContent = message;
  status.className = `status ${kind}`;
}

function filenameFrom(response, url) {
  const disposition = response.headers.get('content-disposition') || '';
  const named = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
  if (named) return decodeURIComponent(named[1]).replace(/[\\/:*?"<>|]/g, '_');
  const path = new URL(url).pathname.split('/').pop();
  return path && path.includes('.') ? path : 'video-download';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  let url;
  try { url = new URL(input.value.trim()); } catch { setStatus('Informe uma URL válida que comece com http:// ou https://.', 'error'); return; }
  if (!['http:', 'https:'].includes(url.protocol)) { setStatus('Use somente links http ou https.', 'error'); return; }

  button.disabled = true;
  setStatus('Conectando ao servidor do vídeo…');
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`O servidor retornou ${response.status}.`);
    const type = response.headers.get('content-type') || '';
    if (type && !type.startsWith('video/') && !type.includes('octet-stream')) throw new Error('Este link não informou um arquivo de vídeo.');
    setStatus('Preparando seu download…');
    const blob = await response.blob();
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filenameFrom(response, url.href);
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(anchor.href);
    setStatus('Download iniciado. Confira sua pasta de downloads.', 'success');
  } catch (error) {
    const corsHint = error instanceof TypeError ? ' O servidor pode estar bloqueando downloads pelo navegador (CORS).' : '';
    setStatus(`Não foi possível baixar esse link. ${error.message || ''}${corsHint}`, 'error');
  } finally { button.disabled = false; }
});
