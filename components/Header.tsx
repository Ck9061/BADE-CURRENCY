
import React, { useState, useEffect } from 'react';
import { Landmark, Clock } from 'lucide-react';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            < Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">Bade Currency</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">汇率记账 & 利润计算</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" /> System Time
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">{time.toLocaleDateString('en-GB')}</span>
              <span className="text-sm font-mono font-black text-blue-600">{time.toLocaleTimeString('zh-CN', { hour12: false })}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
