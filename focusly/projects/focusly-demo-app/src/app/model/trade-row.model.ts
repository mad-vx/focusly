export interface TradeRow {
  rowIndex: number;
  symbol: string;
  ccy: string;
  qty: number;
  side: 'Buy' | 'Sell';
  riskOk: boolean;
  notes: string;
}
export interface TradeCellContext {
  $implicit: TradeRow;        // expose row as implicit for concise templates
  row: TradeRow;              // (optional) named for clarity
  group: number;              // focusly group if you need it
}
