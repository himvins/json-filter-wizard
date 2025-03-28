
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

export const sampleJobs: AutosysJob[] = [
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
