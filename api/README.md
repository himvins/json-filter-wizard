
# Autosys Jobs API

This is a simple FastAPI backend that serves Autosys job data.

## Getting Started

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Run the server:
```
uvicorn main:app --reload
```

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/{job_name}` - Get a specific job by name
- `POST /api/generate_jobs/{count}` - Generate additional synthetic jobs for testing

## API Documentation

When the server is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
