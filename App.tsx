
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, DailySummary, Partner } from './types';
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import SummaryCards from './components/SummaryCards';
import { History, LayoutDashboard, Calculator, CheckCircle2, Calendar, Clock as ClockIcon } from 'lucide-react';

const App: React.FC = () => {
  const formatAppDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // 内部日期格式固定为 DD/MM/YYYY，默认初始化为今天
  const [settleDate, setSettleDate] = useState(formatAppDate(new Date()));
  const [wiseRate, setWiseRate] = useState('');
  const [customerRate, setCustomerRate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 实时时钟更新 (用于结算区域显示)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 转换 DD/MM/YYYY 为 YYYY-MM-DD 以供 HTML5 日期输入框使用
  const toInputDateFormat = (appDate: string) => {
    if (!appDate) return "";
    const parts = appDate.split('/');
    if (parts.length !== 3) return "";
    const [d, m, y] = parts;
    return `${y}-${m}-${d}`;
  };

  // 转换 YYYY-MM-DD 为 DD/MM/YYYY 以供内部逻辑使用
  const fromInputDateFormat = (inputDate: string) => {
    if (!inputDate) return "";
    const parts = inputDate.split('-');
    if (parts.length !== 3) return "";
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem('fx_v5_ledger');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fx_v5_ledger', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (data: any) => {
    const newTx: Transaction = {
      ...data,
      date: formatAppDate(new Date()),
      id: crypto.randomUUID(),
      wiseRate: 0,
      customerRate: 0,
      commissionProfit: data.category === 'IN' ? data.amount * (data.commissionRate / 100) : 0,
      exchangeProfit: 0,
      totalProfit: 0,
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  /**
   * 核心结算逻辑：根据 Wise 汇率和给客户的汇率计算该日期下所有 IN 类型交易的利润
   */
  const performSettlement = () => {
    const wR = parseFloat(wiseRate);
    const cR = parseFloat(customerRate);
    
    if (isNaN(wR) || isNaN(cR)) {
      alert("请输入有效的汇率数值进行结算");
      return;
    }

    const affectedTxs = transactions.filter(tx => tx.date === settleDate && tx.category === 'IN' && tx.currency === 'AUD');
    
    if (affectedTxs.length === 0) {
      alert(`${settleDate} 没有任何待结算的 AUD 收款记录。`);
      return;
    }

    setTransactions(prev => prev.map(tx => {
      // 仅对选定日期、IN 类型且币种为 AUD 的记录进行利润结算
      if (tx.date === settleDate && tx.category === 'IN' && tx.currency === 'AUD') {
        const netAmount = tx.amount - tx.commissionProfit;
        // 汇率差价利润 (RM) = 扣除抽成后的净额 * (Wise汇率 - 客户汇率)
        const exProfit = netAmount * (wR - cR);
        // 总利润 (RM) = (抽成部分 * Wise汇率) + 汇率差价利润
        const totProfit = (tx.commissionProfit * wR) + exProfit;
        
        return { 
          ...tx, 
          wiseRate: wR, 
          customerRate: cR, 
          exchangeProfit: exProfit, 
          totalProfit: totProfit 
        };
      }
      return tx;
    }));

    // 结算后清空输入框并给予反馈
    setWiseRate(''); 
    setCustomerRate('');
    alert(`${settleDate} 的 ${affectedTxs.length} 笔账目结算完成！`);
  };

  const summary = useMemo((): DailySummary => {
    return transactions.reduce((acc, tx) => {
      if (tx.category === 'IN') {
        if (tx.currency === 'AUD') acc.audIn += tx.amount;
        acc.totalProfit += tx.totalProfit;
      } else {
        if (tx.currency === 'AUD') acc.audOut += tx.amount;
        if (tx.currency === 'MYR') acc.myrOut += tx.amount;
      }

      if (tx.partner === 'CK') acc.ckBalance += (tx.category === 'IN' ? tx.amount : -tx.amount);
      else acc.wlBalance += (tx.category === 'IN' ? tx.amount : -tx.amount);

      acc.audBalance = acc.audIn - acc.audOut;
      return acc;
    }, { totalProfit: 0, audIn: 0, audOut: 0, audBalance: 0, myrOut: 0, ckBalance: 0, wlBalance: 0 });
  }, [transactions]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        <SummaryCards summary={summary} />
        
        <TransactionForm onAdd={addTransaction} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            {/* 利润结算区域 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-orange-100 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Calculator className="w-24 h-24" />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-orange-600">
                  <Calculator className="w-5 h-5" /> 利润结算 (每日清算)
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                  <ClockIcon className="w-3 h-3" />
                  {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 结算日期
                  </label>
                  <input 
                    type="date"
                    value={toInputDateFormat(settleDate)}
                    onChange={(e) => setSettleDate(fromInputDateFormat(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">当日 Wise 汇率</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    placeholder="例如: 3.0150" 
                    value={wiseRate} 
                    onChange={(e) => setWiseRate(e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400 font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">当日客户汇率</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    placeholder="例如: 2.9800" 
                    value={customerRate} 
                    onChange={(e) => setCustomerRate(e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400 font-mono" 
                  />
                </div>
                <button 
                  onClick={performSettlement} 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> 开始结算
                </button>
              </div>
              <p className="mt-3 text-[10px] text-slate-400 italic">
                * 结算将自动计算选定日期所有 AUD 收款记录的汇率差利润与代收抽成利润。
              </p>
            </div>
            
            <TransactionTable transactions={transactions} onDelete={(id) => setTransactions(prev => prev.filter(t => t.id !== id))} />
          </section>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">合伙人即时余量 (AUD)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700">CK</span>
                  <span className={`font-black ${summary.ckBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${summary.ckBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700">WL</span>
                  <span className={`font-black ${summary.wlBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${summary.wlBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center">注：此余量代表该合伙人代收后尚未划出的总额</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
