
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define all types inline to avoid external dependencies
type FilterOperator = 'AND' | 'OR';
type ComparisonOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains' 
  | 'greaterThan' 
  | 'lessThan'
  | 'in'
  | 'notIn'
  | 'exists'
  | 'notExists'
  | 'startsWith'
  | 'endsWith';

interface FilterCondition {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: any;
}

interface FilterGroup {
  id: string;
  operator: FilterOperator;
  conditions: FilterCondition[];
  groups: FilterGroup[];
}

interface StandaloneJsonFilterWizardProps {
  data: any[];
  onFilterChange?: (filteredData: any[]) => void;
  title?: string;
  description?: string;
}

const createEmptyGroup = (): FilterGroup => ({
  id: uuidv4(),
  operator: 'AND',
  conditions: [],
  groups: []
});

const filterData = (data: any[], filter: FilterGroup): any[] => {
  const matchGroup = (item: any, group: FilterGroup): boolean => {
    const conditionResults = group.conditions.map(condition => {
      const value = getNestedValue(item, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'notEquals':
          return value !== condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'notContains':
          return !String(value).includes(String(condition.value));
        case 'greaterThan':
          return value > condition.value;
        case 'lessThan':
          return value < condition.value;
        case 'in':
          return Array.isArray(condition.value) 
            ? condition.value.includes(value)
            : false;
        case 'notIn':
          return Array.isArray(condition.value) 
            ? !condition.value.includes(value)
            : true;
        case 'exists':
          return value !== undefined && value !== null;
        case 'notExists':
          return value === undefined || value === null;
        case 'startsWith':
          return String(value).startsWith(String(condition.value));
        case 'endsWith':
          return String(value).endsWith(String(condition.value));
        default:
          return true;
      }
    });

    const subGroupResults = group.groups.map(subGroup => matchGroup(item, subGroup));
    
    if (group.operator === 'AND') {
      return [...conditionResults, ...subGroupResults].every(Boolean);
    } else {
      return [...conditionResults, ...subGroupResults].some(Boolean);
    }
  };

  return data.filter(item => matchGroup(item, filter));
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => 
    acc && acc[part] !== undefined ? acc[part] : undefined, obj);
};

const extractFieldsFromArray = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];
  
  const extractFields = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).flatMap(key => {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        return extractFields(obj[key], newPrefix);
      }
      
      return [newPrefix];
    });
  };

  return [...new Set(extractFields(data[0]))];
};

const StandaloneJsonFilterWizard: React.FC<StandaloneJsonFilterWizardProps> = ({
  data,
  onFilterChange,
  title = "JSON Filter Wizard",
  description = "Create filters to search and filter your data"
}) => {
  const [fields, setFields] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<FilterGroup>(createEmptyGroup());
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [jsonFilterString, setJsonFilterString] = useState('');
  const [availableOperators] = useState<ComparisonOperator[]>([
    'equals', 'notEquals', 'contains', 'notContains', 
    'greaterThan', 'lessThan', 'in', 'notIn', 
    'exists', 'notExists', 'startsWith', 'endsWith'
  ]);

  // Extract fields when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const extractedFields = extractFieldsFromArray(data);
      setFields(extractedFields);
      setFilteredData(data);
    }
  }, [data]);

  // Update JSON filter string when filter state changes
  useEffect(() => {
    setJsonFilterString(JSON.stringify(filterState, null, 2));
  }, [filterState]);

  // Handle filter application
  const handleApplyFilter = () => {
    // Fix: Apply actual filtering logic here
    const results = filterData(data, filterState);
    setFilteredData(results);
    if (onFilterChange) {
      onFilterChange(results);
    }
  };

  // Reset filter
  const handleResetFilter = () => {
    const emptyGroup = createEmptyGroup();
    setFilterState(emptyGroup);
    setFilteredData(data);
    if (onFilterChange) {
      onFilterChange(data);
    }
  };

  // Add condition to the root group
  const addCondition = () => {
    // Fix: Create a proper deep copy of the state to avoid reference issues
    const newState = JSON.parse(JSON.stringify(filterState));
    
    // Add a new condition with default values
    newState.conditions.push({
      id: uuidv4(),
      field: fields.length > 0 ? fields[0] : '',
      operator: 'equals',
      value: ''
    });
    
    setFilterState(newState);
  };

  // Update condition field
  const updateConditionField = (conditionId: string, field: string) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    const condition = newState.conditions.find(c => c.id === conditionId);
    if (condition) {
      condition.field = field;
    }
    setFilterState(newState);
  };

  // Update condition operator
  const updateConditionOperator = (conditionId: string, operator: ComparisonOperator) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    const condition = newState.conditions.find(c => c.id === conditionId);
    if (condition) {
      condition.operator = operator;
    }
    setFilterState(newState);
  };

  // Update condition value
  const updateConditionValue = (conditionId: string, value: any) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    const condition = newState.conditions.find(c => c.id === conditionId);
    if (condition) {
      condition.value = value;
    }
    setFilterState(newState);
  };

  // Remove condition
  const removeCondition = (conditionId: string) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    newState.conditions = newState.conditions.filter(c => c.id !== conditionId);
    setFilterState(newState);
  };

  return (
    <div 
      className="standalone-json-filter-wizard" 
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="wizard-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{title}</h2>
        <p style={{ color: '#666' }}>{description}</p>
      </div>

      <div className="filter-controls" style={{ marginBottom: '20px' }}>
        <div className="conditions-list" style={{ marginBottom: '15px' }}>
          {filterState.conditions.length === 0 ? (
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              No conditions added yet. Use the "Add Condition" button below to create filter conditions.
            </div>
          ) : (
            filterState.conditions.map((condition) => (
              <div 
                key={condition.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  padding: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px' 
                }}
              >
                <select 
                  value={condition.field}
                  onChange={(e) => updateConditionField(condition.id, e.target.value)}
                  style={{ 
                    marginRight: '8px', 
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd' 
                  }}
                >
                  {fields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>

                <select 
                  value={condition.operator}
                  onChange={(e) => updateConditionOperator(condition.id, e.target.value as ComparisonOperator)}
                  style={{ 
                    marginRight: '8px', 
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd' 
                  }}
                >
                  {availableOperators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>

                <input 
                  type="text"
                  value={condition.value || ''}
                  onChange={(e) => updateConditionValue(condition.id, e.target.value)}
                  placeholder="Enter value"
                  style={{ 
                    marginRight: '8px', 
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    flexGrow: 1 
                  }}
                />

                <button 
                  onClick={() => removeCondition(condition.id)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="filter-actions">
          <button 
            onClick={addCondition}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Condition
          </button>
          <button 
            onClick={handleApplyFilter}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Apply Filter
          </button>
          <button 
            onClick={handleResetFilter}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="results-section">
        <h3 style={{ marginBottom: '10px' }}>
          Filtered Results: {filteredData.length} of {data.length}
        </h3>
        
        <div 
          className="results-preview" 
          style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid #e0e0e0',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px'
          }}
        >
          <pre>{JSON.stringify(filteredData.slice(0, 5), null, 2)}</pre>
          {filteredData.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
              ... {filteredData.length - 5} more items
            </div>
          )}
        </div>
      </div>

      <div className="json-filter-section" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>JSON Filter Configuration</h3>
        <textarea 
          value={jsonFilterString}
          onChange={(e) => setJsonFilterString(e.target.value)}
          style={{ 
            width: '100%', 
            minHeight: '200px', 
            fontFamily: 'monospace',
            padding: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );
};

export default StandaloneJsonFilterWizard;
