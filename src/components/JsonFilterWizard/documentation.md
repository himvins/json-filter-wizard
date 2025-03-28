
# JSON Filter Wizard Documentation

## Overview

The JSON Filter Wizard is a React component library for creating complex filter queries against JSON data. It provides a visual interface for building filter conditions and groups, with support for various operators and nested logic. This component is optimized for handling large datasets with Web Worker support to prevent UI blocking.

## Core Components

### 1. JsonFilterWizard

**Purpose**: Main component that provides the complete filtering experience.

**File**: `JsonFilterWizard.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | any[] | Yes | Array of JSON objects to filter |
| onFilterChange | (filteredData: any[]) => void | No | Callback when filtered data changes |
| title | string | No | Custom title for the component (default: "JSON Filter Wizard") |
| description | string | No | Custom description text (default: "Create filters to search and filter your data") |

**Features**:
- Visual filter builder with intuitive UI
- JSON view for direct editing of filter configuration
- Import/export filter configurations
- Web Worker support for handling large datasets (10,000+ records)
- Performance metrics and progress indicators
- Batch processing to prevent UI freezing
- Automatic field discovery from provided data

**Internal State**:
- `fields`: Discovered fields from the data
- `filterState`: Current applied filter configuration
- `pendingFilterState`: Filter configuration not yet applied
- `filteredData`: Results after applying the filter
- `isFiltering`: Loading state during filter operations
- `processingTime`: Performance metric for filter operations

**Usage Example**:
```tsx
import { JsonFilterWizard } from '@/components/JsonFilterWizard';

const MyComponent = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Item 1', category: 'A', price: 10 },
    { id: 2, name: 'Item 2', category: 'B', price: 20 },
    // ...more items
  ]);
  
  const [filteredData, setFilteredData] = useState(data);
  
  return (
    <JsonFilterWizard 
      data={data} 
      onFilterChange={setFilteredData}
      title="Product Filter"
      description="Filter products by various criteria"
    />
  );
};
```

### 2. FilterGroup

**Purpose**: Manages a group of conditions with AND/OR logic between them.

**File**: `FilterGroup.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| group | FilterGroup | Yes | Filter group configuration |
| fields | FieldInfo[] | Yes | Available fields from the data |
| data | any[] | Yes | Original data array |
| onChange | (updated: FilterGroup) => void | Yes | Callback when group changes |
| onDelete | () => void | No | Callback to delete this group |
| depth | number | No | Nesting level of the group (default: 0) |

**Features**:
- Switch between AND/OR logic for condition evaluation
- Add/remove individual conditions
- Add/remove nested condition groups
- Visual UI with indentation for nested groups

**Usage Notes**:
- The root filter group (depth=0) cannot be deleted
- Nested groups can be added to any depth, but consider UI complexity
- Empty groups match everything by default

### 3. FilterConditionRow

**Purpose**: Renders a single filter condition with field, operator, and value inputs.

**File**: `FilterConditionRow.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| condition | FilterCondition | Yes | The condition configuration |
| fields | FieldInfo[] | Yes | Available fields from the data |
| data | any[] | Yes | Original data array |
| onUpdate | (updated: FilterCondition) => void | Yes | Callback when condition changes |
| onDelete | () => void | Yes | Callback to delete this condition |
| onAdd | () => void | Yes | Callback to add a new condition |
| isLast | boolean | Yes | Whether this is the last condition in a group |

**Features**:
- Dynamic operator options based on field type
- Value suggestions based on actual data
- Field auto-detection with type information
- Different input types based on field type (text, number, select)

## Web Worker Implementation

### filterWorker.ts

**Purpose**: Processes filter operations in a background thread to prevent UI blocking.

**File**: `filterWorker.ts`

**Key Functions**:
- `evaluateGroup(item, group)`: Recursively evaluates if an item matches a filter group
- `evaluateCondition(item, condition)`: Evaluates a single condition against an item
- `filterData(data, rootGroup)`: Main filter function with batch processing support

**Optimization Techniques**:
- Batch processing (5000 items at a time)
- Progress reporting for large datasets
- Performance metrics calculation
- Error handling with structured error responses

**Communication Protocol**:
1. **Input Message Structure**:
   ```js
   {
     data: Array,       // Source data to filter
     filter: Object     // Filter configuration (FilterGroup)
   }
   ```

2. **Output Message Types**:
   - Progress updates:
     ```js
     {
       type: 'progress',
       progress: Number,      // Percentage complete (0-100)
       currentCount: Number,  // Items filtered so far
       processedCount: Number,// Items processed so far
       totalCount: Number     // Total items to process
     }
     ```
   - Results:
     ```js
     {
       type: 'result',
       data: Array,           // Filtered results
       count: Number,         // Number of matches
       totalCount: Number,    // Total items processed
       processingTime: Number // Processing time in milliseconds
     }
     ```
   - Errors:
     ```js
     {
       type: 'error',
       error: String          // Error message
     }
     ```

## Core Types and Interfaces

### FilterGroup

**Interface**:
```typescript
interface FilterGroup {
  id: string;               // Unique identifier
  operator: 'AND' | 'OR';   // Logical operator for combining conditions
  conditions: FilterCondition[]; // List of conditions in this group
  groups: FilterGroup[];    // Nested filter groups
}
```

### FilterCondition

**Interface**:
```typescript
interface FilterCondition {
  id: string;               // Unique identifier
  field: string;            // Field path in dot notation (e.g., "user.address.city")
  operator: ComparisonOperator; // Operator for comparison
  value: any;               // Value to compare against
}
```

### ComparisonOperator

**Type**:
```typescript
type ComparisonOperator = 
  | 'equals'       // Exact match
  | 'notEquals'    // Not an exact match
  | 'contains'     // String contains value
  | 'notContains'  // String does not contain value
  | 'greaterThan'  // Numeric comparison: >
  | 'lessThan'     // Numeric comparison: <
  | 'in'           // Value in a list
  | 'notIn'        // Value not in a list
  | 'exists'       // Field exists
  | 'notExists'    // Field does not exist
  | 'startsWith'   // String starts with value
  | 'endsWith';    // String ends with value
```

### FieldInfo

**Interface**:
```typescript
interface FieldInfo {
  path: string;    // Field path in dot notation
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null'; // Data type
  sample?: any;    // Sample value from the data
}
```

## Utility Functions

### createEmptyGroup

**Purpose**: Creates a new empty filter group

**Usage**:
```typescript
const newGroup = createEmptyGroup('AND'); // or 'OR'
```

### createEmptyCondition

**Purpose**: Creates a new empty filter condition

**Usage**:
```typescript
const newCondition = createEmptyCondition();
```

### extractFieldsFromArray

**Purpose**: Automatically discovers fields and their types from an array of objects

**Usage**:
```typescript
const fields = extractFieldsFromArray(data);
```

### getValueByPath

**Purpose**: Retrieves a value from an object by dot notation path

**Usage**:
```typescript
const value = getValueByPath(item, 'user.address.city');
```

### getUniqueFieldValues

**Purpose**: Extracts all unique values for a specific field from the dataset

**Usage**:
```typescript
const possibleValues = getUniqueFieldValues(data, 'category');
```

### createFilterWorker

**Purpose**: Creates a Web Worker instance for filtering

**Usage**:
```typescript
const worker = await createFilterWorker();
```

## Advanced Usage Scenarios

### 1. Creating Complex Nested Filters

You can create complex filters with multiple levels of nesting:

```typescript
const complexFilter = {
  id: "root",
  operator: "AND",
  conditions: [],
  groups: [
    {
      id: "group1",
      operator: "OR",
      conditions: [
        {
          id: "cond1",
          field: "status",
          operator: "equals",
          value: "SUCCESS"
        },
        {
          id: "cond2",
          field: "priority",
          operator: "greaterThan",
          value: 5
        }
      ],
      groups: []
    },
    {
      id: "group2", 
      operator: "AND",
      conditions: [
        {
          id: "cond3",
          field: "owner",
          operator: "equals",
          value: "admin"
        }
      ],
      groups: []
    }
  ]
};
```

This filter matches items that:
- Have status "SUCCESS" OR priority > 5
- AND have owner "admin"

### 2. Handling Very Large Datasets

When dealing with extremely large datasets (100,000+ records), consider these strategies:

1. **Server-side filtering**: For truly massive datasets, consider moving the filtering to the server
2. **Progressive loading**: Load and filter data in chunks from an API
3. **Virtualized rendering**: Use virtualization for displaying results

### 3. Custom Field Types and Operators

The filter system can be extended with custom operators for specific field types:

```typescript
// Example of extending evaluateCondition for date comparison
case 'afterDate':
  return new Date(actualValue) > new Date(value);
  
case 'beforeDate':
  return new Date(actualValue) < new Date(value);
```

## Performance Optimization Tips

1. **Limit unnecessary re-renders**:
   - Only apply filters after explicit user action
   - Debounce real-time filtering for larger datasets

2. **Field indexing**:
   - For repeated filtering on the same fields, consider building indexes

3. **Memory management**:
   - Be cautious with very large datasets (100,000+ items)
   - Consider pagination or virtualization for displaying results

## Browser Compatibility

The JSON Filter Wizard works in all modern browsers. The Web Worker implementation has a fallback mechanism for environments where Web Workers are not supported.

## Error Handling

The component handles various error scenarios:
- Invalid JSON in the filter configuration
- Web Worker initialization failures
- Runtime errors during filtering operations

Error feedback is provided through the UI with appropriate messaging.

## Styling Customization

The component uses Tailwind CSS and can be customized through:
1. Custom Tailwind classes
2. Overriding the shadcn/ui theme
3. Custom CSS targeting the component classes

## Accessibility Considerations

The component follows accessibility best practices:
- Proper keyboard navigation
- ARIA attributes for interactive elements
- Color contrast compliance
- Meaningful labels and descriptions
