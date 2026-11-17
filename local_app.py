from __future__ import annotations

from pathlib import Path
from typing import Literal
from urllib.parse import urlparse

import imageio_ffmpeg
import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent
LOCAL_UI = ROOT / "local"
DOWNLOADS = ROOT / "downloads"

app = FastAPI(title="VideoDrop Local")
app.mount("/assets", StaticFiles(directory=LOCAL_UI), name="assets")


class DownloadRequest(BaseModel):
    url: str
    format: Literal["video", "audio"] = "video"


def is_youtube_url(value: str) -> bool:
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower()
    return parsed.scheme in {"http", "https"} and (
        host == "youtu.be" or host == "youtube.com" or host.endswith(".youtube.com")
    )


@app.get("/", response_class=FileResponse)
def homepage() -> FileResponse:
    return FileResponse(LOCAL_UI / "index.html")


@app.post("/api/download")
def download_video(request: DownloadRequest) -> dict[str, str]:
    if not is_youtube_url(request.url):
        raise HTTPException(status_code=400, detail="Informe um link válido do YouTube.")

    DOWNLOADS.mkdir(exist_ok=True)
    ydl_options = {
        "noplaylist": True,
        "restrictfilenames": True,
        "paths": {"home": str(DOWNLOADS)},
        "outtmpl": "%(title).180B [%(id)s].%(ext)s",
        "quiet": True,
        "no_warnings": True,
        # imageio-ffmpeg fornece o executável necessário para combinar as faixas.
        "ffmpeg_location": imageio_ffmpeg.get_ffmpeg_exe(),
    }
    if request.format == "audio":
        ydl_options["format"] = "bestaudio/best"
    else:
        # O YouTube frequentemente entrega vídeo e áudio em arquivos separados.
        # Esta ordem prefere MP4/M4A e depois usa qualquer combinação disponível.
        ydl_options["format"] = "bv*[ext=mp4]+ba[ext=m4a]/bv*+ba/b"
        ydl_options["merge_output_format"] = "mp4"

    try:
        with yt_dlp.YoutubeDL(ydl_options) as ydl:
            info = ydl.extract_info(request.url, download=True)
            filename = Path(ydl.prepare_filename(info)).name
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Não foi possível obter este vídeo: {exc}") from exc

    return {"message": "Download concluído.", "file": filename, "folder": str(DOWNLOADS)}
