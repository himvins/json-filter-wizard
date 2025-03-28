import { v4 as uuidv4 } from 'uuid';
import { 
  FieldInfo, 
  FilterCondition, 
  FilterGroup, 
  FilterOperator, 
  JsonObject, 
  JsonValue 
} from './types';

// Creates a new empty filter group
export const createEmptyGroup = (operator: FilterOperator = 'AND'): FilterGroup => ({
  id: uuidv4(),
  operator,
  conditions: [],
  groups: []
});

// Creates a new empty filter condition
export const createEmptyCondition = (): FilterCondition => ({
  id: uuidv4(),
  field: '',
  operator: 'equals',
  value: '',
});

// Extracts fields from JSON data for building the filter UI
export const extractFields = (data: JsonValue, path = '', result: FieldInfo[] = []): FieldInfo[] => {
  if (data === null) {
    result.push({ path, type: 'null' });
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    // It's an object
    const obj = data as JsonObject;
    Object.keys(obj).forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      
      if (typeof value !== 'object' || value === null) {
        // For primitive values, add them directly
        result.push({ 
          path: newPath, 
          type: value === null ? 'null' : typeof value as any,
          sample: value 
        });
      } else if (Array.isArray(value)) {
        // For arrays, mark as array type but also explore first item if exists
        result.push({ path: newPath, type: 'array' });
        if (value.length > 0) {
          extractFields(value[0], `${newPath}[0]`, result);
        }
      } else {
        // For nested objects, recursively extract fields
        result.push({ path: newPath, type: 'object' });
        extractFields(value, newPath, result);
      }
    });
  } else if (Array.isArray(data)) {
    // It's an array
    result.push({ path, type: 'array' });
    if (data.length > 0) {
      extractFields(data[0], `${path}[0]`, result);
    }
  } else {
    // It's a primitive
    result.push({ 
      path, 
      type: typeof data as any,
      sample: data 
    });
  }
  
  return result;
};

// Extracts unique fields from an array of objects
export const extractFieldsFromArray = (data: any[]): FieldInfo[] => {
  if (!data || !data.length) return [];
  
  // Use the first item to extract fields
  const firstItem = data[0];
  return extractFields(firstItem);
};

// Gets all possible values for a field from the dataset
export const getUniqueFieldValues = (data: any[], fieldPath: string): any[] => {
  if (!data || !data.length) return [];
  
  const values = new Set<any>();
  
  data.forEach(item => {
    const value = getValueByPath(item, fieldPath);
    if (value !== undefined) {
      values.add(typeof value === 'object' ? JSON.stringify(value) : value);
    }
  });
  
  return Array.from(values);
};

// Gets a value from an object by dot-notation path
export const getValueByPath = (obj: any, path: string): any => {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    // Handle array indexing syntax like items[0]
    const match = part.match(/^([^\[]+)(?:\[(\d+)\])?$/);
    if (!match) return undefined;
    
    const [_, key, index] = match;
    
    if (current === null || current === undefined) {
      return undefined;
    }
    
    current = current[key];
    
    if (index !== undefined && Array.isArray(current)) {
      current = current[parseInt(index, 10)];
    }
  }
  
  return current;
};

// Create a worker instance (returns a Promise to allow for graceful degradation)
export const createFilterWorker = () => {
  return new Promise<Worker>((resolve, reject) => {
    try {
      const worker = new Worker(
        new URL('./filterWorker.ts', import.meta.url), 
        { type: 'module' }
      );
      resolve(worker);
    } catch (error) {
      reject(error);
    }
  });
};

// Fallback filter function for environments without worker support
export const filterData = (data: any[], rootGroup: FilterGroup): any[] => {
  if (!data || !data.length) return [];
  
  // This is just a stub - the actual implementation is in the worker
  console.warn('Using main thread filtering - this may impact performance with large datasets');
  
  // We'll import the worker logic directly in this case
  const { default: workerContent } = require('./filterWorker');
  return workerContent.filterData(data, rootGroup);
};
