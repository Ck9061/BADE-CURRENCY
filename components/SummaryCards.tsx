
import React from 'react';
import { DailySummary } from '../types';
import { ICONS } from '../constants';
import { Landmark, ArrowDownCircle, ArrowUpCircle, Calculator } from 'lucide-react';

interface Props {
  summary: DailySummary;
}

const SummaryCards: React.FC<Props> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Landmark className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">AUD Balance</span>
        </div>
        <p className="text-2xl font-black text-blue-900">${summary.audBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-green-600 mb-1">
          <ArrowDownCircle className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total AUD (IN)</span>
        </div>
        <p className="text-xl font-bold text-slate-900">${summary.audIn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-orange-600 mb-1">
          <ArrowUpCircle className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total AUD (OUT)</span>
        </div>
        <p className="text-xl font-bold text-slate-900">${summary.audOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-purple-600 mb-1">
          <ArrowUpCircle className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total MYR (OUT)</span>
        </div>
        <p className="text-xl font-bold text-slate-900">RM {summary.myrOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="bg-green-600 p-4 rounded-2xl shadow-lg shadow-green-100 flex flex-col gap-1 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Exchange Profit</span>
        </div>
        <p className="text-2xl font-black">RM {summary.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
