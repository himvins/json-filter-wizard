
import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// CSS reset and isolation to prevent style conflicts
const isolatedStyles = `
.json-filter-wizard-container * {
  box-sizing: border-box;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
}

.json-filter-wizard-container {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --danger-color: #ef4444;
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --text-color: #374151;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --bg-color: #ffffff;
  --bg-color-offset: #f9fafb;
  --bg-color-muted: #f3f4f6;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  
  width: 100%;
  color: var(--text-color);
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  font-size: 14px;
}

.json-filter-wizard-card {
  background-color: var(--bg-color);
}

.json-filter-wizard-card-header {
  padding: var(--spacing-5) var(--spacing-5) var(--spacing-2) var(--spacing-5);
  border-bottom: 1px solid var(--border-color);
}

.json-filter-wizard-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 var(--spacing-1) 0;
}

.json-filter-wizard-card-description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.json-filter-wizard-card-content {
  padding: var(--spacing-5);
}

.json-filter-wizard-card-footer {
  padding: var(--spacing-2) var(--spacing-5) var(--spacing-5) var(--spacing-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.json-filter-wizard-flex {
  display: flex;
}

.json-filter-wizard-flex-col {
  flex-direction: column;
}

.json-filter-wizard-flex-grow {
  flex-grow: 1;
}

.json-filter-wizard-flex-wrap {
  flex-wrap: wrap;
}

.json-filter-wizard-items-center {
  align-items: center;
}

.json-filter-wizard-justify-between {
  justify-content: space-between;
}

.json-filter-wizard-justify-end {
  justify-content: flex-end;
}

.json-filter-wizard-gap-1 {
  gap: var(--spacing-1);
}

.json-filter-wizard-gap-2 {
  gap: var(--spacing-2);
}

.json-filter-wizard-gap-3 {
  gap: var(--spacing-3);
}

.json-filter-wizard-gap-4 {
  gap: var(--spacing-4);
}

.json-filter-wizard-mb-1 {
  margin-bottom: var(--spacing-1);
}

.json-filter-wizard-mb-2 {
  margin-bottom: var(--spacing-2);
}

.json-filter-wizard-mb-3 {
  margin-bottom: var(--spacing-3);
}

.json-filter-wizard-mb-4 {
  margin-bottom: var(--spacing-4);
}

.json-filter-wizard-mt-3 {
  margin-top: var(--spacing-3);
}

.json-filter-wizard-mt-4 {
  margin-top: var(--spacing-4);
}

.json-filter-wizard-mr-1 {
  margin-right: var(--spacing-1);
}

.json-filter-wizard-mr-2 {
  margin-right: var(--spacing-2);
}

.json-filter-wizard-ml-auto {
  margin-left: auto;
}

.json-filter-wizard-p-2 {
  padding: var(--spacing-2);
}

.json-filter-wizard-p-3 {
  padding: var(--spacing-3);
}

.json-filter-wizard-p-4 {
  padding: var(--spacing-4);
}

.json-filter-wizard-py-1 {
  padding-top: var(--spacing-1);
  padding-bottom: var(--spacing-1);
}

.json-filter-wizard-py-2 {
  padding-top: var(--spacing-2);
  padding-bottom: var(--spacing-2);
}

.json-filter-wizard-px-2 {
  padding-left: var(--spacing-2);
  padding-right: var(--spacing-2);
}

.json-filter-wizard-px-3 {
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
}

.json-filter-wizard-px-4 {
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

.json-filter-wizard-text-sm {
  font-size: 0.875rem;
}

.json-filter-wizard-text-base {
  font-size: 1rem;
}

.json-filter-wizard-text-lg {
  font-size: 1.125rem;
}

.json-filter-wizard-text-xl {
  font-size: 1.25rem;
}

.json-filter-wizard-font-medium {
  font-weight: 500;
}

.json-filter-wizard-font-semibold {
  font-weight: 600;
}

.json-filter-wizard-text-center {
  text-align: center;
}

.json-filter-wizard-text-left {
  text-align: left;
}

.json-filter-wizard-text-white {
  color: white;
}

.json-filter-wizard-text-danger {
  color: var(--danger-color);
}

.json-filter-wizard-text-muted {
  color: var(--text-muted);
}

.json-filter-wizard-text-primary {
  color: var(--primary-color);
}

.json-filter-wizard-bg-white {
  background-color: var(--bg-color);
}

.json-filter-wizard-bg-offset {
  background-color: var(--bg-color-offset);
}

.json-filter-wizard-bg-muted {
  background-color: var(--bg-color-muted);
}

.json-filter-wizard-bg-primary {
  background-color: var(--primary-color);
}

.json-filter-wizard-bg-danger {
  background-color: var(--danger-color);
}

.json-filter-wizard-bg-warning {
  background-color: var(--warning-color);
}

.json-filter-wizard-bg-success {
  background-color: var(--success-color);
}

.json-filter-wizard-bg-warning-light {
  background-color: rgba(245, 158, 11, 0.1);
}

.json-filter-wizard-border {
  border: 1px solid var(--border-color);
}

.json-filter-wizard-border-b {
  border-bottom: 1px solid var(--border-color);
}

.json-filter-wizard-rounded-sm {
  border-radius: var(--radius-sm);
}

.json-filter-wizard-rounded-md {
  border-radius: var(--radius-md);
}

.json-filter-wizard-rounded-lg {
  border-radius: var(--radius-lg);
}

.json-filter-wizard-rounded-full {
  border-radius: 9999px;
}

.json-filter-wizard-shadow-sm {
  box-shadow: var(--shadow-sm);
}

.json-filter-wizard-shadow-md {
  box-shadow: var(--shadow-md);
}

.json-filter-wizard-shadow-lg {
  box-shadow: var(--shadow-lg);
}

.json-filter-wizard-w-full {
  width: 100%;
}

.json-filter-wizard-h-full {
  height: 100%;
}

.json-filter-wizard-h-4 {
  height: 1rem;
}

.json-filter-wizard-h-5 {
  height: 1.25rem;
}

.json-filter-wizard-h-8 {
  height: 2rem;
}

.json-filter-wizard-h-10 {
  height: 2.5rem;
}

.json-filter-wizard-w-4 {
  width: 1rem;
}

.json-filter-wizard-w-5 {
  width: 1.25rem;
}

.json-filter-wizard-w-8 {
  width: 2rem;
}

.json-filter-wizard-w-10 {
  width: 2.5rem;
}

.json-filter-wizard-w-full {
  width: 100%;
}

.json-filter-wizard-min-w-\\[150px\\] {
  min-width: 150px;
}

.json-filter-wizard-min-w-\\[200px\\] {
  min-width: 200px;
}

.json-filter-wizard-min-h-\\[300px\\] {
  min-height: 300px;
}

.json-filter-wizard-max-h-\\[300px\\] {
  max-height: 300px;
}

.json-filter-wizard-max-h-\\[400px\\] {
  max-height: 400px;
}

.json-filter-wizard-overflow-auto {
  overflow: auto;
}

.json-filter-wizard-overflow-hidden {
  overflow: hidden;
}

.json-filter-wizard-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.json-filter-wizard-whitespace-pre-wrap {
  white-space: pre-wrap;
}

.json-filter-wizard-relative {
  position: relative;
}

.json-filter-wizard-absolute {
  position: absolute;
}

.json-filter-wizard-inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.json-filter-wizard-top-0 {
  top: 0;
}

.json-filter-wizard-right-0 {
  right: 0;
}

.json-filter-wizard-bottom-0 {
  bottom: 0;
}

.json-filter-wizard-left-0 {
  left: 0;
}

.json-filter-wizard-top-1\\/2 {
  top: 50%;
}

.json-filter-wizard--translate-y-1\\/2 {
  transform: translateY(-50%);
}

.json-filter-wizard-hidden {
  display: none;
}

.json-filter-wizard-block {
  display: block;
}

.json-filter-wizard-inline-block {
  display: inline-block;
}

.json-filter-wizard-inline-flex {
  display: inline-flex;
}

.json-filter-wizard-space-x-2 > * + * {
  margin-left: var(--spacing-2);
}

.json-filter-wizard-space-y-2 > * + * {
  margin-top: var(--spacing-2);
}

.json-filter-wizard-space-y-3 > * + * {
  margin-top: var(--spacing-3);
}

.json-filter-wizard-space-y-4 > * + * {
  margin-top: var(--spacing-4);
}

.json-filter-wizard-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  padding: var(--spacing-2) var(--spacing-4);
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  cursor: pointer;
}

.json-filter-wizard-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.json-filter-wizard-btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.json-filter-wizard-btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.json-filter-wizard-btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
}

.json-filter-wizard-btn-outline:hover:not(:disabled) {
  background-color: var(--bg-color-muted);
}

.json-filter-wizard-btn-danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.json-filter-wizard-btn-danger:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.1);
}

.json-filter-wizard-btn-success {
  color: var(--success-color);
  border-color: var(--success-color);
}

.json-filter-wizard-btn-success:hover:not(:disabled) {
  background-color: rgba(34, 197, 94, 0.1);
}

.json-filter-wizard-btn-warning {
  color: var(--warning-color);
  border-color: var(--warning-color);
}

.json-filter-wizard-btn-warning:hover:not(:disabled) {
  background-color: rgba(245, 158, 11, 0.1);
}

.json-filter-wizard-btn-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.json-filter-wizard-btn-primary:hover:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.1);
}

.json-filter-wizard-btn-sm {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: 0.75rem;
}

.json-filter-wizard-btn-icon {
  padding: var(--spacing-2);
}

.json-filter-wizard-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.75rem;
  padding: var(--spacing-1) var(--spacing-2);
}

.json-filter-wizard-badge-outline {
  background-color: transparent;
  border: 1px solid var(--border-color);
}

.json-filter-wizard-badge-blue {
  background-color: rgba(59, 130, 246, 0.1);
  color: rgb(37, 99, 235);
}

.json-filter-wizard-badge-red {
  background-color: rgba(239, 68, 68, 0.1);
  color: rgb(220, 38, 38);
}

.json-filter-wizard-badge-green {
  background-color: rgba(34, 197, 94, 0.1);
  color: rgb(22, 163, 74);
}

.json-filter-wizard-badge-gray {
  background-color: rgba(107, 114, 128, 0.1);
  color: rgb(75, 85, 99);
}

.json-filter-wizard-input {
  display: block;
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 0.875rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: border-color 0.2s;
}

.json-filter-wizard-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.json-filter-wizard-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.json-filter-wizard-select-wrapper {
  position: relative;
  width: 100%;
}

.json-filter-wizard-select {
  appearance: none;
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  padding-right: 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 0.875rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: border-color 0.2s;
  cursor: pointer;
}

.json-filter-wizard-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.json-filter-wizard-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.json-filter-wizard-select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
}

.json-filter-wizard-pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  margin: 0;
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  background-color: var(--bg-color-offset);
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}

.json-filter-wizard-tabs {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-4);
}

.json-filter-wizard-tab {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
  margin-right: var(--spacing-2);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: -1px;
}

.json-filter-wizard-tab-active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.json-filter-wizard-tab:hover:not(.json-filter-wizard-tab-active) {
  color: var(--text-color);
}

.json-filter-wizard-progress {
  width: 100%;
  height: 0.5rem;
  background-color: var(--bg-color-muted);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.json-filter-wizard-progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.json-filter-wizard-progress-indeterminate .json-filter-wizard-progress-bar {
  width: 50%;
  animation: json-filter-wizard-progress-indeterminate 1.5s ease infinite;
}

@keyframes json-filter-wizard-progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.json-filter-wizard-skeleton {
  border-radius: var(--radius-md);
  background-color: var(--bg-color-muted);
  animation: json-filter-wizard-skeleton-pulse 1.5s ease infinite;
}

@keyframes json-filter-wizard-skeleton-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.json-filter-wizard-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (min-width: 640px) {
  .json-filter-wizard-sm\\:flex {
    display: flex;
  }
  .json-filter-wizard-sm\\:text-left {
    text-align: left;
  }
}
`;

// Type definitions
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

interface FilterState {
  rootGroup: FilterGroup;
}

// Describing a field with its path and detected type
interface FieldInfo {
  path: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';
  sample?: any;
}

// Context for toast notifications
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
}

interface ToastContextProps {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Create context for toasts
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Toast hook
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast provider component
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="json-filter-wizard-fixed json-filter-wizard-bottom-0 json-filter-wizard-right-0 json-filter-wizard-p-4 json-filter-wizard-space-y-3 json-filter-wizard-z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`json-filter-wizard-p-4 json-filter-wizard-rounded-md json-filter-wizard-shadow-md json-filter-wizard-flex json-filter-wizard-items-center json-filter-wizard-justify-between
              ${toast.variant === 'destructive' ? 'json-filter-wizard-bg-danger-light json-filter-wizard-text-danger' : 
                toast.variant === 'success' ? 'json-filter-wizard-bg-success-light json-filter-wizard-text-success' : 
                'json-filter-wizard-bg-white'}`}
          >
            <div>
              <div className="json-filter-wizard-font-semibold">{toast.title}</div>
              {toast.description && <div className="json-filter-wizard-text-sm">{toast.description}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="json-filter-wizard-ml-4 json-filter-wizard-text-muted"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="json-filter-wizard-sr-only">Close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Toast component
const toast = {
  default: (props: { title: string; description?: string }) => {
    const { addToast } = useToast();
    addToast({ ...props, variant: 'default' });
  },
  success: (props: { title: string; description?: string }) => {
    const { addToast } = useToast();
    addToast({ ...props, variant: 'success' });
  },
  error: (props: { title: string; description?: string }) => {
    const { addToast } = useToast();
    addToast({ ...props, variant: 'destructive' });
  },
};

// Utility functions
const createEmptyGroup = (operator: FilterOperator = 'AND'): FilterGroup => ({
  id: uuidv4(),
  operator,
  conditions: [],
  groups: []
});

const createEmptyCondition = (): FilterCondition => ({
  id: uuidv4(),
  field: '',
  operator: 'equals',
  value: '',
});

const getValueByPath = (obj: any, path: string): any => {
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

const extractFields = (data: any, path = '', result: FieldInfo[] = []): FieldInfo[] => {
  if (data === null) {
    result.push({ path, type: 'null' });
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    // It's an object
    Object.keys(data).forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      const value = data[key];
      
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

const extractFieldsFromArray = (data: any[]): FieldInfo[] => {
  if (!data || !data.length) return [];
  
  // Use the first item to extract fields
  const firstItem = data[0];
  return extractFields(firstItem);
};

const getUniqueFieldValues = (data: any[], fieldPath: string): any[] => {
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

// Filtering logic functions
const evaluateCondition = (item: any, condition: FilterCondition): boolean => {
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

const filterData = (data: any[], rootGroup: FilterGroup): any[] => {
  if (!data || !data.length) return [];
  
  // Filter the data
  return data.filter(item => evaluateGroup(item, rootGroup));
};

// Tab component
interface TabProps {
  children: React.ReactNode;
  value: string;
  currentTab: string;
  onClick: (value: string) => void;
  icon?: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children, value, currentTab, onClick, icon }) => {
  return (
    <button
      className={`json-filter-wizard-tab ${currentTab === value ? 'json-filter-wizard-tab-active' : ''}`}
      onClick={() => onClick(value)}
    >
      {icon}
      {children}
    </button>
  );
};

// Badge component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'red' | 'green' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue' }) => {
  return (
    <span className={`json-filter-wizard-badge json-filter-wizard-badge-${variant}`}>
      {children}
    </span>
  );
};

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  leftIcon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`json-filter-wizard-btn json-filter-wizard-btn-${variant} ${size === 'sm' ? 'json-filter-wizard-btn-sm' : ''} ${size === 'icon' ? 'json-filter-wizard-btn-icon' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="json-filter-wizard-animate-spin json-filter-wizard-mr-2 json-filter-wizard-h-4 json-filter-wizard-w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="json-filter-wizard-opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="json-filter-wizard-opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : leftIcon ? (
        <span className="json-filter-wizard-mr-2">{leftIcon}</span>
      ) : null}
      {children}
    </button>
  );
};

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`json-filter-wizard-input ${className}`}
      {...props}
    />
  );
};

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
  return (
    <div className="json-filter-wizard-select-wrapper">
      <select
        className={`json-filter-wizard-select ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="json-filter-wizard-select-icon">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

// Progress component
interface ProgressProps {
  value?: number;
  indeterminate?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ value = 0, indeterminate = false }) => {
  return (
    <div className={`json-filter-wizard-progress ${indeterminate ? 'json-filter-wizard-progress-indeterminate' : ''}`}>
      <div
        className="json-filter-wizard-progress-bar"
        style={{ width: indeterminate ? undefined : `${value}%` }}
      ></div>
    </div>
  );
};

// Skeleton component
interface SkeletonProps {
  className?: string;
  height?: number | string;
  width?: number | string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', height = '1rem', width = '100%' }) => {
  return (
    <div
      className={`json-filter-wizard-skeleton ${className}`}
      style={{ height, width }}
    ></div>
  );
};

// FilterConditionRow component
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
    const allOperators: { value: ComparisonOperator; label: string }[] = [
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
  
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
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
  
  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({
      ...condition,
      operator: e.target.value as ComparisonOperator
    });
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onUpdate({
      ...condition,
      value: e.target.value
    });
  };
  
  // Filter out operators that don't need values
  const needsValue = !['exists', 'notExists'].includes(condition.operator);
  
  return (
    <div className="json-filter-wizard-flex json-filter-wizard-flex-wrap json-filter-wizard-items-center json-filter-wizard-gap-2 json-filter-wizard-mb-3 json-filter-wizard-p-2 json-filter-wizard-border json-filter-wizard-rounded-md json-filter-wizard-bg-white">
      {/* Field selector */}
      <div className="json-filter-wizard-flex-grow json-filter-wizard-min-w-[200px]">
        <Select 
          value={condition.field} 
          onChange={handleFieldChange}
        >
          <option value="">Select field</option>
          {fields.map(field => (
            <option key={field.path} value={field.path}>
              {field.path} ({field.type})
            </option>
          ))}
        </Select>
      </div>
      
      {/* Operator selector */}
      <div className="json-filter-wizard-flex-grow json-filter-wizard-min-w-[150px]">
        <Select 
          value={condition.operator} 
          onChange={handleOperatorChange}
          disabled={!condition.field}
        >
          <option value="">Select operator</option>
          {getOperatorsForType(currentField?.type).map(op => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </Select>
      </div>
      
      {/* Value input or selector */}
      {needsValue && (
        <div className="json-filter-wizard-flex-grow json-filter-wizard-min-w-[200px]">
          {possibleValues.length > 0 && ['equals', 'notEquals'].includes(condition.operator) ? (
            <Select
              value={String(condition.value)}
              onChange={handleValueChange}
              disabled={!condition.field || !condition.operator}
            >
              <option value="">Select value</option>
              {possibleValues.map((val, index) => (
                <option key={index} value={String(val)}>
                  {String(val)}
                </option>
              ))}
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
      <div className="json-filter-wizard-flex json-filter-wizard-gap-1">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onDelete} 
          className="json-filter-wizard-text-danger"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
        
        {isLast && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onAdd}
            className="json-filter-wizard-text-primary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};

// FilterGroup component
interface FilterGroupProps {
  group: FilterGroup;
  fields: FieldInfo[];
  data: any[];
  onChange: (updated: FilterGroup) => void;
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
  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...group,
      operator: e.target.value as FilterOperator
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
  const handleUpdateGroup = (index: number, updated: FilterGroup) => {
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
    <div className={`json-filter-wizard-mb-4 json-filter-wizard-border json-filter-wizard-rounded-md json-filter-wizard-shadow-sm ${depth > 0 ? 'json-filter-wizard-border-l-4 json-filter-wizard-border-l-primary' : ''}`}>
      <div className="json-filter-wizard-p-3 json-filter-wizard-pb-0">
        <div className="json-filter-wizard-flex json-filter-wizard-items-center json-filter-wizard-justify-between">
          <div className="json-filter-wizard-text-md json-filter-wizard-font-medium">
            {isRoot ? 'Filter Conditions' : 'Condition Group'}
          </div>
          
          {!isRoot && onDelete && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onDelete}
              className="json-filter-wizard-h-8 json-filter-wizard-w-8 json-filter-wizard-text-danger"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      
      <div className="json-filter-wizard-p-3">
        {/* Operator selector */}
        <div className="json-filter-wizard-mb-3">
          <div className="json-filter-wizard-flex json-filter-wizard-items-center json-filter-wizard-gap-2">
            <span className="json-filter-wizard-text-sm json-filter-wizard-font-medium">Match</span>
            <Select
              value={group.operator}
              onChange={handleOperatorChange}
              className="json-filter-wizard-w-[150px]"
            >
              <option value="AND">ALL conditions (AND)</option>
              <option value="OR">ANY condition (OR)</option>
            </Select>
            <span className="json-filter-wizard-text-sm json-filter-wizard-font-medium">of the following:</span>
          </div>
        </div>
        
        {/* List of conditions */}
        {group.conditions.length === 0 && group.groups.length === 0 && (
          <div className="json-filter-wizard-text-center json-filter-wizard-py-2 json-filter-wizard-text-muted json-filter-wizard-bg-offset json-filter-wizard-rounded-md">
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
        <div className="json-filter-wizard-flex json-filter-wizard-flex-wrap json-filter-wizard-gap-2 json-filter-wizard-mt-3">
          {group.conditions.length === 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddCondition}
              className="json-filter-wizard-text-primary"
              leftIcon={(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            >
              Add Condition
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddGroup}
            className="json-filter-wizard-text-primary"
            leftIcon={(
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 3H15M9 3V9M3 9V15M3 9H9M3 15V19C3 20.1046 3.89543 21 5 21H9M3 15H9M9 21H15M9 21V15M9.00001 9V15M9.00001 15H15M21 3H15M21 3V9M21 3H15M15 3V9M15 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          >
            Add Condition Group
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main component
interface StandaloneJsonFilterWizardProps {
  data: any[];
  onFilterChange?: (filteredData: any[]) => void;
  title?: string;
  description?: string;
  className?: string;
}

const StandaloneJsonFilterWizard: React.FC<StandaloneJsonFilterWizardProps> = ({
  data,
  onFilterChange,
  title = "JSON Filter Wizard",
  description = "Create filters to search and filter your data",
  className = ""
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
  const [currentTab, setCurrentTab] = useState('builder');
  const { addToast } = useToast();
  
  // Insert CSS into the document
  useEffect(() => {
    // Create a style element for isolated CSS
    const styleElement = document.createElement('style');
    styleElement.innerHTML = isolatedStyles;
    document.head.appendChild(styleElement);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
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
  const handleFilterChange = (rootGroup: FilterGroup) => {
    setPendingFilterState({ rootGroup });
  };
  
  // Apply the pending filter
  const handleApplyFilter = () => {
    setIsFiltering(true);
    setFilterState(pendingFilterState);
    
    const startTime = performance.now();
    try {
      const results = filterData(data, pendingFilterState.rootGroup);
      const endTime = performance.now();
      
      setFilteredData(results);
      if (onFilterChange) {
        onFilterChange(results);
      }
      setProcessingTime(endTime - startTime);
      
      addToast({
        title: "Filter Applied",
        description: "Filter conditions have been applied.",
        variant: "success"
      });
    } catch (error) {
      addToast({
        title: "Filter Error",
        description: error instanceof Error ? error.message : "An error occurred while filtering",
        variant: "destructive"
      });
    } finally {
      setIsFiltering(false);
    }
  };
  
  // Reset the filter
  const handleResetFilter = () => {
    const emptyGroup = createEmptyGroup();
    setFilterState({ rootGroup: emptyGroup });
    setPendingFilterState({ rootGroup: emptyGroup });
    setFilteredData(data);
    if (onFilterChange) {
      onFilterChange(data);
    }
    setProcessingTime(null);
    
    addToast({
      title: "Filter Reset",
      description: "All filter conditions have been cleared.",
      variant: "success"
    });
  };
  
  // Apply JSON filter from text
  const handleApplyJsonFilter = () => {
    try {
      const parsed = JSON.parse(jsonFilterString);
      setPendingFilterState({ rootGroup: parsed });
      // Don't apply filter immediately, let user click Apply
      addToast({
        title: "Filter Loaded",
        description: "JSON filter has been loaded. Click 'Apply Filter' to use it.",
        variant: "success"
      });
    } catch (error) {
      addToast({
        title: "Invalid JSON",
        description: "The provided JSON is not valid. Please check the format.",
        variant: "destructive"
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
    
    addToast({
      title: "Filter Exported",
      description: "Filter configuration has been downloaded as JSON.",
      variant: "success"
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
        addToast({
          title: "Filter Imported",
          description: "Filter configuration has been imported. Click 'Apply Filter' to use it.",
          variant: "success"
        });
      } catch (error) {
        addToast({
          title: "Import Failed",
          description: "Failed to import filter. The file may not contain valid JSON.",
          variant: "destructive"
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
    addToast({
      title: "Copied",
      description: "Filter JSON copied to clipboard",
      variant: "success"
    });
  };
  
  return (
    <ToastProvider>
      <div className={`json-filter-wizard-container ${className}`}>
        <div className="json-filter-wizard-card">
          <div className="json-filter-wizard-card-header">
            <div className="json-filter-wizard-flex json-filter-wizard-justify-between json-filter-wizard-items-center">
              <div>
                <h3 className="json-filter-wizard-card-title">{title}</h3>
                <p className="json-filter-wizard-card-description">{description}</p>
              </div>
              <div className="json-filter-wizard-flex json-filter-wizard-items-center json-filter-wizard-gap-2">
                <Badge variant="blue">
                  {filteredData.length} of {data.length} items
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetFilter}
                  className="json-filter-wizard-text-danger"
                  leftIcon={(
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          <div className="json-filter-wizard-card-content">
            {isFiltering && (
              <div className="json-filter-wizard-mb-4">
                <div className="json-filter-wizard-flex json-filter-wizard-justify-between json-filter-wizard-mb-1">
                  <span className="json-filter-wizard-text-sm">Filtering data...</span>
                  <span className="json-filter-wizard-text-sm">{data.length} records</span>
                </div>
                <Progress indeterminate />
              </div>
            )}
            
            {processingTime !== null && !isFiltering && (
              <div className="json-filter-wizard-mb-4 json-filter-wizard-bg-offset json-filter-wizard-p-2 json-filter-wizard-rounded-md json-filter-wizard-text-sm json-filter-wizard-text-muted">
                Filtering completed in {processingTime.toFixed(2)}ms 
                ({filteredData.length} of {data.length} records matched)
              </div>
            )}
          
            <div className="json-filter-wizard-tabs">
              <Tab
                value="builder"
                currentTab={currentTab}
                onClick={setCurrentTab}
                icon={(
                  <svg width="16" height="16" className="json-filter-wizard-mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4V10C11 10.5523 10.5523 11 10 11H4C3.44772 11 3 10.5523 3 10V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 14C3 13.4477 3.44772 13 4 13H10C10.5523 13 11 13.4477 11 14V20C11 20.5523 10.5523 21 10 21H4C3.44772 21 3 20.5523 3 20V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11H14C13.4477 11 13 10.5523 13 10V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 14C13 13.4477 13.4477 13 14 13H20C20.5523 13 21 13.4477 21 14V20C21 20.5523 20.5523 21 20 21H14C13.4477 21 13 20.5523 13 20V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              >
                Filter Builder
              </Tab>
              <Tab
                value="json"
                currentTab={currentTab}
                onClick={setCurrentTab}
                icon={(
                  <svg width="16" height="16" className="json-filter-wizard-mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              >
                JSON View
              </Tab>
            </div>
            
            {currentTab === 'builder' ? (
              <div className="json-filter-wizard-space-y-4">
                {isFiltering ? (
                  <Skeleton className="json-filter-wizard-h-[300px] json-filter-wizard-w-full" />
                ) : (
                  <FilterGroup
                    group={pendingFilterState.rootGroup}
                    fields={fields}
                    data={data}
                    onChange={handleFilterChange}
                  />
                )}
                
                <div className="json-filter-wizard-flex json-filter-wizard-justify-end json-filter-wizard-mt-4">
                  <Button 
                    onClick={handleApplyFilter}
                    disabled={isFiltering}
                    isLoading={isFiltering}
                    leftIcon={!isFiltering ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 4.5C3 3.12 4.12 2 5.5 2H18.5C19.88 2 21 3.12 21 4.5V19.5C21 20.88 19.88 22 18.5 22H5.5C4.12 22 3 20.88 3 19.5V4.5ZM5.5 4C5.22 4 5 4.22 5 4.5V19.5C5 19.78 5.22 20 5.5 20H18.5C18.78 20 19 19.78 19 19.5V4.5C19 4.22 18.78 4 18.5 4H5.5Z" fill="currentColor"/>
                        <path d="M10.02 12.77L7.93 10.68C7.61 10.36 7.1 10.36 6.78 10.68C6.46 11 6.46 11.51 6.78 11.83L9.43 14.48C9.75 14.8 10.29 14.8 10.61 14.48L17.21 7.88C17.53 7.56 17.53 7.05 17.21 6.73C16.89 6.41 16.38 6.41 16.06 6.73L10.02 12.77Z" fill="currentColor"/>
                      </svg>
                    ) : undefined}
                  >
                    {isFiltering ? 'Filtering...' : 'Apply Filter'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="json-filter-wizard-space-y-4">
                <div className="json-filter-wizard-flex json-filter-wizard-gap-2 json-filter-wizard-flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleApplyJsonFilter}
                    disabled={isFiltering}
                    className="json-filter-wizard-text-primary"
                    leftIcon={(
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  >
                    Load JSON
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportFilter}
                    className="json-filter-wizard-text-primary"
                    leftIcon={(
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H18C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17V16M16 12L12 16M12 16L8 12M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  >
                    Export
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyJson}
                    className="json-filter-wizard-text-primary"
                    leftIcon={(
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10M20 14H10M10 14L13 11M10 14L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  >
                    Copy
                  </Button>
                  
                  <div className="json-filter-wizard-relative">
                    <input
                      type="file"
                      id="import-filter"
                      accept=".json"
                      onChange={handleImportFilter}
                      className="json-filter-wizard-absolute json-filter-wizard-inset-0 json-filter-wizard-w-full json-filter-wizard-h-full json-filter-wizard-opacity-0 json-filter-wizard-cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="json-filter-wizard-text-primary"
                      leftIcon={(
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 16V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H18C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17V16M12 4V16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    >
                      Import
                    </Button>
                  </div>
                </div>
                
                <div className="json-filter-wizard-border json-filter-wizard-rounded-md json-filter-wizard-p-2 json-filter-wizard-bg-offset">
                  <div className="json-filter-wizard-overflow-auto json-filter-wizard-max-h-[300px]">
                    <pre className="json-filter-wizard-pre">{jsonFilterString}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="json-filter-wizard-card-footer">
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setFilteredData(data);
                  if (onFilterChange) {
                    onFilterChange(data);
                  }
                  addToast({
                    title: "Data Refreshed",
                    description: "The data source has been refreshed.",
                    variant: "success"
                  });
                }}
                className="json-filter-wizard-flex json-filter-wizard-items-center"
                disabled={isFiltering}
                leftIcon={(
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C7.52441 2 3.73407 4.94288 2.45874 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 5V9H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default StandaloneJsonFilterWizard;
