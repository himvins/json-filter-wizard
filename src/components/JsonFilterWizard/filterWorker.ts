
import { FilterGroup } from './types';
import { getValueByPath } from './utils';

// Helper functions needed by the worker
const evaluateGroup = (item: any, group: FilterGroup): boolean => {
  // Evaluate all immediate conditions in this group
  const conditionResults = group.conditions.map(condition => 
    evaluateCondition(item, condition)
  );
  
  // Evaluate all nested groups
  const groupResults = group.groups.map(nestedGroup => 
    evaluateGroup(item, nestedGroup)
  );
  
  // Combine all results based on the group's operator
  const allResults = [...conditionResults, ...groupResults];
  
  if (allResults.length === 0) return true; // Empty group matches everything
  
  return group.operator === 'AND' 
    ? allResults.every(Boolean) 
    : allResults.some(Boolean);
};

// Evaluates a single condition against an item
const evaluateCondition = (item: any, condition: any): boolean => {
  const { field, operator, value } = condition;
  const actualValue = getValueByPath(item, field);
  
  // Handle the case where the field doesn't exist
  if (actualValue === undefined) {
    return operator === 'notExists';
  }
  
  switch (operator) {
    case 'equals':
      return actualValue === value;
      
    case 'notEquals':
      return actualValue !== value;
      
    case 'contains':
      return typeof actualValue === 'string' && 
             actualValue.toLowerCase().includes(String(value).toLowerCase());
      
    case 'notContains':
      return typeof actualValue !== 'string' || 
             !actualValue.toLowerCase().includes(String(value).toLowerCase());
      
    case 'greaterThan':
      return actualValue > value;
      
    case 'lessThan':
      return actualValue < value;
      
    case 'in':
      return Array.isArray(value) && value.includes(actualValue);
      
    case 'notIn':
      return Array.isArray(value) && !value.includes(actualValue);
      
    case 'exists':
      return actualValue !== undefined;
      
    case 'notExists':
      return actualValue === undefined;
      
    case 'startsWith':
      return typeof actualValue === 'string' && 
             actualValue.toLowerCase().startsWith(String(value).toLowerCase());
      
    case 'endsWith':
      return typeof actualValue === 'string' && 
             actualValue.toLowerCase().endsWith(String(value).toLowerCase());
      
    default:
      return false;
  }
};

// Main filter function
const filterData = (data: any[], rootGroup: FilterGroup): any[] => {
  if (!data || !data.length) return [];
  return data.filter(item => evaluateGroup(item, rootGroup));
};

// Worker message handler
self.onmessage = (e: MessageEvent) => {
  const { data: sourceData, filter } = e.data;
  
  try {
    // Start timing
    const startTime = performance.now();
    
    // Process the data
    const result = filterData(sourceData, filter);
    
    // End timing
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    // Send filtered results back to the main thread
    self.postMessage({ 
      type: 'result', 
      data: result, 
      count: result.length,
      totalCount: sourceData.length,
      processingTime 
    });
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
