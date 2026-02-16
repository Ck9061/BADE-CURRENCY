
import React, { useState } from 'react';
import { Partner, WiseAccount, CurrencyType, Transaction, TransactionCategory } from '../types';
import { PARTNERS, WISE_ACCOUNTS } from '../constants';
import { PlusCircle, Wallet, ArrowDownCircle, ArrowUpCircle, MessageSquare, Building, Landmark, ChevronDown } from 'lucide-react';

interface Props {
  onAdd: (tx: any) => void;
}

const TransactionForm: React.FC<Props> = ({ onAdd }) => {
  const [category, setCategory] = useState<TransactionCategory>('IN');
  const [bank, setBank] = useState('');
  const [partner, setPartner] = useState<Partner>(PARTNERS[0]);
  const [wiseAccount, setWiseAccount] = useState<WiseAccount>(WISE_ACCOUNTS[0]);
  const [currency, setCurrency] = useState<CurrencyType>('AUD');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState('');
  const [commissionRate, setCommissionRate] = useState<string>('5');

  const QUICK_NOTES = ['DONE', 'PENDING', 'TRANSFER'];
  const COMMON_EXCHANGE_TYPES = [
    { label: '-- 常用类型 --', value: '' },
    { label: 'AUD ➔ MYR', value: 'AUD-MYR' },
    { label: 'AUD ➔ USD', value: 'AUD-USD' },
    { label: 'MYR ➔ AUD', value: 'MYR-AUD' },
    { label: 'MYR ➔ USD', value: 'MYR-USD' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    onAdd({
      category,
      bank,
      partner,
      wiseAccount,
      currency,
      amount: parseFloat(amount),
      note,
      commissionRate: category === 'IN' ? parseFloat(commissionRate) : 0,
    });

    setAmount('');
    setBank('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Wallet className="text-blue-500" /> 记账流水录入
        </h3>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setCategory('IN'); setCurrency('AUD'); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${category === 'IN' ? 'bg-green-500 text-white shadow-sm' : 'text-slate-500'}`}
          >
            <ArrowDownCircle className="w-4 h-4" /> IN (收款)
          </button>
          <button
            type="button"
            onClick={() => setCategory('OUT')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${category === 'OUT' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500'}`}
          >
            <ArrowUpCircle className="w-4 h-4" /> OUT (划出)
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Building className="w-3 h-3" /> BANK (渠道)
          </label>
          <input 
            type="text" 
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如: A.CHEE LIANG"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">合伙人 (TO/FROM)</label>
          <select 
            value={partner}
            onChange={(e) => setPartner(e.target.value as Partner)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
          >
            {PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
            <Landmark className="w-3 h-3" /> Wise 户口
          </label>
          <select 
            value={wiseAccount}
            onChange={(e) => setWiseAccount(e.target.value as WiseAccount)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
          >
            {WISE_ACCOUNTS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">币种</label>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyType)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
          >
            <option value="AUD">AUD</option>
            <option value="MYR">MYR</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 font-bold ${category === 'IN' ? 'text-green-700' : 'text-orange-700'}`}>
            金额 ({currency})
          </label>
          <input 
            required
            type="number" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 font-bold ${category === 'IN' ? 'bg-green-50 border-green-200 focus:ring-green-500' : 'bg-orange-50 border-orange-200 focus:ring-orange-500'}`}
          />
        </div>

        {category === 'IN' && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">代收抽成 (%)</label>
            <input 
              type="number" 
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className={category === 'IN' ? 'col-span-1 xl:col-span-2' : 'col-span-1 xl:col-span-3'}>
          <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> 备注 (Notes)
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="手动输入备注..."
                />
              </div>
              <div className="relative">
                <select 
                  onChange={(e) => e.target.value && setNote(e.target.value)}
                  className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-bold text-slate-600 cursor-pointer hover:border-blue-300 transition-colors"
                  defaultValue=""
                >
                  {COMMON_EXCHANGE_TYPES.map(type => (
                    <option key={type.label} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTES.map(qNote => (
                <button
                  key={qNote}
                  type="button"
                  onClick={() => setNote(qNote)}
                  className={`text-[10px] px-2 py-0.5 rounded-full transition-colors border ${note === qNote ? 'bg-blue-500 text-white border-blue-600' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-blue-50'}`}
                >
                  {qNote}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button 
          type="submit"
          className={`${category === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white font-bold py-2 px-10 rounded-xl transition-all shadow-md flex items-center gap-2`}
        >
          <PlusCircle className="w-5 h-5" /> 记录此笔流水
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
