from pytube import YouTube, Playlist, Search
from moviepy.editor import *
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.concurrency import run_in_threadpool
import traceback
import asyncio

special_chars = [" ", "'", ",", "."]

app = FastAPI()
origins = ["*"]  # Set this to the list of allowed origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/download')
async def main(request: Request):
    try:
        data = await request.json()
        videoURL = data.get('videoURL')
        download_task = asyncio.create_task(download_video(videoURL))
        video =  await download_task
        video_path, video_type = video
        if os.path.exists(video_path):
            # return FileResponse(video_path, media_type=f"video/{video_type}", headers={"Content-Disposition": "attachment"})
            response = FileResponse(video_path, media_type=f"video/{video_type}", headers={"Content-Disposition": "attachment"})
            return response
        else:
            return {'Error de Python':f'Archivo descargado pero no encontrado: {video_path}'}
        
    except Exception as e:
        traceback_info = traceback.format_exc()
        return {'error de python': str(e), 'traceback':traceback_info}
    
async def download_video(url: str):
    download_folder_path = os.path.expanduser("~/Descargas/")
    if not os.path.exists(download_folder_path):
        download_folder_path.replace("Descargas", "Downloads")
    yt = YouTube(url).streams.filter(file_extension="mp4", mime_type="video/mp4").order_by('abr').desc().first()
    video_file_type = yt.mime_type.replace("video/", "")
    video_path = await yt.download(output_path=download_folder_path)
    return video_path, video_file_type