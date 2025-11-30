import React, { useState, useCallback } from 'react';
import StockInput from './components/StockInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { getStockAnalysis } from './services/geminiService';
import type { StockAnalysis } from './types';
import { MAX_STOCKS } from './constants';

const App: React.FC = () => {
  const [tickers, setTickers] = useState<string[]>(['GOOGL', 'MSFT']);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = useCallback(async () => {
    if (tickers.length < 2) {
      setError('Please add at least two stocks to compare.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await getStockAnalysis(tickers);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to get analysis. The AI may be experiencing high traffic or the response was invalid. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [tickers]);

  const addTicker = (ticker: string) => {
    const upperCaseTicker = ticker.toUpperCase();
    if (tickers.length < MAX_STOCKS && !tickers.includes(upperCaseTicker)) {
      setTickers([...tickers, upperCaseTicker]);
      setError(null);
    }
  };

  const removeTicker = (tickerToRemove: string) => {
    setTickers(tickers.filter((ticker) => ticker !== tickerToRemove));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 mb-8">
            Enter up to {MAX_STOCKS} stock tickers to get a detailed, AI-powered investment analysis.
            We use Google's Gemini model with real-time search grounding for up-to-date insights.
          </p>
          <StockInput
            tickers={tickers}
            onAddTicker={addTicker}
            onRemoveTicker={removeTicker}
            onCompare={handleCompare}
            isLoading={isLoading}
          />
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {analysis && !isLoading && <AnalysisDisplay analysis={analysis} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;