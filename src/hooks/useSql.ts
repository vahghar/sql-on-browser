"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Papa from "papaparse";
import alasql from "alasql";

export function useSQL() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  
  // Ref for immediate access
  const dataRef = useRef<any[]>([]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const loadCSV = useCallback(async (file: File): Promise<any> => {
    setLoading(true);
    
    // Reset states before loading new file
    setData([]);
    setColumns([]);
    dataRef.current = [];

    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        // NEW: Auto-detect the delimiter (comma, semicolon, pipe, etc.)
        delimiter: "", 
        
        complete: (results) => {
          let parsedData = results.data;
          let parsedColumns = results.meta.fields || [];

          // 1. Debugging: Log any issues found by the parser
          if (results.errors && results.errors.length > 0) {
            console.warn("CSV Parse Warnings:", results.errors);
          }

          // 2. Fatal Error Check: Did we get any data?
          if (!parsedData || parsedData.length === 0) {
            setLoading(false);
            const errorMsg = results.errors.length > 0 
              ? `Parse Error: ${results.errors[0].message}`
              : "File appears empty or is not a valid text CSV.";
            
            resolve({ success: false, error: errorMsg });
            return;
          }

          // 3. Fallback: If no headers found in meta, grab them from the first row
          if (parsedColumns.length === 0 && parsedData.length > 0) {
            const firstRow: any = parsedData[0];
            if (firstRow && typeof firstRow === 'object') {
              parsedColumns = Object.keys(firstRow);
            }
          }

          // Success! Update everything
          dataRef.current = parsedData;
          setColumns(parsedColumns);
          setData(parsedData);
          setLoading(false);
          
          resolve({ success: true, rowCount: parsedData.length, columns: parsedColumns });
        },
        error: (error) => {
          setLoading(false);
          resolve({ success: false, error: `Read Error: ${error.message}` });
        },
      });
    });
  }, []);

  const runQuery = useCallback((query: string): any => {
    const currentData = dataRef.current;

    if (!currentData || currentData.length === 0) {
      return { error: "No data loaded. Please upload a valid CSV file." };
    }

    try {
      alasql("DROP TABLE IF EXISTS csv_data");
      alasql("CREATE TABLE csv_data");
      alasql.tables["csv_data"].data = currentData;

      const resultData = alasql(query);

      if (!resultData || resultData.length === 0) {
        return { columns: [], values: [] };
      }

      // Robust column detection from result
      const firstRow = resultData[0];
      const resultColumns = firstRow ? Object.keys(firstRow) : [];
      
      const values = resultData.map((row: any) => 
        resultColumns.map((col) => row[col])
      );

      return {
        columns: resultColumns,
        values: values
      };

    } catch (error: any) {
      console.error("SQL Error:", error);
      return {
        columns: [],
        values: [],
        error: error.message || "Invalid SQL Query"
      };
    }
  }, []);

  return {
    loading,
    loadCSV,
    runQuery,
    columns,
  };
}