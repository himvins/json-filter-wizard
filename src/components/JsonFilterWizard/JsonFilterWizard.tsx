
import React, { useEffect, useState } from 'react';
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
import { 
  RefreshCw, 
  Code, 
  Save, 
  Filter, 
  X, 
  FileDown, 
  FileUp, 
  Copy 
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
  filterData 
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
  const { toast } = useToast();
  
  // Extract fields from data when component mounts or data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const extractedFields = extractFieldsFromArray(data);
      setFields(extractedFields);
      setFilteredData(data);
    }
  }, [data]);
  
  // Update filtered data when filter state changes (not on pending changes)
  useEffect(() => {
    const newFilteredData = filterData(data, filterState.rootGroup);
    setFilteredData(newFilteredData);
    onFilterChange?.(newFilteredData);
    
    // Update JSON string representation
    setJsonFilterString(JSON.stringify(filterState.rootGroup, null, 2));
  }, [filterState, data, onFilterChange]);
  
  // Handle filter group changes (this now updates the pending state)
  const handleFilterChange = (rootGroup: FilterGroupType) => {
    setPendingFilterState({ rootGroup });
  };
  
  // Apply the pending filter
  const handleApplyFilter = () => {
    setFilterState(pendingFilterState);
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
    toast({
      title: "Filter Reset",
      description: "All filter conditions have been cleared.",
    });
  };
  
  // Apply JSON filter from text
  const handleApplyJsonFilter = () => {
    try {
      const parsed = JSON.parse(jsonFilterString);
      setFilterState({ rootGroup: parsed });
      setPendingFilterState({ rootGroup: parsed });
      toast({
        title: "Filter Applied",
        description: "JSON filter has been successfully applied.",
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
              <FilterGroup
                group={pendingFilterState.rootGroup}
                fields={fields}
                data={data}
                onChange={handleFilterChange}
              />
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleApplyFilter}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Apply Filter
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
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Apply JSON
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
