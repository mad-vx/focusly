export interface TradeRow {
  rowIndex: number;
  symbol: string;
  ccy: string;
  qty: number;
  side: 'Buy' | 'Sell';
  riskOk: boolean;
  notes: string;
  tradeDate?: string;               // yyyy-MM-dd (HTML date input friendly)
  urgency?: 'Low' | 'Medium' | 'High';
  rating?: number;  
}
export interface TradeCellContext {
  $implicit: TradeRow; // expose row as implicit for concise templates
  row: TradeRow; // (optional) named for clarity
  group?: number; // focusly group if you need it
}
