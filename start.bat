@echo off
py -m pip install -r requirements.txt
py -m uvicorn local_app:app --host 127.0.0.1 --port 8787
