from fastapi import FastAPI
from youtube_transcript_api import YouTubeTranscriptApi

app = FastAPI()

@app.get("/transcript/{video_id}")
def get_transcript(video_id: str):
    try:
        ytt_api = YouTubeTranscriptApi()
        
        # Спочатку пробуємо uk/en, потім будь-яку доступну
        try:
            transcript = ytt_api.fetch(video_id, languages=['uk', 'en'])
        except:
            transcript_list = ytt_api.list(video_id)
            first = next(iter(transcript_list))
            transcript = first.fetch()
        
        text = " ".join([t.text for t in transcript])
        return {"transcript": text[:3000]}
    except Exception as e:
        return {"transcript": None, "error": str(e)}