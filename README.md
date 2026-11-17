# VideoDrop Local

Uma ferramenta local para baixar vídeos do YouTube que você criou, que estejam sob licença Creative Commons ou para os quais você tenha autorização explícita.

## Executar no Windows

1. Instale Python 3.11 ou superior.
2. Dê dois cliques em `start.bat` (ou execute `py -m pip install -r requirements.txt` e depois `py -m uvicorn local_app:app --host 127.0.0.1 --port 8787`).
3. Abra `http://127.0.0.1:8787` no navegador.
4. Cole o link, escolha vídeo ou áudio e aguarde. O arquivo ficará em `downloads/`.

## Limites e responsabilidade

- O serviço roda em `127.0.0.1`; nenhum vídeo, URL ou arquivo passa por um servidor da aplicação.
- Aceita somente URLs `youtube.com` e `youtu.be` e não usa login, cookies ou DRM.
- Não use para conteúdo protegido sem autorização. Para seus próprios vídeos, o download pelo YouTube Studio é a opção oficial.

## Página pública

A página da Vercel é apenas uma demonstração estática. A parte de YouTube exige a execução local, pois downloads não são processados pela hospedagem pública.
