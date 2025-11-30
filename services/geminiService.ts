import { GoogleGenAI } from '@google/genai';
import type { StockAnalysis, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(tickers: string[]): string {
  const tickerList = tickers.join(', ');
  return `
    You are a world-class senior financial analyst providing a detailed investment report.
    Compare the following stocks: ${tickerList}.
    Your analysis must be based on the most recent, publicly available information from today.

    Structure your entire response as a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    The JSON object must have the following structure:
    {
      "recommendation": "string",
      "recommendationReason": "string",
      "stocks": [
        {
          "ticker": "string",
          "companyName": "string",
          "news": ["string"],
          "pros": ["string"],
          "cons": ["string"]
        }
      ],
      "chartData": [
        {
          "name": "string",
          "TICKER1": "number",
          "TICKER2": "number"
        }
      ]
    }

    Here are the detailed requirements for each field:
    - "recommendation": A string containing only the ticker symbol of the single stock you most strongly recommend for investment.
    - "recommendationReason": A detailed, multi-sentence paragraph explaining why the recommended stock is the best choice compared to the others. Analyze key metrics, market position, and future outlook.
    - "stocks": An array of objects, one for each ticker provided. The order should match the input tickers.
        - "ticker": The stock ticker symbol (e.g., "AAPL").
        - "companyName": The full name of the company.
        - "news": An array of at least 3 strings, each summarizing a recent, significant news item about the company.
        - "pros": An array of at least 3 strings, outlining the key strengths and investment advantages of this stock.
        - "cons": An array of at least 3 strings, outlining the key weaknesses and investment risks of this stock.
    - "chartData": An array of exactly 6 objects for a performance line chart.
        - Each object represents a point in time. The "name" keys must be exactly: "12M Ago", "9M Ago", "6M Ago", "3M Ago", "1M Ago", "Today".
        - Each object must also contain keys for each ticker, with a hypothetical normalized performance value from 0 to 100. A value of 100 should represent the peak performance for that stock within this 12-month period. For example: { "name": "12M Ago", "${tickers[0]}": 80, "${tickers[1]}": 85 }.
  `;
}


const cleanJsonResponse = (rawText: string): string => {
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Invalid JSON response: No curly braces found.');
    }
    return rawText.substring(startIndex, endIndex + 1);
};


export const getStockAnalysis = async (tickers: string[]): Promise<StockAnalysis> => {
    const prompt = buildPrompt(tickers);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const rawText = response.text;
        const cleanedJson = cleanJsonResponse(rawText);
        const parsedData = JSON.parse(cleanedJson) as Omit<StockAnalysis, 'sources'>;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources: GroundingSource[] = (groundingChunks || [])
            .map((chunk: any) => ({
                uri: chunk?.web?.uri || '',
                title: chunk?.web?.title || 'Untitled Source',
            }))
            .filter(source => source.uri);
            
        // Deduplicate sources
        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
        
        return { ...parsedData, sources: uniqueSources };

    } catch (error) {
        console.error("Error during Gemini API call or parsing:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI's response. It was not valid JSON.");
        }
        throw new Error("An error occurred while fetching the stock analysis.");
    }
};
