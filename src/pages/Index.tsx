
import React, { useState } from 'react';
import StandaloneJsonFilterWizard from '@/components/StandaloneJsonFilterWizard';
import { sampleJobs } from '@/data/sampleJobs';

const Index = () => {
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-4">Standalone JSON Filter Wizard Demo</h1>
        
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
