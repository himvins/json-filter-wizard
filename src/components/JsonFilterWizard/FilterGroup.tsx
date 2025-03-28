
import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X, Group } from 'lucide-react';
import { FilterCondition, FilterGroup as FilterGroupType, FilterOperator, FieldInfo } from './types';
import FilterConditionRow from './FilterConditionRow';
import { createEmptyCondition, createEmptyGroup } from './utils';

interface FilterGroupProps {
  group: FilterGroupType;
  fields: FieldInfo[];
  data: any[];
  onChange: (updated: FilterGroupType) => void;
  onDelete?: () => void;
  depth?: number;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  group,
  fields,
  data,
  onChange,
  onDelete,
  depth = 0
}) => {
  // Handle operator change (AND/OR)
  const handleOperatorChange = (value: FilterOperator) => {
    onChange({
      ...group,
      operator: value
    });
  };
  
  // Add a new condition
  const handleAddCondition = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createEmptyCondition()]
    });
  };
  
  // Update a specific condition
  const handleUpdateCondition = (index: number, updated: FilterCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;
    onChange({
      ...group,
      conditions: newConditions
    });
  };
  
  // Delete a condition
  const handleDeleteCondition = (index: number) => {
    const newConditions = [...group.conditions];
    newConditions.splice(index, 1);
    onChange({
      ...group,
      conditions: newConditions
    });
  };
  
  // Add a new nested group
  const handleAddGroup = () => {
    onChange({
      ...group,
      groups: [...group.groups, createEmptyGroup()]
    });
  };
  
  // Update a nested group
  const handleUpdateGroup = (index: number, updated: FilterGroupType) => {
    const newGroups = [...group.groups];
    newGroups[index] = updated;
    onChange({
      ...group,
      groups: newGroups
    });
  };
  
  // Delete a nested group
  const handleDeleteGroup = (index: number) => {
    const newGroups = [...group.groups];
    newGroups.splice(index, 1);
    onChange({
      ...group,
      groups: newGroups
    });
  };
  
  // Determine if this is a root level group
  const isRoot = depth === 0;
  
  return (
    <Card className={`mb-4 ${depth > 0 ? 'border-l-4 border-l-blue-200' : ''}`}>
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">
            {isRoot ? 'Filter Conditions' : 'Condition Group'}
          </CardTitle>
          
          {!isRoot && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {/* Operator selector */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Match</span>
            <Select
              value={group.operator}
              onValueChange={(value) => handleOperatorChange(value as FilterOperator)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">ALL conditions (AND)</SelectItem>
                <SelectItem value="OR">ANY condition (OR)</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-medium">of the following:</span>
          </div>
        </div>
        
        {/* List of conditions */}
        {group.conditions.length === 0 && group.groups.length === 0 && (
          <div className="text-center py-2 text-gray-400 bg-gray-50 rounded-md">
            No conditions defined. Add your first condition below.
          </div>
        )}
        
        {group.conditions.map((condition, index) => (
          <FilterConditionRow
            key={condition.id}
            condition={condition}
            fields={fields}
            data={data}
            onUpdate={(updated) => handleUpdateCondition(index, updated)}
            onDelete={() => handleDeleteCondition(index)}
            onAdd={handleAddCondition}
            isLast={index === group.conditions.length - 1}
          />
        ))}
        
        {/* Nested groups */}
        {group.groups.map((nestedGroup, index) => (
          <FilterGroup
            key={nestedGroup.id}
            group={nestedGroup}
            fields={fields}
            data={data}
            onChange={(updated) => handleUpdateGroup(index, updated)}
            onDelete={() => handleDeleteGroup(index)}
            depth={depth + 1}
          />
        ))}
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {group.conditions.length === 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddCondition}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Condition
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddGroup}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Group className="h-4 w-4 mr-1" />
            Add Condition Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterGroup;
