
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

// Create an initial group with a default condition
const createInitialGroup = (fields: string[]): FilterGroup => {
  const group = createEmptyGroup();
  
  // Add a default condition if fields are available
  if (fields.length > 0) {
    group.conditions.push({
      id: uuidv4(),
      field: fields[0],
      operator: 'equals',
      value: ''
    });
  }
  
  return group;
};

const filterData = (data: any[], filter: FilterGroup): any[] => {
  const matchGroup = (item: any, group: FilterGroup): boolean => {
    const conditionResults = group.conditions.map(condition => {
      const value = getNestedValue(item, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return typeof value === 'string' && typeof condition.value === 'string' 
            ? value.toLowerCase() === condition.value.toLowerCase()
            : value === condition.value;
        case 'notEquals':
          return typeof value === 'string' && typeof condition.value === 'string' 
            ? value.toLowerCase() !== condition.value.toLowerCase()
            : value !== condition.value;
        case 'contains':
          return typeof value === 'string' && typeof condition.value === 'string'
            ? value.toLowerCase().includes(condition.value.toLowerCase())
            : String(value).includes(String(condition.value));
        case 'notContains':
          return typeof value === 'string' && typeof condition.value === 'string'
            ? !value.toLowerCase().includes(condition.value.toLowerCase())
            : !String(value).includes(String(condition.value));
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
          return typeof value === 'string' && typeof condition.value === 'string'
            ? value.toLowerCase().startsWith(condition.value.toLowerCase())
            : String(value).startsWith(String(condition.value));
        case 'endsWith':
          return typeof value === 'string' && typeof condition.value === 'string'
            ? value.toLowerCase().endsWith(condition.value.toLowerCase())
            : String(value).endsWith(String(condition.value));
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
  const [showJsonView, setShowJsonView] = useState(false);

  // Extract fields when data changes and initialize with default condition
  useEffect(() => {
    if (data && data.length > 0) {
      const extractedFields = extractFieldsFromArray(data);
      setFields(extractedFields);
      
      // Create an initial filter state with a default condition
      const initialGroup = createInitialGroup(extractedFields);
      setFilterState(initialGroup);
      
      setFilteredData(data);
    }
  }, [data]);

  // Update JSON filter string when filter state changes
  useEffect(() => {
    setJsonFilterString(JSON.stringify(filterState, null, 2));
  }, [filterState]);

  // Handle filter application
  const handleApplyFilter = () => {
    // Apply filtering logic
    const results = filterData(data, filterState);
    setFilteredData(results);
    if (onFilterChange) {
      onFilterChange(results);
    }
  };

  // Reset filter
  const handleResetFilter = () => {
    const initialGroup = createInitialGroup(fields);
    setFilterState(initialGroup);
    setFilteredData(data);
    if (onFilterChange) {
      onFilterChange(data);
    }
  };

  // Add condition to the root group
  const addCondition = () => {
    // Create a proper deep copy of the state to avoid reference issues
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
    const condition = newState.conditions.find((c: FilterCondition) => c.id === conditionId);
    if (condition) {
      condition.field = field;
    }
    setFilterState(newState);
  };

  // Update condition operator
  const updateConditionOperator = (conditionId: string, operator: ComparisonOperator) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    const condition = newState.conditions.find((c: FilterCondition) => c.id === conditionId);
    if (condition) {
      condition.operator = operator;
    }
    setFilterState(newState);
  };

  // Update condition value
  const updateConditionValue = (conditionId: string, value: any) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    const condition = newState.conditions.find((c: FilterCondition) => c.id === conditionId);
    if (condition) {
      condition.value = value;
    }
    setFilterState(newState);
  };

  // Remove condition
  const removeCondition = (conditionId: string) => {
    const newState = JSON.parse(JSON.stringify(filterState));
    newState.conditions = newState.conditions.filter((c: FilterCondition) => c.id !== conditionId);
    setFilterState(newState);
  };

  // Toggle JSON view
  const toggleJsonView = () => {
    setShowJsonView(!showJsonView);
  };

  return (
    <div 
      className="standalone-json-filter-wizard bg-white" 
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="wizard-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#333' }}>{title}</h2>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>{description}</p>
      </div>

      <div className="results-summary" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#555' }}>
          Showing <strong>{filteredData.length}</strong> of <strong>{data.length}</strong> items
        </div>
        
        <div className="view-toggle">
          <button 
            onClick={toggleJsonView}
            style={{
              padding: '6px 10px',
              backgroundColor: 'transparent',
              color: showJsonView ? '#2196F3' : '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {showJsonView ? "Hide JSON" : "View JSON"}
          </button>
        </div>
      </div>

      <div className="filter-controls" style={{ marginBottom: '20px' }}>
        <div className="conditions-list" style={{ marginBottom: '15px' }}>
          {filterState.conditions.length === 0 ? (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f9f9f9', 
              borderRadius: '4px',
              textAlign: 'center',
              color: '#666' 
            }}>
              No conditions added yet. Use the "Add Condition" button below to create filter conditions.
            </div>
          ) : (
            filterState.conditions.map((condition, index) => (
              <div 
                key={condition.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e8e8e8'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, flexWrap: 'wrap', gap: '8px' }}>
                  <select 
                    value={condition.field}
                    onChange={(e) => updateConditionField(condition.id, e.target.value)}
                    style={{ 
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      minWidth: '150px'
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
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      minWidth: '120px'
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
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      flexGrow: 1,
                      minWidth: '120px'
                    }}
                  />
                </div>

                <button 
                  onClick={() => removeCondition(condition.id)}
                  title="Remove condition"
                  style={{
                    width: '30px',
                    height: '30px',
                    padding: '0',
                    marginLeft: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    color: '#f44336',
                    border: '1px solid #f44336',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="filter-actions" style={{ 
          display: 'flex', 
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={addCondition}
            style={{
              padding: '8px 12px',
              backgroundColor: '#fff',
              color: '#4CAF50',
              border: '1px solid #4CAF50',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}
          >
            <span style={{ fontSize: '15px' }}>+</span> Add Condition
          </button>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleResetFilter}
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Reset
            </button>
            
            <button 
              onClick={handleApplyFilter}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(33, 150, 243, 0.2)',
                fontWeight: 500
              }}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {showJsonView && (
        <div className="json-filter-section" style={{ 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            marginBottom: '8px', 
            color: '#333',
            fontWeight: 500
          }}>JSON Filter Configuration</h3>
          <textarea 
            value={jsonFilterString}
            onChange={(e) => setJsonFilterString(e.target.value)}
            style={{ 
              width: '100%', 
              minHeight: '120px', 
              fontFamily: 'monospace',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              fontSize: '0.85rem'
            }}
          />
        </div>
      )}

      <div className="results-section">
        <h3 style={{ 
          fontSize: '1rem', 
          marginBottom: '10px',
          color: '#333',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Results Preview
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            fontWeight: 'normal',
            backgroundColor: '#eee',
            borderRadius: '4px',
            padding: '2px 6px'
          }}>
            showing first 5 items
          </span>
        </h3>
        
        <div 
          className="results-preview" 
          style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid #e8e8e8',
            padding: '12px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px'
          }}
        >
          <pre style={{ 
            margin: 0, 
            fontSize: '0.85rem', 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {JSON.stringify(filteredData.slice(0, 5), null, 2)}
          </pre>
          {filteredData.length > 5 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '10px', 
              color: '#666',
              padding: '6px',
              borderTop: '1px solid #e8e8e8',
              fontSize: '0.85rem'
            }}>
              ... {filteredData.length - 5} more items
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandaloneJsonFilterWizard;
