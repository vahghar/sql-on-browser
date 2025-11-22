'use client';

import { useState, useCallback } from 'react';

export function useSQL() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  // Simple CSV parser
  const parseCSV = useCallback((csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { columns: [], data: [] };
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return { columns: headers, data };
  }, []);

  const loadCSV = useCallback(async (file: File): Promise<any> => {
    setLoading(true);
    try {
      // Read file
      const text = await file.text();
      const { columns: parsedColumns, data: parsedData } = parseCSV(text);
      
      console.log('Parsed columns:', parsedColumns);
      console.log('Parsed data sample:', parsedData.slice(0, 2));
      
      setColumns(parsedColumns);
      setData(parsedData);
      
      return { 
        success: true, 
        rowCount: parsedData.length, 
        columns: parsedColumns 
      };
    } catch (error: any) {
      console.error('Error loading file:', error);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setLoading(false);
    }
  }, [parseCSV]);

  const runQuery = useCallback((query: string): any => {
    console.log('Running query:', query);
    console.log('Current data length:', data.length);
    console.log('Current columns:', columns);

    if (data.length === 0) {
      return { 
        columns: [], 
        values: [], 
        error: 'No data loaded. Please upload a file first.' 
      };
    }

    try {
      // Handle SELECT * queries with LIMIT
      if (query.toLowerCase().includes('select *') && query.toLowerCase().includes('from')) {
        const limitMatch = query.match(/limit\s+(\d+)/i);
        const limit = limitMatch ? parseInt(limitMatch[1]) : 10;
        
        const limitedData = data.slice(0, limit);
        const values = limitedData.map(row => 
          columns.map(col => row[col] || '')
        );
        
        return {
          columns: columns,
          values: values
        };
      }
      
      // Handle COUNT(*) queries
      if (query.toLowerCase().includes('count(*)')) {
        return {
          columns: ['total_count'],
          values: [[data.length]]
        };
      }
      
      // Handle specific column selection
      if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from')) {
        const columnMatch = query.match(/select\s+(.+?)\s+from/i);
        if (columnMatch) {
          const selectedColumns = columnMatch[1].split(',').map(col => col.trim());
          const limitMatch = query.match(/limit\s+(\d+)/i);
          const limit = limitMatch ? parseInt(limitMatch[1]) : 5;
          
          const limitedData = data.slice(0, limit);
          const values = limitedData.map(row => 
            selectedColumns.map(col => row[col] || '')
          );
          
          return {
            columns: selectedColumns,
            values: values
          };
        }
      }
      
      // Default: return first 5 rows with all columns
      return {
        columns: columns,
        values: data.slice(0, 5).map(row => columns.map(col => row[col] || ''))
      };
      
    } catch (error: any) {
      return { 
        columns: [], 
        values: [], 
        error: error.message 
      };
    }
  }, [data, columns]);

  return {
    loading,
    loadCSV,
    runQuery,
    columns // Export columns so we can use them in the UI
  };
}