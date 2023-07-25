from pytube import YouTube, Playlist, Search
from moviepy.editor import *
# from mutagen.mp3 import MP3
# from mutagen.id3 import APIC, error
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
# import os
# import mutagen
# import requests
import traceback

special_chars = [" ", "'", ",", "."]

app = Flask(__name__)
CORS(app)


@app.route('/download', methods=['POST'])
def download():
    try:
        data = request.get_json()
        videoURL = data.get('videoURL')
        title = data.get('title')
        artist = data.get('channelTitle')
        img = data.get('img')
        yt = YouTube(videoURL).streams.order_by('abr').desc().first()
        video_file_type = yt.mime_type.replace("video/", "")
        print(yt)
        yt.download()
        video_path = title + f".{video_file_type}"
        return send_file(video_path, as_attachment=True)
    except Exception as e:
        traceback_info = traceback.format_exc()
        return jsonify({'error de python': str(e), 'traceback':traceback_info})

if __name__ == '__main__':
    app.run(port=5000)
