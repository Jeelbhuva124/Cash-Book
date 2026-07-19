import React from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { Phone, Mail, MapPin } from 'lucide-react';

// A perfectly styled A4 container mimicking the graphic design layout
const InvoiceTemplate = React.forwardRef(({ user, transactions }, ref) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netTotal = totalIncome - totalExpense;
  
  const today = new Date();
  const printDate = today.toLocaleString('en-IN', { hour12: true }).split(',')[0];
  const dueDateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+2).toString().padStart(2, '0')}/${today.getFullYear()}`;
  const invoiceNo = `INV-${today.getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.username || 'Guest User');
  const userPhone = user?.phone || '+000 0000 000';
  const userEmail = user?.email || user?.email_id || 'name@gmail.com';
  const userAddress = user?.city ? `${user.city}, ${user.country}` : 'Address Here, City Here';

  return (
    <div 
      ref={ref} 
      className="font-sans relative overflow-hidden inv-page"
    >
      {/* Foreground Watermark (Overlay) - Ensures perfect visibility over table rows in html2canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[60]">
         <img src="/logo.png" alt="Watermark" className="w-[450px] h-[450px] object-contain inv-watermark" crossOrigin="anonymous" />
      </div>

      {/* Top Graphic Elements */}
      <svg className="absolute top-0 left-0 w-[400px] h-[150px]" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M 0 0 L 250 0 L 150 150 L -50 150 Z" fill="#e2e8f0" opacity="1" />
         <path d="M -20 0 L 180 0 L 100 120 L -60 120 Z" fill="#cbd5e1" opacity="1" />
         <path d="M -40 0 L 120 0 L 60 90 L -80 90 Z" fill="#94a3b8" opacity="0.5" />
      </svg>
      
      {/* Right Top Block */}
      <div className="absolute top-0 right-0 w-[300px] h-[120px] flex items-center justify-center rounded-bl-3xl inv-brand-bg">
        <h1 className="text-4xl font-black tracking-widest uppercase inv-white-text">INVOICE</h1>
      </div>

      <div className="pt-[140px] px-12 pb-[120px] relative z-10 flex flex-col h-full min-h-[1123px]">
        
        {/* Header Details */}
        <div className="flex justify-between items-end mb-10 border-b-2 pb-4 inv-brand-border">
           <div>
             {/* Logo */}
             <div className="flex items-center gap-2 mb-4">
               <img src="/logo.png" alt="Company Logo" className="w-12 h-12 object-contain" crossOrigin="anonymous" />
               <div>
                 <h2 className="text-xl font-black leading-none tracking-tight inv-brand-text">CASH-BOOK</h2>
                 <p className="text-[10px] uppercase font-bold tracking-wider inv-gray-text">Accounting Made Easy</p>
               </div>
             </div>
           </div>
           
           <div className="text-right text-xs space-y-1 inv-gray-dark-text">
              <div className="flex justify-between gap-8"><span className="font-semibold inv-black-text">Invoice No. :</span> {invoiceNo}</div>
              <div className="flex justify-between gap-8"><span className="font-semibold inv-black-text">Invoice Date :</span> {printDate}</div>
              <div className="flex justify-between gap-8"><span className="font-semibold inv-black-text">Due Date :</span> {dueDateStr}</div>
           </div>
        </div>

        {/* Invoice To & Total Due */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider mb-2 inv-brand-text">INVOICE TO</h3>
            <p className="font-bold text-sm inv-black-text">{userName}</p>
            <p className="text-xs italic mb-2 inv-gray-text">{user?.role || 'Admin'}</p>
            <div className="text-xs space-y-0.5 inv-slate-text">
              <p><span className="font-bold">P:</span> {userPhone}</p>
              <p><span className="font-bold">E:</span> {userEmail}</p>
              <p><span className="font-bold">A:</span> {userAddress}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="border border-slate-100 rounded-lg py-2 px-3 text-center min-w-[90px] inv-light-bg">
              <p className="text-[8px] font-black uppercase tracking-wider mb-1 inv-slate-light-text">Total Income</p>
              <p className="text-sm font-black inv-navy-text">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="border border-slate-100 rounded-lg py-2 px-3 text-center min-w-[90px] inv-light-bg">
              <p className="text-[8px] font-black uppercase tracking-wider mb-1 inv-slate-light-text">Total Expense</p>
              <p className="text-sm font-black inv-navy-text">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="border border-slate-100 rounded-lg py-2 px-3 text-center min-w-[90px] inv-light-bg">
              <p className="text-[8px] font-black uppercase tracking-wider mb-1 inv-slate-light-text">Net Balance</p>
              <p className="text-sm font-black inv-navy-text">{formatCurrency(netTotal)}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-8 flex-grow">
          <table className="w-full text-xs text-left border-collapse rounded-lg overflow-hidden">
            <thead className="inv-table-header-bg">
              <tr>
                <th className="py-2.5 px-3 font-bold border-r w-12 text-center inv-border-slate">NO.</th>
                <th className="py-2.5 px-3 font-bold border-r inv-border-slate">CATEGORY</th>
                <th className="py-2.5 px-3 font-bold border-r inv-border-slate">DATE</th>
                <th className="py-2.5 px-3 font-bold border-r text-right inv-border-slate">INCOME (₹)</th>
                <th className="py-2.5 px-3 font-bold border-r text-right inv-border-slate">EXPENSE (₹)</th>
                <th className="py-2.5 px-3 font-bold text-right">NET (₹)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center italic border-b inv-gray-text inv-border-light">No transactions recorded for this period.</td>
                </tr>
              ) : (
                transactions.map((t, idx) => {
                  const inc = t.type === 'income' ? t.amount : 0;
                  const exp = t.type === 'expense' ? t.amount : 0;
                  const net = inc - exp;
                  return (
                    <tr key={idx} className={`border-b inv-border-light ${idx % 2 === 0 ? "inv-white-bg" : "inv-light-bg"}`}>
                      <td className="py-4 px-3 text-center border-r font-semibold text-sm inv-border-light inv-navy-light-text">{idx + 1}</td>
                      <td className="py-4 px-3 border-r inv-border-light">
                        <span className="font-bold text-base inv-navy-light-text">{t.category}</span>
                        {t.title && <span className="block text-[11px] mt-0.5 inv-slate-medium-text">{t.title}</span>}
                      </td>
                      <td className="py-4 px-3 border-r font-semibold text-sm inv-border-light inv-navy-light-text">{new Date(t.date).toLocaleDateString()}</td>
                      <td className={`py-4 px-3 text-right border-r font-bold text-sm inv-border-light ${inc > 0 ? "inv-green-text" : "inv-gray-light-text"}`}>
                        {inc > 0 ? formatCurrency(inc) : '-'}
                      </td>
                      <td className={`py-4 px-3 text-right border-r font-bold text-sm inv-border-light ${exp > 0 ? "inv-red-text" : "inv-gray-light-text"}`}>
                        {exp > 0 ? formatCurrency(exp) : '-'}
                      </td>
                      <td className={`py-4 px-3 text-right font-bold text-sm ${net >= 0 ? "inv-green-text" : "inv-red-text"}`}>
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })
              )}
              {transactions.length > 0 && (
                <tr className="border-t-2 inv-border-slate inv-slate-light-bg">
                  <td colSpan="3" className="py-4 px-3 text-right font-black text-sm uppercase border-r inv-navy-light-text inv-border-light">GRAND TOTAL</td>
                  <td className="py-4 px-3 text-right font-black text-sm border-r inv-green-text inv-border-light">{formatCurrency(totalIncome)}</td>
                  <td className="py-4 px-3 text-right font-black text-sm border-r inv-red-text inv-border-light">{formatCurrency(totalExpense)}</td>
                  <td className={`py-4 px-3 text-right font-black text-sm ${netTotal >= 0 ? "inv-green-text" : "inv-red-text"}`}>{formatCurrency(netTotal)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Area (Kept EXACTLY as requested) */}
        <div className="flex justify-between items-end mt-auto pt-10">
          <div className="w-1/2">
            <h4 className="font-bold mb-1 uppercase text-xs inv-black-text">Terms & Conditions :</h4>
            <p className="text-[10px] leading-relaxed mb-4 inv-gray-text">
              This generated report is provided for informational purposes only. Ensure you verify all figures with a certified public accountant before tax submission.
            </p>
            <div className="flex flex-col gap-2 text-[10px] inv-dark-text">
              <div className="flex items-center gap-2">
                 <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center inv-brand-bg">
                   <Phone className="w-2.5 h-2.5" color="#ffffff" strokeWidth={2.5} />
                 </span>
                 <span className="font-bold">+91 7861908799</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center inv-brand-bg">
                   <Mail className="w-2.5 h-2.5" color="#ffffff" strokeWidth={2.5} />
                 </span>
                 <span className="font-bold">cashbook1204@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center inv-brand-bg">
                   <MapPin className="w-2.5 h-2.5" color="#ffffff" strokeWidth={2.5} />
                 </span>
                 <span className="font-bold">Surat.Gujarat</span>
              </div>
            </div>
          </div>
          <div className="w-1/3 text-center relative">
            <img src="/signature.png" alt="Signature" className="absolute bottom-6 left-1/2 -translate-x-1/2 h-14 w-32 object-contain" crossOrigin="anonymous" />
            <div className="border-b mb-2 h-10 inv-border-dark"></div>
            <p className="text-xs font-semibold inv-dark-text">Authorized Signature</p>
          </div>
        </div>

      </div>

      {/* Bottom Graphic Elements & Contact (Kept EXACTLY as requested) */}
      <div className="absolute bottom-0 left-0 w-full h-[80px] flex items-center justify-center z-10 inv-dark-bg">
        <p className="text-[10px] md:text-xs font-medium tracking-wide inv-white-text-80">
          © 2026 Cash Book. All rights reserved.
        </p>
      </div>
      <svg className="absolute bottom-0 right-0 w-[250px] h-[150px]" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M 50 150 L 250 150 L 250 -50 Z" fill="#1d4ed8" opacity="0.9" />
         <path d="M 120 150 L 250 150 L 250 20 Z" fill="#0f172a" opacity="1" />
      </svg>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
