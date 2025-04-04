
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from pathlib import Path

app = FastAPI(title="Autosys Jobs API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for job data
class AutosysJob(BaseModel):
    jobName: str
    jobType: str
    status: str
    priority: int
    owner: str
    command: str
    machine: str
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    runDays: Optional[List[str]] = None
    dependencies: Optional[List[str]] = None
    description: Optional[str] = None

# Path to the jobs data file
JOBS_FILE = Path("api/data/jobs.json")

# Sample job data
SAMPLE_JOBS = [
    {
        "jobName": "DAILY_BACKUP",
        "jobType": "CMD",
        "status": "SUCCESS",
        "priority": 1,
        "owner": "admin",
        "command": "/scripts/backup.sh",
        "machine": "server001",
        "startTime": "23:00",
        "endTime": "23:30",
        "runDays": ["MON", "TUE", "WED", "THU", "FRI"],
        "dependencies": ["SYSTEM_CHECK"],
        "description": "Daily backup of system files"
    },
    {
        "jobName": "DATA_PROCESSING",
        "jobType": "CMD",
        "status": "RUNNING",
        "priority": 2,
        "owner": "datauser",
        "command": "/scripts/process_data.sh",
        "machine": "server002",
        "startTime": "01:00",
        "endTime": "02:30",
        "runDays": ["MON", "WED", "FRI"],
        "dependencies": ["DAILY_BACKUP"],
        "description": "Process daily data uploads"
    },
    {
        "jobName": "REPORT_GENERATION",
        "jobType": "BOX",
        "status": "INACTIVE",
        "priority": 3,
        "owner": "reporter",
        "command": "/scripts/generate_reports.sh",
        "machine": "server003",
        "startTime": "06:00",
        "runDays": ["MON"],
        "dependencies": ["DATA_PROCESSING"],
        "description": "Generate weekly reports"
    },
    {
        "jobName": "SYSTEM_CHECK",
        "jobType": "CMD",
        "status": "FAILURE",
        "priority": 1,
        "owner": "admin",
        "command": "/scripts/check_system.sh",
        "machine": "server001",
        "startTime": "22:00",
        "endTime": "22:15",
        "runDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        "description": "Daily system health check"
    },
    {
        "jobName": "DATABASE_CLEANUP",
        "jobType": "CMD",
        "status": "SUCCESS",
        "priority": 2,
        "owner": "dbadmin",
        "command": "/scripts/cleanup_db.sh",
        "machine": "dbserver001",
        "startTime": "04:00",
        "endTime": "04:45",
        "runDays": ["SUN"],
        "dependencies": ["DAILY_BACKUP"],
        "description": "Weekly database cleanup and optimization"
    },
    {
        "jobName": "LOG_ROTATION",
        "jobType": "CMD",
        "status": "SUCCESS",
        "priority": 2,
        "owner": "admin",
        "command": "/scripts/rotate_logs.sh",
        "machine": "server001",
        "startTime": "00:00",
        "endTime": "00:15",
        "runDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        "description": "Rotate system logs daily"
    }
]

# Initialize jobs data
def init_jobs_data():
    # Create directory if it doesn't exist
    os.makedirs(JOBS_FILE.parent, exist_ok=True)
    
    # If the file doesn't exist, create it with sample data
    if not JOBS_FILE.exists():
        with open(JOBS_FILE, 'w') as f:
            json.dump(SAMPLE_JOBS, f, indent=2)
    
    # Return the loaded jobs
    try:
        with open(JOBS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        # If there's an error loading the file, return sample data
        return SAMPLE_JOBS

# Load jobs data
jobs_data = init_jobs_data()

@app.get("/")
def read_root():
    return {"message": "Welcome to Autosys Jobs API"}

@app.get("/api/jobs", response_model=List[Dict[str, Any]])
def get_jobs():
    return jobs_data

@app.get("/api/jobs/{job_name}", response_model=Dict[str, Any])
def get_job(job_name: str):
    for job in jobs_data:
        if job["jobName"] == job_name:
            return job
    raise HTTPException(status_code=404, detail="Job not found")

@app.post("/api/generate_jobs/{count}")
def generate_jobs(count: int):
    """Generate additional synthetic jobs for testing"""
    import random
    
    statuses = ["SUCCESS", "FAILURE", "RUNNING", "INACTIVE", "TERMINATED", "WAITING", "ON_HOLD"]
    job_types = ["CMD", "BOX", "FW", "FT", "SQL", "WSDOC", "JMX"]
    owners = ["admin", "datauser", "reporter", "dbadmin", "sysadmin", "etluser", "scheduler", "batchuser"]
    machines = [
        "server001", "server002", "server003", "server004", "server005",
        "dbserver001", "dbserver002", "appserver001", "appserver002", "webserver001"
    ]
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    
    existing_job_names = [job["jobName"] for job in jobs_data]
    
    for i in range(count):
        # Keep generating new job names until we find a unique one
        while True:
            job_name = f"JOB_{str(i).zfill(5)}"
            if job_name not in existing_job_names:
                break
            i += 1
        
        priority = random.randint(1, 5)
        random_owner = random.choice(owners)
        random_machine = random.choice(machines)
        random_status = random.choice(statuses)
        random_type = random.choice(job_types)
        
        # Generate random time in 24hr format
        random_hour = str(random.randint(0, 23)).zfill(2)
        random_minute = str(random.randint(0, 59)).zfill(2)
        start_time = f"{random_hour}:{random_minute}"
        
        # End time 15-90 minutes later
        start_minutes = int(random_hour) * 60 + int(random_minute)
        end_minutes = start_minutes + random.randint(15, 90)
        end_hour = str((end_minutes // 60) % 24).zfill(2)
        end_minute = str(end_minutes % 60).zfill(2)
        end_time = f"{end_hour}:{end_minute}"
        
        # Generate random run days (1-7 days)
        num_days = random.randint(1, 7)
        run_days = list(set([random.choice(days) for _ in range(num_days)]))
        
        # Generate random dependencies (0-3)
        num_deps = random.randint(0, 3)
        dependencies = None
        if num_deps > 0 and existing_job_names:
            dependencies = [random.choice(existing_job_names) for _ in range(num_deps)]
        
        new_job = {
            "jobName": job_name,
            "jobType": random_type,
            "status": random_status,
            "priority": priority,
            "owner": random_owner,
            "command": f"/scripts/job_{i}.sh",
            "machine": random_machine,
            "startTime": start_time,
            "endTime": end_time,
            "runDays": run_days,
            "dependencies": dependencies,
            "description": f"Auto-generated job #{i} for testing"
        }
        
        jobs_data.append(new_job)
        existing_job_names.append(job_name)
    
    # Save the updated jobs to the file
    with open(JOBS_FILE, 'w') as f:
        json.dump(jobs_data, f, indent=2)
    
    return {"message": f"Generated {count} jobs", "total_jobs": len(jobs_data)}

# Add this if you want to run the app directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
