
import React, { useState } from 'react';
import { sampleJobs, AutosysJob } from '@/data/sampleJobs';
import { JsonFilterWizard } from '@/components/JsonFilterWizard';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [filteredJobs, setFilteredJobs] = useState<AutosysJob[]>(sampleJobs);
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'FAILURE':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">JSON Filter Wizard</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A powerful component for filtering JSON data with complex conditions and logic. 
            Perfect for filtering Autosys jobs or any structured JSON data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Filter Wizard */}
          <JsonFilterWizard 
            data={sampleJobs} 
            onFilterChange={setFilteredJobs}
            title="Autosys Jobs Filter"
            description="Create filters to search through Autosys jobs"
          />
          
          {/* Results Display */}
          <Card>
            <CardHeader>
              <CardTitle>Filtered Results ({filteredJobs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Machine</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.jobName}>
                        <TableCell className="font-medium">{job.jobName}</TableCell>
                        <TableCell>{job.jobType}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusBadgeVariant(job.status)}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{job.priority}</TableCell>
                        <TableCell>{job.owner}</TableCell>
                        <TableCell>{job.machine}</TableCell>
                        <TableCell>{job.startTime || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {job.description || 'No description'}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredJobs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                          No results found. Try adjusting your filter criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
