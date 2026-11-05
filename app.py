"""نقطه‌ی ورود برنامه.

اجرای محلی:      python app.py
اجرا روی سرور:    gunicorn -w 3 --threads 4 -b 127.0.0.1:8000 wsgi:app
"""
import os

from backend import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host=os.environ.get("HOST", "0.0.0.0"), port=int(os.environ.get("PORT", "8000")))
