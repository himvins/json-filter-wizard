
import React, { useState, useEffect } from 'react';
import StandaloneJsonFilterWizard from '@/components/StandaloneJsonFilterWizard';
import { AutosysJob } from '@/data/sampleJobs';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

// Updated to use relative URL instead of hardcoded localhost
const API_URL = '/api';

const Index = () => {
  const [jobs, setJobs] = useState<AutosysJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<AutosysJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/jobs`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Could not fetch jobs data. Make sure the API server is running.');
      // Use sample data as fallback
      import('@/data/sampleJobs').then(module => {
        setJobs(module.sampleJobs);
        setFilteredJobs(module.sampleJobs);
        toast({
          title: "Using sample data",
          description: "API server not available. Using sample data instead.",
          variant: "destructive"
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const generateJobs = async (count: number = 100) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/generate_jobs/${count}`, {
        method: 'POST',
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
    } finally {
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
            <Spinner className="w-8 h-8 text-blue-500" />
            <span className="ml-2">Loading jobs data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <Button onClick={fetchJobs} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-slate-500">
                  Loaded {jobs.length} jobs
                </span>
              </div>
              <Button 
                onClick={() => generateJobs(100)} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate 100 More Jobs
              </Button>
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
