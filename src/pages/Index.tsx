
import React, { useState, useEffect } from 'react';
import StandaloneJsonFilterWizard from '@/components/StandaloneJsonFilterWizard';
import { AutosysJob } from '@/data/sampleJobs';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Updated to use relative URL with a proper fallback mechanism
const API_URL = '/api';

const Index = () => {
  const [jobs, setJobs] = useState<AutosysJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<AutosysJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiAvailability().then(available => {
      if (available) {
        fetchJobs();
      } else {
        // Fall back to sample data
        useSampleData("API server not available");
      }
    });
  }, []);

  const checkApiAvailability = async (): Promise<boolean> => {
    try {
      // Make a lightweight request to check if the API is available
      const response = await fetch(`${API_URL}/`, { 
        method: 'HEAD',
        // Short timeout to quickly fail if server is not responding
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch (err) {
      console.log("API availability check failed:", err);
      return false;
    }
  };

  const useSampleData = (reason: string) => {
    setApiAvailable(false);
    console.log(`Using sample data: ${reason}`);
    import('@/data/sampleJobs').then(module => {
      setJobs(module.sampleJobs);
      setFilteredJobs(module.sampleJobs);
      setLoading(false);
      toast({
        title: "Using sample data",
        description: `${reason}. Using sample data instead.`,
        variant: "destructive"
      });
    });
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_URL}/jobs`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Check if response is valid JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return valid JSON");
      }
      
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
      setApiAvailable(true);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Could not fetch jobs data. ${errorMessage}`);
      
      // Use sample data as fallback
      useSampleData("API server not responding correctly");
    } finally {
      setLoading(false);
    }
  };

  const generateJobs = async (count: number = 100) => {
    if (!apiAvailable) {
      toast({
        title: "API Unavailable",
        description: "Cannot generate jobs because the API server is not available.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/generate_jobs/${count}`, {
        method: 'POST',
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      toast({
        title: "Jobs Generated",
        description: `Successfully generated ${count} new jobs.`,
      });
      
      // Fetch the updated jobs list
      fetchJobs();
    } catch (err) {
      console.error('Error generating jobs:', err);
      toast({
        title: "Error",
        description: "Failed to generate jobs. Make sure the API server is running.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">JSON Filter Wizard Demo</h1>
          <p className="text-slate-600">Create and apply filters to search through data</p>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" color="blue" />
            <span className="ml-2">Loading jobs data...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <div className="flex gap-2 mt-3">
              <Button onClick={fetchJobs} variant="outline" size="sm">
                Retry API
              </Button>
              {!apiAvailable && (
                <Button onClick={() => window.location.reload()} size="sm" variant="secondary">
                  Refresh Page
                </Button>
              )}
            </div>
          </Alert>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-slate-500">
                  Loaded {jobs.length} jobs {!apiAvailable && "(Sample Data)"}
                </span>
              </div>
              <Button 
                onClick={() => generateJobs(100)} 
                disabled={loading || !apiAvailable}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate 100 More Jobs
              </Button>
            </div>
            
            <div className="mb-4">
              {!apiAvailable && (
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                  <AlertTitle>Using Sample Data</AlertTitle>
                  <AlertDescription>
                    The API server is not available. Using sample data instead. 
                    To run the API server:
                    <ol className="list-decimal ml-5 mt-2">
                      <li>Navigate to the api directory</li>
                      <li>Run <code className="bg-gray-100 px-1 rounded">pip install -r requirements.txt</code></li>
                      <li>Run <code className="bg-gray-100 px-1 rounded">uvicorn main:app --reload</code></li>
                    </ol>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <StandaloneJsonFilterWizard 
              data={jobs} 
              onFilterChange={setFilteredJobs}
              title="Autosys Jobs Filter"
              description="Create filters to search through Autosys jobs"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
