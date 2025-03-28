
import React, { useEffect, useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, 
  Code, 
  Save, 
  Filter, 
  X, 
  FileDown, 
  FileUp, 
  Copy,
  AlertTriangle 
} from 'lucide-react';
import FilterGroup from './FilterGroup';
import { 
  FilterGroup as FilterGroupType, 
  FilterState, 
  FieldInfo
} from './types';
import { 
  createEmptyGroup, 
  extractFieldsFromArray, 
  createFilterWorker
} from './utils';
import { useToast } from '@/hooks/use-toast';

interface JsonFilterWizardProps {
  data: any[];
  onFilterChange?: (filteredData: any[]) => void;
  title?: string;
  description?: string;
}

const JsonFilterWizard: React.FC<JsonFilterWizardProps> = ({
  data,
  onFilterChange,
  title = "JSON Filter Wizard",
  description = "Create filters to search and filter your data"
}) => {
  const [fields, setFields] = useState<FieldInfo[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    rootGroup: createEmptyGroup()
  });
  const [pendingFilterState, setPendingFilterState] = useState<FilterState>({
    rootGroup: createEmptyGroup()
  });
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [jsonFilterString, setJsonFilterString] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [workerSupported, setWorkerSupported] = useState(true);
  const workerRef = useRef<Worker | null>(null);
  const { toast } = useToast();
  
  // Initialize the web worker when component mounts
  useEffect(() => {
    const initWorker = async () => {
      try {
        const worker = await createFilterWorker();
        
        worker.onmessage = (e: MessageEvent) => {
          const { type, data: resultData, count, processingTime: time } = e.data;
          
          if (type === 'result') {
            setFilteredData(resultData);
            onFilterChange?.(resultData);
            setIsFiltering(false);
            setProcessingTime(time);
          } else if (type === 'error') {
            console.error('Worker error:', e.data.error);
            setIsFiltering(false);
            toast({
              title: "Filter Error",
              description: e.data.error,
              variant: "destructive",
            });
          }
        };
        
        workerRef.current = worker;
      } catch (error) {
        console.error('Failed to initialize worker:', error);
        setWorkerSupported(false);
        toast({
          title: "Performance Warning",
          description: "Web Workers not supported in your browser. Filtering large datasets may be slow.",
          variant: "destructive",
        });
      }
    };
    
    initWorker();
    
    // Cleanup worker on component unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [onFilterChange, toast]);
  
  // Extract fields from data when component mounts or data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const extractedFields = extractFieldsFromArray(data);
      setFields(extractedFields);
      setFilteredData(data);
    }
  }, [data]);
  
  // Update JSON string representation when filter state changes
  useEffect(() => {
    setJsonFilterString(JSON.stringify(filterState.rootGroup, null, 2));
  }, [filterState]);
  
  // Handle filter group changes (this updates the pending state)
  const handleFilterChange = (rootGroup: FilterGroupType) => {
    setPendingFilterState({ rootGroup });
  };
  
  // Apply the pending filter
  const handleApplyFilter = () => {
    setIsFiltering(true);
    setFilterState(pendingFilterState);
    
    // Use the worker to filter data if available
    if (workerRef.current && workerSupported) {
      workerRef.current.postMessage({
        data,
        filter: pendingFilterState.rootGroup
      });
    } else {
      // Fallback to synchronous filtering if workers not supported
      import('./utils').then(({ filterData }) => {
        const startTime = performance.now();
        const results = filterData(data, pendingFilterState.rootGroup);
        const endTime = performance.now();
        
        setFilteredData(results);
        onFilterChange?.(results);
        setIsFiltering(false);
        setProcessingTime(endTime - startTime);
      });
    }
    
    toast({
      title: "Filter Applied",
      description: "Filter conditions have been applied.",
    });
  };
  
  // Reset the filter
  const handleResetFilter = () => {
    const emptyGroup = createEmptyGroup();
    setFilterState({ rootGroup: emptyGroup });
    setPendingFilterState({ rootGroup: emptyGroup });
    setFilteredData(data);
    onFilterChange?.(data);
    setProcessingTime(null);
    
    toast({
      title: "Filter Reset",
      description: "All filter conditions have been cleared.",
    });
  };
  
  // Apply JSON filter from text
  const handleApplyJsonFilter = () => {
    try {
      const parsed = JSON.parse(jsonFilterString);
      setPendingFilterState({ rootGroup: parsed });
      // Don't apply filter immediately, let user click Apply
      toast({
        title: "Filter Loaded",
        description: "JSON filter has been loaded. Click 'Apply Filter' to use it.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The provided JSON is not valid. Please check the format.",
        variant: "destructive",
      });
    }
  };
  
  // Export filter as JSON
  const handleExportFilter = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonFilterString);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "filter.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Filter Exported",
      description: "Filter configuration has been downloaded as JSON.",
    });
  };
  
  // Import filter from JSON file
  const handleImportFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        setPendingFilterState({ rootGroup: parsed });
        setJsonFilterString(content);
        toast({
          title: "Filter Imported",
          description: "Filter configuration has been imported. Click 'Apply Filter' to use it.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import filter. The file may not contain valid JSON.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input value so the same file can be selected again
    event.target.value = '';
  };
  
  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonFilterString);
    toast({
      title: "Copied",
      description: "Filter JSON copied to clipboard",
    });
  };
  
  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {filteredData.length} of {data.length} items
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetFilter}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!workerSupported && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 p-2 rounded flex items-center text-yellow-700">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm">Web Workers not supported. Filtering large datasets may be slow.</p>
          </div>
        )}
        
        {isFiltering && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Filtering data...</span>
              <span className="text-sm">{data.length} records</span>
            </div>
            <Progress value={100} className="animate-pulse" />
          </div>
        )}
        
        {processingTime !== null && !isFiltering && (
          <div className="mb-4 bg-gray-50 p-2 rounded text-sm text-gray-600">
            Filtering completed in {processingTime.toFixed(2)}ms 
            ({filteredData.length} of {data.length} records matched)
          </div>
        )}
      
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="builder" className="flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Filter Builder
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center">
              <Code className="h-4 w-4 mr-1" />
              JSON View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder">
            <div className="space-y-4">
              {isFiltering ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <FilterGroup
                  group={pendingFilterState.rootGroup}
                  fields={fields}
                  data={data}
                  onChange={handleFilterChange}
                />
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleApplyFilter}
                  disabled={isFiltering}
                >
                  {isFiltering ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Filtering...
                    </>
                  ) : (
                    <>
                      <Filter className="h-4 w-4 mr-1" />
                      Apply Filter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="json">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleApplyJsonFilter}
                  disabled={isFiltering}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Load JSON
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportFilter}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJson}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    id="import-filter"
                    accept=".json"
                    onChange={handleImportFilter}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <FileUp className="h-4 w-4 mr-1" />
                    Import
                  </Button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                <ScrollArea className="h-[300px] w-full">
                  <pre className="text-xs font-mono p-2">{jsonFilterString}</pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setFilteredData(data);
              onFilterChange?.(data);
            }}
            className="flex items-center"
            disabled={isFiltering}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Data
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JsonFilterWizard;
