# VideoDrop

Uma página estática para baixar arquivos de vídeo de URLs diretas públicas, quando a pessoa tem autorização para salvá-los.

## Limites

- Funciona para URLs diretas de arquivos, como `.mp4` e `.webm`, que aceitem requisições CORS.
- Não baixa vídeos de YouTube, plataformas de streaming ou URLs protegidas por DRM/login. A ferramenta não tenta contornar proteções ou termos das plataformas.
- O arquivo é obtido pelo navegador do visitante; a aplicação não armazena links nem vídeos.

## Publicação

O projeto é puramente estático e pode ser publicado na Vercel sem etapa de build.
