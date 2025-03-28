
# JSON Filter Wizard

A powerful React component for building and applying complex filters to JSON data.

## Features

- Visual filter builder with intuitive UI
- Support for nested condition groups with AND/OR logic
- Wide range of comparison operators
- JSON editor for direct manipulation of filter configuration
- Import/export filter configurations
- Web Worker support for handling large datasets
- Progress indicators and performance metrics
- Automatic field discovery

## Quick Start

```jsx
import { JsonFilterWizard } from './components/JsonFilterWizard';

function App() {
  const data = [/* your array of objects */];
  const [filteredData, setFilteredData] = useState(data);
  
  return (
    <JsonFilterWizard
      data={data}
      onFilterChange={setFilteredData}
      title="My Filter"
      description="Filter your data with ease"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | any[] | Yes | Array of JSON objects to filter |
| onFilterChange | (filteredData: any[]) => void | No | Callback when filtered data changes |
| title | string | No | Custom title (default: "JSON Filter Wizard") |
| description | string | No | Custom description |

## Documentation

For detailed documentation, see [documentation.md](./documentation.md)

## Performance

The component uses Web Workers for filtering large datasets (5,000+ items) to prevent UI blocking. For browsers that don't support Web Workers, it falls back to synchronous filtering.

## License

MIT
