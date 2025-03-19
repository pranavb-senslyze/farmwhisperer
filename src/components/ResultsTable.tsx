
import React from 'react';
import { Farmer, SortConfig, PaginationConfig } from '../types';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ClipboardList } from 'lucide-react';
import FarmerCard from './FarmerCard';

interface ResultsTableProps {
  results: Farmer[];
  loading: boolean;
  sortConfig: SortConfig;
  requestSort: (key: keyof Farmer) => void;
  pagination: PaginationConfig;
  changePage: (page: number) => void;
  changeItemsPerPage: (items: number) => void;
  totalResults: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  loading,
  sortConfig,
  requestSort,
  pagination,
  changePage,
  changeItemsPerPage,
  totalResults
}) => {
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('card');
  
  // Generate page numbers for pagination
  const pageCount = Math.ceil(totalResults / pagination.itemsPerPage);
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;
  
  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  const getSortIcon = (key: keyof Farmer) => {
    if (sortConfig.key !== key) {
      return null;
    }
    
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="h-4 w-4" />;
    }
    
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="h-4 w-4" />;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-center items-center p-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-4 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-primary/40" />
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border rounded-xl shadow-sm p-8 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'card' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setViewMode('card')}
          >
            Cards
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === 'table' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-500">Rows per page:</label>
          <select
            className="bg-white border rounded-md px-2 py-1 text-sm"
            value={pagination.itemsPerPage}
            onChange={(e) => changeItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 gap-6 animate-fade-in">
          {results.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('district')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>District</span>
                      {getSortIcon('district')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('land_owned')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Land (acres)</span>
                      {getSortIcon('land_owned')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crops
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Irrigation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FPO
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                          <div className="text-sm text-gray-500">{farmer.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{farmer.district}</div>
                      <div className="text-sm text-gray-500">{farmer.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{farmer.land_owned}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {farmer.crops.slice(0, 2).map((crop, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-0.5 bg-farm-brown/10 text-farm-brown rounded text-xs"
                          >
                            {crop}
                          </span>
                        ))}
                        {farmer.crops.length > 2 && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                            +{farmer.crops.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        farmer.irrigation_facility 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {farmer.irrigation_facility ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        farmer.associated_with_fpo 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {farmer.associated_with_fpo ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {
              Math.min(pagination.currentPage * pagination.itemsPerPage, totalResults)
            } of {totalResults} results
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              className="p-2 rounded-md bg-white border text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {pageNumbers.map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded-md text-sm ${
                  pagination.currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="p-2 rounded-md bg-white border text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
