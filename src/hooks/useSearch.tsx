
import { useState, useEffect, useMemo } from 'react';
import { Farmer, FilterParams, SortConfig, PaginationConfig } from '../types';
import { parseNaturalLanguageQuery, applyFilters } from '../utils/nlpParser';
import { farmers } from '../utils/mockData';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<FilterParams>({});
  const [results, setResults] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: undefined });
  const [pagination, setPagination] = useState<PaginationConfig>({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: farmers.length,
  });

  // Debounce the query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [query]);

  // Process the query when it changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilters({});
      setResults(farmers);
      setPagination(prev => ({ ...prev, totalItems: farmers.length }));
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    const timerId = setTimeout(() => {
      try {
        const parseResult = parseNaturalLanguageQuery(debouncedQuery);
        setFilters(parseResult.filters);
        
        const filteredResults = applyFilters(parseResult.filters, farmers);
        setResults(filteredResults);
        setPagination(prev => ({ 
          ...prev, 
          currentPage: 1, 
          totalItems: filteredResults.length 
        }));
      } catch (error) {
        console.error('Error processing query:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600);
    
    return () => clearTimeout(timerId);
  }, [debouncedQuery]);

  // Handle sorting
  const sortedResults = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return results;
    
    return [...results].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [results, sortConfig]);

  // Handle pagination
  const paginatedResults = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return sortedResults.slice(startIndex, startIndex + pagination.itemsPerPage);
  }, [sortedResults, pagination.currentPage, pagination.itemsPerPage]);

  // Handle manual filter changes
  const updateFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    const filteredResults = applyFilters(newFilters, farmers);
    setResults(filteredResults);
    setPagination(prev => ({ 
      ...prev, 
      currentPage: 1, 
      totalItems: filteredResults.length 
    }));
  };

  const requestSort = (key: keyof Farmer) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = undefined;
    }
    
    setSortConfig({ key, direction });
  };

  const changePage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const changeItemsPerPage = (itemsPerPage: number) => {
    setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }));
  };

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    results: paginatedResults,
    loading,
    sortConfig,
    requestSort,
    pagination,
    changePage,
    changeItemsPerPage,
    totalResults: results.length
  };
};

export type SortDirection = 'asc' | 'desc' | undefined;
