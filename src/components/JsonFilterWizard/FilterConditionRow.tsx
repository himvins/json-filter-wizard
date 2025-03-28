
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { 
  FilterCondition, 
  ComparisonOperator,
  FieldInfo
} from './types';
import { getUniqueFieldValues } from './utils';

interface FilterConditionRowProps {
  condition: FilterCondition;
  fields: FieldInfo[];
  data: any[];
  onUpdate: (updated: FilterCondition) => void;
  onDelete: () => void;
  onAdd: () => void;
  isLast: boolean;
}

const FilterConditionRow: React.FC<FilterConditionRowProps> = ({
  condition,
  fields,
  data,
  onUpdate,
  onDelete,
  onAdd,
  isLast
}) => {
  const [currentField, setCurrentField] = useState<FieldInfo | undefined>(
    fields.find(f => f.path === condition.field)
  );
  
  const [possibleValues, setPossibleValues] = useState<any[]>([]);
  
  // Update possible values when field changes
  useEffect(() => {
    if (condition.field) {
      const values = getUniqueFieldValues(data, condition.field);
      setPossibleValues(values);
    }
  }, [condition.field, data]);

  // Get the appropriate operators based on field type
  const getOperatorsForType = (type?: string): { value: ComparisonOperator; label: string }[] => {
    const allOperators = [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'notContains', label: 'Not Contains' },
      { value: 'greaterThan', label: 'Greater Than' },
      { value: 'lessThan', label: 'Less Than' },
      { value: 'in', label: 'In' },
      { value: 'notIn', label: 'Not In' },
      { value: 'exists', label: 'Exists' },
      { value: 'notExists', label: 'Not Exists' },
      { value: 'startsWith', label: 'Starts With' },
      { value: 'endsWith', label: 'Ends With' }
    ];
    
    switch (type) {
      case 'string':
        return allOperators.filter(op => 
          ['equals', 'notEquals', 'contains', 'notContains', 'exists', 'notExists', 'startsWith', 'endsWith'].includes(op.value)
        );
      case 'number':
        return allOperators.filter(op => 
          ['equals', 'notEquals', 'greaterThan', 'lessThan', 'exists', 'notExists'].includes(op.value)
        );
      case 'boolean':
        return allOperators.filter(op => 
          ['equals', 'notEquals', 'exists', 'notExists'].includes(op.value)
        );
      case 'array':
        return allOperators.filter(op => 
          ['exists', 'notExists'].includes(op.value)
        );
      default:
        return allOperators.filter(op => 
          ['exists', 'notExists'].includes(op.value)
        );
    }
  };
  
  const handleFieldChange = (value: string) => {
    const field = fields.find(f => f.path === value);
    setCurrentField(field);
    
    // Reset operator and value when field changes
    const compatibleOperators = getOperatorsForType(field?.type);
    const defaultOperator = compatibleOperators.length > 0 ? compatibleOperators[0].value : 'equals';
    
    onUpdate({
      ...condition,
      field: value,
      operator: defaultOperator,
      value: ''
    });
  };
  
  const handleOperatorChange = (value: ComparisonOperator) => {
    onUpdate({
      ...condition,
      operator: value
    });
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...condition,
      value: e.target.value
    });
  };
  
  const handleValueSelect = (value: string) => {
    onUpdate({
      ...condition,
      value
    });
  };
  
  // Filter out operators that don't need values
  const needsValue = !['exists', 'notExists'].includes(condition.operator);
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 p-2 border border-gray-200 rounded-md bg-white">
      {/* Field selector */}
      <div className="flex-grow min-w-[200px]">
        <Select 
          value={condition.field} 
          onValueChange={handleFieldChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map(field => (
              <SelectItem key={field.path} value={field.path}>
                {field.path} ({field.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Operator selector */}
      <div className="flex-grow min-w-[150px]">
        <Select 
          value={condition.operator} 
          onValueChange={(value) => handleOperatorChange(value as ComparisonOperator)}
          disabled={!condition.field}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {getOperatorsForType(currentField?.type).map(op => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Value input or selector */}
      {needsValue && (
        <div className="flex-grow min-w-[200px]">
          {possibleValues.length > 0 && ['equals', 'notEquals'].includes(condition.operator) ? (
            <Select
              value={String(condition.value)}
              onValueChange={handleValueSelect}
              disabled={!condition.field || !condition.operator}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {possibleValues.map((val, index) => (
                  <SelectItem key={index} value={String(val)}>
                    {String(val)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={currentField?.type === 'number' ? 'number' : 'text'}
              value={condition.value || ''}
              onChange={handleValueChange}
              placeholder="Enter value"
              disabled={!condition.field || !condition.operator}
            />
          )}
        </div>
      )}
      
      {/* Add/Remove buttons */}
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete} 
          className="text-gray-500 hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {isLast && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onAdd}
            className="text-gray-500 hover:text-green-500"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterConditionRow;
