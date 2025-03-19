
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { searchExamples } from '../utils/mockData';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, loading }) => {
  const [focused, setFocused] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (examplesRef.current && !examplesRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowExamples(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setFocused(true);
    if (!query) {
      setShowExamples(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className={`relative transition-all duration-300 ${
        focused ? 'ring-2 ring-primary/20 scale-[1.01]' : ''
      }`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className={`h-5 w-5 ${loading ? 'text-primary animate-pulse-subtle' : 'text-gray-400'}`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full p-4 pl-12 pr-12 text-lg bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-0 transition-all duration-300"
            placeholder="Ask me about farmers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setFocused(false)}
          />
          {query && (
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleClear}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {showExamples && (
          <div 
            ref={examplesRef}
            className="absolute z-10 w-full mt-2 bg-white border rounded-xl shadow-lg overflow-hidden animate-slide-up"
          >
            <div className="p-3 bg-gray-50 border-b">
              <p className="text-sm font-medium text-gray-500">Try asking about...</p>
            </div>
            <div className="p-1">
              {searchExamples.map((example, index) => (
                <div 
                  key={index}
                  className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  <p className="text-sm text-gray-700">{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">
          {loading ? (
            <span className="inline-flex items-center">
              <span className="mr-2">Processing your query</span>
              <span className="flex space-x-1">
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></span>
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse animation-delay-200"></span>
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse animation-delay-400"></span>
              </span>
            </span>
          ) : (
            query ? 'Type your query in natural language' : 'Search for farmers using natural language queries'
          )}
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
