import { useState, useEffect } from 'react';
import { ApiTableResponse, DynamicProjectData, ApiHeaderConfig } from '../types/apiTypes';
import { mockApiService } from '../services/mockApiService';
import { TextMode } from '@shared/types';

interface UseApiDataOptions {
  tableType: string;
  mockApiFailure?: boolean;
}

interface UseApiDataReturn {
  projects: DynamicProjectData[];
  headers: ApiHeaderConfig[];
  loading: boolean;
  error: string | null;
  columnTextModes: Record<string, TextMode | null>;
  columnWidths: number[];
  refetch: () => Promise<void>;
}

export function useApiData({ tableType, mockApiFailure = false }: UseApiDataOptions): UseApiDataReturn {
  const [projects, setProjects] = useState<DynamicProjectData[]>([]);
  const [headers, setHeaders] = useState<ApiHeaderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnTextModes, setColumnTextModes] = useState<Record<string, TextMode | null>>({});
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, this would be a real API call:
      // const response = await fetch(`/api/projects/${tableType}`);
      // const data = await response.json();
      
      // For now, use mock service with fallback capability
      const response = await mockApiService.fetchTableData(tableType, {
        mockApiFailure,
      });
      
      setHeaders(response.headers);
      setProjects(response.data);
      
      // Initialize column text modes for all headers
      const initialTextModes: Record<string, TextMode | null> = {};
      response.headers.forEach(header => {
        initialTextModes[header.key] = null;
      });
      setColumnTextModes(initialTextModes);
      
      // Set initial column widths based on headers
      const initialWidths = response.headers.map(header => 
        parseFloat(header.width?.replace('%', '') || '10')
      );
      setColumnWidths(initialWidths);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load project data";
      setError(errorMessage);
      console.error('API fetch error:', err);
      
      // Try to fallback to basic mock data
      try {
        const fallbackResponse = await mockApiService.getTableData('new'); // Default fallback
        setHeaders(fallbackResponse.headers);
        setProjects(fallbackResponse.data);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableType, mockApiFailure]);

  return {
    projects,
    headers,
    loading,
    error,
    columnTextModes,
    columnWidths,
    refetch: fetchData,
  };
}