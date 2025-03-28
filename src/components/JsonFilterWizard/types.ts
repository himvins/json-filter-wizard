
export type FilterOperator = 'AND' | 'OR';

export type ComparisonOperator = 
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

export interface FilterCondition {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export interface FilterGroup {
  id: string;
  operator: FilterOperator;
  conditions: FilterCondition[];
  groups: FilterGroup[];
}

export interface FilterState {
  rootGroup: FilterGroup;
}

// Define a utility type to describe any JSON object
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

// Describes an extracted field with its path and detected type
export interface FieldInfo {
  path: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';
  sample?: any;
}
