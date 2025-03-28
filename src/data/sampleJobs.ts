
// Sample Autosys jobs data for testing purposes
export interface AutosysJob {
  jobName: string;
  jobType: string;
  status: string;
  priority: number;
  owner: string;
  command: string;
  machine: string;
  startTime?: string;
  endTime?: string;
  runDays?: string[];
  dependencies?: string[];
  description?: string;
}

// Original sample jobs
const originalJobs: AutosysJob[] = [
  {
    jobName: "DAILY_BACKUP",
    jobType: "CMD",
    status: "SUCCESS",
    priority: 1,
    owner: "admin",
    command: "/scripts/backup.sh",
    machine: "server001",
    startTime: "23:00",
    endTime: "23:30",
    runDays: ["MON", "TUE", "WED", "THU", "FRI"],
    dependencies: ["SYSTEM_CHECK"],
    description: "Daily backup of system files"
  },
  {
    jobName: "DATA_PROCESSING",
    jobType: "CMD",
    status: "RUNNING",
    priority: 2,
    owner: "datauser",
    command: "/scripts/process_data.sh",
    machine: "server002",
    startTime: "01:00",
    endTime: "02:30",
    runDays: ["MON", "WED", "FRI"],
    dependencies: ["DAILY_BACKUP"],
    description: "Process daily data uploads"
  },
  {
    jobName: "REPORT_GENERATION",
    jobType: "BOX",
    status: "INACTIVE",
    priority: 3,
    owner: "reporter",
    command: "/scripts/generate_reports.sh",
    machine: "server003",
    startTime: "06:00",
    runDays: ["MON"],
    dependencies: ["DATA_PROCESSING"],
    description: "Generate weekly reports"
  },
  {
    jobName: "SYSTEM_CHECK",
    jobType: "CMD",
    status: "FAILURE",
    priority: 1,
    owner: "admin",
    command: "/scripts/check_system.sh",
    machine: "server001",
    startTime: "22:00",
    endTime: "22:15",
    runDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    description: "Daily system health check"
  },
  {
    jobName: "DATABASE_CLEANUP",
    jobType: "CMD",
    status: "SUCCESS",
    priority: 2,
    owner: "dbadmin",
    command: "/scripts/cleanup_db.sh",
    machine: "dbserver001",
    startTime: "04:00",
    endTime: "04:45",
    runDays: ["SUN"],
    dependencies: ["DAILY_BACKUP"],
    description: "Weekly database cleanup and optimization"
  },
  {
    jobName: "LOG_ROTATION",
    jobType: "CMD",
    status: "SUCCESS",
    priority: 2,
    owner: "admin",
    command: "/scripts/rotate_logs.sh",
    machine: "server001",
    startTime: "00:00",
    endTime: "00:15",
    runDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    description: "Rotate system logs daily"
  }
];

// Function to generate additional jobs for testing
const generateJobs = (count: number): AutosysJob[] => {
  const statuses = ["SUCCESS", "FAILURE", "RUNNING", "INACTIVE", "TERMINATED", "WAITING", "ON_HOLD"];
  const jobTypes = ["CMD", "BOX", "FW", "FT", "SQL", "WSDOC", "JMX"];
  const owners = ["admin", "datauser", "reporter", "dbadmin", "sysadmin", "etluser", "scheduler", "batchuser"];
  const machines = [
    "server001", "server002", "server003", "server004", "server005",
    "dbserver001", "dbserver002", "appserver001", "appserver002", "webserver001"
  ];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  const extraJobs: AutosysJob[] = [];
  
  for (let i = 0; i < count; i++) {
    const priority = Math.floor(Math.random() * 5) + 1;
    const randomOwner = owners[Math.floor(Math.random() * owners.length)];
    const randomMachine = machines[Math.floor(Math.random() * machines.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    
    // Generate random time in 24hr format
    const randomHour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const randomMinute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const startTime = `${randomHour}:${randomMinute}`;
    
    // End time 15-90 minutes later
    const startMinutes = parseInt(randomHour) * 60 + parseInt(randomMinute);
    const endMinutes = startMinutes + Math.floor(Math.random() * 75) + 15;
    const endHour = String(Math.floor(endMinutes / 60) % 24).padStart(2, '0');
    const endMinute = String(endMinutes % 60).padStart(2, '0');
    const endTime = `${endHour}:${endMinute}`;
    
    // Generate random run days (1-7 days)
    const numDays = Math.floor(Math.random() * 7) + 1;
    const runDays = Array.from(new Set(Array(numDays).fill(0).map(() => 
      days[Math.floor(Math.random() * days.length)]
    )));
    
    // Generate random dependencies (0-3)
    const numDeps = Math.floor(Math.random() * 4);
    const existingJobNames = [...originalJobs.map(j => j.jobName), ...extraJobs.map(j => j.jobName)];
    const dependencies = numDeps === 0 ? undefined : 
      Array(numDeps).fill(0).map(() => 
        existingJobNames[Math.floor(Math.random() * existingJobNames.length)]
      );
    
    extraJobs.push({
      jobName: `JOB_${i.toString().padStart(5, '0')}`,
      jobType: randomType,
      status: randomStatus,
      priority,
      owner: randomOwner,
      command: `/scripts/job_${i}.sh`,
      machine: randomMachine,
      startTime,
      endTime,
      runDays,
      dependencies,
      description: `Auto-generated job #${i} for testing`
    });
  }
  
  return extraJobs;
};

// Combine original jobs with generated jobs
export const sampleJobs: AutosysJob[] = [
  ...originalJobs,
  ...generateJobs(1000) // Generate 1000 additional jobs for testing
];
