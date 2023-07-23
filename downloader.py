from pytube import YouTube, Playlist, Search
from moviepy.editor import *
# from mutagen.mp3 import MP3
# from mutagen.id3 import APIC, error
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
# import os
# import mutagen
# import requests

special_chars = [" ", "'", ",", "."]

app = Flask(__name__)
CORS(app)


@app.route('/download', methods=['POST'])
def get_data():
    try:
        data = request.get_json()
        download(data)
        return jsonify({'message': 'Video URL received successfully.'})
    except Exception as e:
        return jsonify({'error de python': str(e)}), 500


def download(data):

    videoURL = data.get('videoURL')
    title = data.get('title')
    artist = data.get('channelTitle')
    img = data.get('img')
    yt = YouTube(videoURL).streams.order_by('abr').desc().first()
    video_file_type = yt.mime_type.replace("video/", "")
    yt.download(filename=title)

    # Convirtiendo el archivo descargado
    temp_title = ""
    for char in special_chars:
        temp_title = title.replace(char, "-")

    video_path = title + f".{video_file_type}"
    audio_path = title + f".mp3"

    video_file = VideoFileClip(video_path)
    audio_file = video_file.audio
    audio_file.write_audiofile(audio_path)
    video_file.close()
    audio_file.close()
    os.remove(video_path)

    return send_file(video_path, as_attachment=True)


if __name__ == '__main__':
    app.run(port=5000)
