import React from 'react';
import { formatCurrency } from '../utils/currencyFormatter';

const InvoiceTemplate = React.forwardRef(({ user, transactions }, ref) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const today = new Date();
  const timePeriod = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.username || 'Guest User');

  return (
    <div ref={ref} className="font-sans relative bg-[#ffffff] w-[794px] min-h-[1123px] text-[#111827]">
      
      {/* Background Watermark (Overlay) - Placed over the table so opaque rows don't hide it */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[60] opacity-15">
         <img src="/logo.png" alt="Watermark" className="w-[500px] h-[500px] object-contain" crossOrigin="anonymous" />
      </div>
      
      {/* Top Header Section */}
      <div className="relative z-10 bg-[#5a75f6] text-[#ffffff] px-10 py-12 flex justify-between items-end">
        <div className="flex items-center gap-5">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" crossOrigin="anonymous" />
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase">ACCOUNTING LEDGER</h1>
            <p className="text-[10px] font-bold opacity-80 tracking-[0.25em] uppercase mt-1">Cash-Book Official Report</p>
          </div>
        </div>
        
        <div className="text-right flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-[#ffffff] opacity-70 font-bold uppercase tracking-widest mb-0.5">Prepared For</p>
            <p className="font-bold text-xl">{userName}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#ffffff] opacity-70 font-bold uppercase tracking-widest mb-0.5">Time Period</p>
            <p className="font-bold text-lg">{timePeriod}</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative z-10 p-8">
        <table className="w-full text-sm text-left border-collapse border border-[#cbd5e1]">
          <thead>
            <tr className="bg-[#5a75f6] text-[#ffffff] border-b border-[#cbd5e1]">
              <th className="py-3 px-4 font-bold border-r border-[#cbd5e1] w-12 text-center uppercase tracking-wider">No</th>
              <th className="py-3 px-4 font-bold border-r border-[#cbd5e1] w-28 text-center uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 font-bold border-r border-[#cbd5e1] uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 font-bold border-r border-[#cbd5e1] w-32 text-center uppercase tracking-wider">Income</th>
              <th className="py-3 px-4 font-bold w-32 text-center uppercase tracking-wider">Expense</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-[#6b7280] italic border border-[#cbd5e1]">No transactions recorded.</td>
              </tr>
            ) : (
              // Pad to ensure there are enough rows to look like the ledger (e.g. at least 25 rows)
              [...transactions, ...Array(Math.max(0, 25 - transactions.length))].map((t, idx) => {
                if (!t) {
                  return (
                    <tr key={`empty-${idx}`} className={`border-b border-[#cbd5e1] ${idx % 2 === 0 ? "bg-[#ffffff]" : "bg-[#eff4ff]"}`}>
                      <td className="py-3 px-4 border-r border-[#cbd5e1] text-center text-[#9ca3af] font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 border-r border-[#cbd5e1]"></td>
                      <td className="py-3 px-4 border-r border-[#cbd5e1]"></td>
                      <td className="py-3 px-4 border-r border-[#cbd5e1]"></td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  )
                }

                const inc = t.type === 'income' ? t.amount : 0;
                const exp = t.type === 'expense' ? t.amount : 0;
                return (
                  <tr key={idx} className={`border-b border-[#cbd5e1] ${idx % 2 === 0 ? "bg-[#ffffff]" : "bg-[#eff4ff]"}`}>
                    <td className="py-3 px-4 text-center border-r border-[#cbd5e1] font-medium text-[#4b5563]">{idx + 1}</td>
                    <td className="py-3 px-4 border-r border-[#cbd5e1] text-center font-medium">{new Date(t.date).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4 border-r border-[#cbd5e1]">
                      {t.title} {t.category && <span className="text-[#6b7280] ml-1 text-xs">- {t.category}</span>}
                    </td>
                    <td className="py-3 px-4 text-right border-r border-[#cbd5e1] font-semibold">{inc > 0 ? formatCurrency(inc) : ''}</td>
                    <td className="py-3 px-4 text-right font-semibold">{exp > 0 ? formatCurrency(exp) : ''}</td>
                  </tr>
                );
              })
            )}
            
            {/* Totals Row */}
            <tr className="bg-[#5a75f6] text-[#ffffff] border-b border-[#cbd5e1]">
              <td colSpan="3" className="py-4 px-4 font-black text-lg border-r border-[#cbd5e1] uppercase tracking-wider">Totals:</td>
              <td className="py-4 px-4 text-right font-black border-r border-[#cbd5e1] tracking-wider">{formatCurrency(totalIncome)}</td>
              <td className="py-4 px-4 text-right font-black tracking-wider">{formatCurrency(totalExpense)}</td>
            </tr>

            {/* Balance Row */}
            <tr className="bg-[#eff4ff]">
              <td colSpan="3" className="py-5 px-4 font-black text-2xl border-r border-[#cbd5e1] uppercase text-[#111827] tracking-wider">Balance:</td>
              <td colSpan="2" className="py-5 px-4 text-right font-black text-2xl text-[#111827] tracking-wider">
                {formatCurrency(balance)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 text-right text-xs font-bold text-[#5a75f6] tracking-widest uppercase">
          © {today.getFullYear()} Cash-Book Accounting
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
