
import React, { useState } from 'react';
import { JsonFilterWizard } from './index';
import { FilterGroup } from './types';

/**
 * This file contains example implementations of the JsonFilterWizard component.
 * These examples can be used as reference for implementing the component in your own app.
 * 
 * Not intended to be imported directly - this is for documentation purposes.
 */

/**
 * Basic example with minimal configuration
 */
export const BasicExample = () => {
  const data = [
    { id: 1, name: 'Product A', category: 'Electronics', price: 199.99, inStock: true },
    { id: 2, name: 'Product B', category: 'Clothing', price: 49.99, inStock: false },
    { id: 3, name: 'Product C', category: 'Electronics', price: 299.99, inStock: true },
    { id: 4, name: 'Product D', category: 'Home', price: 99.99, inStock: true },
  ];
  
  const [filteredData, setFilteredData] = useState(data);
  
  return (
    <div className="p-4">
      <JsonFilterWizard 
        data={data} 
        onFilterChange={setFilteredData}
      />
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Results: {filteredData.length} items</h3>
        <pre className="bg-gray-100 p-2 rounded mt-2">
          {JSON.stringify(filteredData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

/**
 * Advanced example with pre-configured filter
 */
export const AdvancedExample = () => {
  const data = [
    // ... same data as above
  ];
  
  const [filteredData, setFilteredData] = useState(data);
  
  // Pre-configured filter
  const initialFilter: FilterGroup = {
    id: "root",
    operator: "AND",
    conditions: [
      {
        id: "condition1",
        field: "price",
        operator: "greaterThan",
        value: 100
      }
    ],
    groups: [
      {
        id: "group1",
        operator: "OR",
        conditions: [
          {
            id: "condition2",
            field: "category",
            operator: "equals",
            value: "Electronics"
          },
          {
            id: "condition3",
            field: "inStock",
            operator: "equals",
            value: true
          }
        ],
        groups: []
      }
    ]
  };
  
  // This would be your component implementation
  const MyComponent = () => {
    // Normally you would set this as initial state and use it
    // This is just for demonstration
    const preConfiguredFilter = initialFilter;
    
    return (
      <div className="p-4">
        <JsonFilterWizard 
          data={data} 
          onFilterChange={setFilteredData}
          title="Product Filter"
          description="Filter products by price, category and stock status"
        />
        
        <div className="mt-4 p-4 border rounded bg-yellow-50">
          <p className="text-sm">
            To use a pre-configured filter, you would load it into the component 
            using the JSON view or by setting the initialState in your implementation.
          </p>
          <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
            {JSON.stringify(preConfiguredFilter, null, 2)}
          </pre>
        </div>
      </div>
    );
  };
  
  return <MyComponent />;
};

/**
 * Example with large dataset and performance monitoring
 */
export const LargeDatasetExample = () => {
  // Generate large sample dataset
  const generateLargeDataset = (count: number) => {
    const data = [];
    const categories = ['Electronics', 'Clothing', 'Home', 'Office', 'Sports'];
    
    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        name: `Item ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.round(Math.random() * 1000) / 10,
        inStock: Math.random() > 0.3,
        rating: Math.round(Math.random() * 50) / 10,
        tags: Array(Math.floor(Math.random() * 4) + 1)
          .fill(0)
          .map(() => ['new', 'sale', 'popular', 'limited'][Math.floor(Math.random() * 4)])
      });
    }
    
    return data;
  };
  
  // Generate 10,000 items (adjust as needed)
  const largeData = generateLargeDataset(10000);
  const [filteredData, setFilteredData] = useState(largeData);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  const handleFilterChange = (newData: any[]) => {
    setFilteredData(newData);
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Large Dataset Example (10,000 items)</h2>
      <p className="mb-4 text-gray-600">
        This example demonstrates how the JsonFilterWizard handles large datasets using Web Workers
        for background processing.
      </p>
      
      <JsonFilterWizard 
        data={largeData} 
        onFilterChange={handleFilterChange}
        title="Large Dataset Filter"
        description="Filter through 10,000 items without blocking the UI"
      />
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold">
          Results: {filteredData.length} of {largeData.length} items
        </h3>
        
        {processingTime && (
          <p className="text-sm text-gray-600">
            Filtering completed in {processingTime.toFixed(2)}ms
          </p>
        )}
        
        <div className="bg-gray-100 p-2 rounded mt-2 max-h-60 overflow-auto">
          <p className="text-sm text-gray-500">
            First 10 results (of {filteredData.length} total):
          </p>
          <pre className="text-xs">
            {JSON.stringify(filteredData.slice(0, 10), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
