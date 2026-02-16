
import React from 'react';
import { Transaction } from '../types';
import { Trash2, ExternalLink, Clock, CheckCircle, Landmark } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">收款日期</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">BANK (银行/渠道)</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">TO/FROM</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wise 账户</th>
            <th className="px-4 py-3 text-[10px] font-bold text-green-600 uppercase tracking-wider">IN (AUD)</th>
            <th className="px-4 py-3 text-[10px] font-bold text-orange-600 uppercase tracking-wider">OUT (AUD)</th>
            <th className="px-4 py-3 text-[10px] font-bold text-purple-600 uppercase tracking-wider">OUT (MYR)</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">备注</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">利润(RM)</th>
            <th className="px-4 py-3 text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-8 text-center text-slate-400">暂无流水记录</td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-4 text-xs font-medium text-slate-500">{tx.date}</td>
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-slate-900">{tx.bank || '-'}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.partner === 'CK' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                    {tx.partner}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    {tx.wiseAccount ? (
                      <>
                        <Landmark className="w-3 h-3 text-blue-400" />
                        {tx.wiseAccount}
                      </>
                    ) : '-'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {(tx.category === 'IN' && tx.currency === 'AUD') ? (
                    <div className="text-sm font-black text-green-600">${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                  ) : '-'}
                </td>
                <td className="px-4 py-4">
                  {(tx.category === 'OUT' && tx.currency === 'AUD') ? (
                    <div className="text-sm font-black text-orange-600">${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                  ) : '-'}
                </td>
                <td className="px-4 py-4">
                  {(tx.category === 'OUT' && tx.currency === 'MYR') ? (
                    <div className="text-sm font-black text-purple-600">RM {tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                  ) : '-'}
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    {tx.note === 'DONE' && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {tx.note}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  {tx.category === 'IN' ? (
                    tx.totalProfit > 0 ? (
                      <div className="text-sm font-black text-green-600">RM {tx.totalProfit.toFixed(2)}</div>
                    ) : (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-orange-400">
                        <Clock className="w-3 h-3" /> 待结算
                      </div>
                    )
                  ) : '-'}
                </td>
                <td className="px-4 py-4 text-center">
                  <button 
                    onClick={() => onDelete(tx.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
