FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV MADANI_DB_PATH=/data/madani.db
VOLUME /data
EXPOSE 8000
CMD ["gunicorn", "-w", "3", "--threads", "4", "-b", "0.0.0.0:8000", "wsgi:app"]
