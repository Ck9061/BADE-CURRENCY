
import React from 'react';
import { Landmark, Users, TrendingUp, Wallet } from 'lucide-react';

export const PARTNERS = ['CK', 'WL'] as const;

/**
 * 在此处自定义您的 Wise 账户名称。
 * 修改此数组后，系统中的所有下拉选择框将自动同步更新。
 * 您可以根据业务需求自由添加、修改或删除。
 */
export const WISE_ACCOUNTS: string[] = [
  'CK Wise',
  'WL Wise',
  'Common Wise'
];

export const ICONS = {
  Wise: <Landmark className="w-5 h-5" />,
  Partners: <Users className="w-5 h-5" />,
  Profit: <TrendingUp className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
};
