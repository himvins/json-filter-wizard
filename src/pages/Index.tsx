
import React, { useState } from 'react';
import StandaloneJsonFilterWizard from '@/components/StandaloneJsonFilterWizard';
import { sampleJobs } from '@/data/sampleJobs';

const Index = () => {
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">JSON Filter Wizard Demo</h1>
          <p className="text-slate-600">Create and apply filters to search through data</p>
        </header>
        
        <StandaloneJsonFilterWizard 
          data={sampleJobs} 
          onFilterChange={setFilteredJobs}
          title="Autosys Jobs Filter"
          description="Create filters to search through Autosys jobs"
        />
      </div>
    </div>
  );
};

export default Index;
