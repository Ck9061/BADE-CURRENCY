
export type Partner = 'CK' | 'WL';
export type WiseAccount = string;
export type CurrencyType = 'AUD' | 'MYR';
export type TransactionCategory = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  date: string;
  bank: string;      // 对应截图中的 BANK
  partner: Partner;  // 对应截图中的 TO/FROM
  category: TransactionCategory; 
  currency: CurrencyType;
  amount: number;
  
  // 仅 IN 类型交易有的字段
  commissionRate: number; 
  commissionProfit: number; 
  wiseRate: number; 
  customerRate: number; 
  exchangeProfit: number; 
  totalProfit: number; 
  
  note: string;      // 对应截图中的备注
  customerName?: string;
  wiseAccount?: WiseAccount;
}

export interface DailySummary {
  totalProfit: number;
  audIn: number;
  audOut: number;
  audBalance: number;
  myrOut: number;
  ckBalance: number;
  wlBalance: number;
}
