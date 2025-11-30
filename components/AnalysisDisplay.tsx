import React from 'react';
import type { StockAnalysis, StockData } from '../types';
import PerformanceChart from './PerformanceChart';

interface AnalysisDisplayProps {
  analysis: StockAnalysis;
}

const CheckIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
const XIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const NewspaperIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2Z"/><path d="M15 2h2v10h-2Z"/><path d="M8 8h4"/><path d="M8 12h4"/><path d="M8 16h4"/>
    </svg>
);
const TrendingUpIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const { recommendation, recommendationReason, stocks, chartData, sources } = analysis;

  const Card: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <h2 className="text-2xl font-bold text-sky-600 mb-3">AI Investment Recommendation</h2>
        <p className="text-4xl font-extrabold text-gray-900 mb-4">{recommendation}</p>
        <p className="text-gray-600 leading-relaxed">{recommendationReason}</p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-sky-600 mb-4">Normalized Performance (12 Months)</h2>
        <PerformanceChart data={chartData} tickers={stocks.map(s => s.ticker)} />
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {stocks.map((stock) => (
          <StockCard key={stock.ticker} stock={stock} />
        ))}
      </div>

      {sources && sources.length > 0 && (
          <Card>
              <h2 className="text-2xl font-bold text-sky-600 mb-4">Sources</h2>
              <ul className="space-y-2">
                  {sources.map((source, index) => (
                      <li key={index} className="truncate">
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-600 transition-colors duration-200 text-sm">
                              {source.title || source.uri}
                          </a>
                      </li>
                  ))}
              </ul>
          </Card>
      )}
    </div>
  );
};

const StockCard: React.FC<{ stock: StockData }> = ({ stock }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex-shrink-0 border-b border-gray-100 pb-4 mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{stock.companyName} ({stock.ticker})</h3>
        <div className="mt-2 flex items-center text-sm font-medium text-gray-600">
             <TrendingUpIcon className="w-4 h-4 mr-2 text-sky-500"/>
             <span>P/E Ratio: <span className="text-gray-900 font-bold">{stock.peRatio}</span></span>
        </div>
      </div>
      <div className="flex-grow space-y-6">
        <InfoSection title="Recent News" icon={<NewspaperIcon className="w-5 h-5 text-sky-500"/>}>
            <ul className="space-y-2">
                {stock.news.map((item, index) => <li key={index} className="text-gray-600 text-sm">{item}</li>)}
            </ul>
        </InfoSection>
        <InfoSection title="Pros" icon={<CheckIcon className="w-5 h-5 text-green-500"/>}>
            <ul className="space-y-2">
                {stock.pros.map((item, index) => <li key={index} className="text-gray-600 text-sm">{item}</li>)}
            </ul>
        </InfoSection>
        <InfoSection title="Cons" icon={<XIcon className="w-5 h-5 text-red-500"/>}>
            <ul className="space-y-2">
                {stock.cons.map((item, index) => <li key={index} className="text-gray-600 text-sm">{item}</li>)}
            </ul>
        </InfoSection>
      </div>
    </div>
  );
};

const InfoSection: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({title, icon, children}) => (
    <div>
        <div className="flex items-center mb-3">
            {icon}
            <h4 className="font-semibold text-lg ml-2 text-gray-800">{title}</h4>
        </div>
        {children}
    </div>
);


export default AnalysisDisplay;