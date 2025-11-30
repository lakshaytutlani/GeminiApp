import React, { useState } from 'react';
import { MAX_STOCKS } from '../constants';

interface StockInputProps {
  tickers: string[];
  onAddTicker: (ticker: string) => void;
  onRemoveTicker: (ticker: string) => void;
  onCompare: () => void;
  isLoading: boolean;
}

const XIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const StockInput: React.FC<StockInputProps> = ({
  tickers,
  onAddTicker,
  onRemoveTicker,
  onCompare,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddTicker(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };
  
  const canAdd = tickers.length < MAX_STOCKS;
  const canCompare = tickers.length >= 2;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={canAdd ? "Enter stock ticker (e.g., AAPL)" : `Max ${MAX_STOCKS} stocks reached`}
          className="flex-grow bg-gray-50 border border-gray-300 rounded-md py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
          disabled={!canAdd || isLoading}
          maxLength={10}
        />
        <button
          onClick={handleAdd}
          disabled={!canAdd || isLoading || !inputValue.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
        >
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
        {tickers.map((ticker) => (
          <div
            key={ticker}
            className="flex items-center bg-gray-100 text-gray-800 rounded-full px-4 py-1 text-sm font-medium border border-gray-200"
          >
            <span>{ticker}</span>
            <button
              onClick={() => onRemoveTicker(ticker)}
              className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
              disabled={isLoading}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={onCompare}
          disabled={!canCompare || isLoading}
          className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-transform duration-200 transform hover:scale-105"
        >
          {isLoading ? 'Analyzing...' : 'Compare Stocks'}
        </button>
      </div>
    </div>
  );
};

export default StockInput;