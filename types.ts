export interface StockData {
  ticker: string;
  companyName: string;
  peRatio: string;
  news: string[];
  pros: string[];
  cons:string[];
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface StockAnalysis {
  recommendation: string;
  recommendationReason: string;
  stocks: StockData[];
  chartData: ChartDataPoint[];
  sources: GroundingSource[];
}