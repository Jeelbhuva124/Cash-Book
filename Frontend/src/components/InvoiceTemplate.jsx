import React from 'react';
import { formatCurrency } from '../utils/currencyFormatter';

const ROWS_PER_PAGE = 18;

const InvoiceTemplate = React.forwardRef(({ user, transactions = [], timePeriod: customPeriod }, ref) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  const totalIncome = safeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
  const totalExpense = safeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
  const balance = totalIncome - totalExpense;

  const today = new Date();
  const timePeriod = customPeriod || today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  
  // Format username matching the design (defaulting to Jash Narola if guest or unassigned)
  const userName = 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : null) ||
    user?.name ||
    user?.username ||
    (user?.email_id ? user.email_id.split('@')[0] : null) ||
    'Jash Narola';

  // Chunk transactions into pages of ROWS_PER_PAGE
  const pages = [];
  if (safeTransactions.length === 0) {
    pages.push([]);
  } else {
    for (let i = 0; i < safeTransactions.length; i += ROWS_PER_PAGE) {
      pages.push(safeTransactions.slice(i, i + ROWS_PER_PAGE));
    }
  }

  const totalPages = pages.length;

  return (
    <div ref={ref} className="invoice-document-root flex flex-col gap-6">
      {pages.map((pageTransactions, pageIndex) => {
        const isLastPage = pageIndex === totalPages - 1;
        const pageNum = pageIndex + 1;
        const startingIndex = pageIndex * ROWS_PER_PAGE;
        
        // Pad with empty rows to create a full accounting sheet look
        const minRows = isLastPage ? Math.max(pageTransactions.length, 12) : ROWS_PER_PAGE;
        const paddedRows = [
          ...pageTransactions,
          ...Array(Math.max(0, minRows - pageTransactions.length)).fill(null)
        ];

        return (
          <div
            key={`page-${pageIndex}`}
            className="a4-page-sheet font-sans relative bg-white text-[#111827] flex flex-col justify-between overflow-hidden shadow-2xl"
            style={{
              width: '794px',
              height: '1123px',
              minHeight: '1123px',
              maxHeight: '1123px',
              boxSizing: 'border-box'
            }}
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.035]">
              <img
                src="/logo.png"
                alt="Watermark"
                className="w-[420px] h-[420px] object-contain"
                crossOrigin="anonymous"
              />
            </div>

            {/* TOP HEADER SECTION (Matches media_1791909157101.png exactly) */}
            <div className="relative z-10 w-full bg-[#5a75f6] text-white px-9 py-6 flex justify-between items-center shadow-sm">
              {/* Left Logo + Title */}
              <div className="flex items-center gap-4">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-[#172554] border-2 border-white flex items-center justify-center shrink-0 shadow-md">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain p-0.5"
                    crossOrigin="anonymous"
                  />
                </div>
                <div>
                  <h1 className="text-[25px] font-black tracking-[0.06em] uppercase text-white font-sans leading-tight">
                    ACCOUNTING LEDGER
                  </h1>
                  <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-white/90 mt-1">
                    CASH–BOOK OFFICIAL REPORT
                  </p>
                </div>
              </div>

              {/* Right Prepared For & Time Period */}
              <div className="text-right flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 leading-none">
                    PREPARED FOR
                  </p>
                  <p className="text-[19px] font-bold text-white tracking-wide mt-1 leading-snug">
                    {userName}
                  </p>
                </div>
                <div className="mt-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 leading-none">
                    TIME PERIOD
                  </p>
                  <p className="text-[17px] font-bold text-white tracking-wide mt-0.5 leading-snug">
                    {timePeriod}
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative z-10 px-8 pt-5 flex-1 flex flex-col">
              {/* Table */}
              <table className="w-full text-sm text-left border-collapse border border-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#5a75f6] text-white">
                    <th className="py-2.5 px-3 font-bold border-r border-white/80 w-12 text-center uppercase tracking-wider text-xs">
                      NO
                    </th>
                    <th className="py-2.5 px-3 font-bold border-r border-white/80 w-28 text-center uppercase tracking-wider text-xs">
                      DATE
                    </th>
                    <th className="py-2.5 px-4 font-bold border-r border-white/80 text-center uppercase tracking-wider text-xs">
                      DESCRIPTION
                    </th>
                    <th className="py-2.5 px-3 font-bold border-r border-white/80 w-32 text-center uppercase tracking-wider text-xs">
                      INCOME
                    </th>
                    <th className="py-2.5 px-3 font-bold w-32 text-center uppercase tracking-wider text-xs">
                      EXPENSE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paddedRows.map((t, idx) => {
                    const rowNumber = startingIndex + idx + 1;
                    const isEven = idx % 2 === 0;
                    const rowBg = isEven ? 'bg-white' : 'bg-[#f6f9ff]';

                    if (!t) {
                      return (
                        <tr key={`empty-${idx}`} className={`border-b border-[#cbd5e1] ${rowBg} h-8`}>
                          <td className="py-1 px-3 border-r border-[#cbd5e1] text-center text-slate-300 text-xs font-medium">
                            {rowNumber}
                          </td>
                          <td className="py-1 px-3 border-r border-[#cbd5e1]"></td>
                          <td className="py-1 px-4 border-r border-[#cbd5e1]"></td>
                          <td className="py-1 px-3 border-r border-[#cbd5e1]"></td>
                          <td className="py-1 px-3"></td>
                        </tr>
                      );
                    }

                    const inc = t.type === 'income' ? Number(t.amount || 0) : 0;
                    const exp = t.type === 'expense' ? Number(t.amount || 0) : 0;
                    const dateFormatted = t.date 
                      ? new Date(t.date).toLocaleDateString('en-GB') 
                      : '-';

                    return (
                      <tr key={t.id || t._id || idx} className={`border-b border-[#cbd5e1] ${rowBg} h-8`}>
                        <td className="py-1.5 px-3 text-center border-r border-[#cbd5e1] text-xs font-semibold text-slate-500">
                          {rowNumber}
                        </td>
                        <td className="py-1.5 px-3 border-r border-[#cbd5e1] text-center text-xs font-medium text-slate-700 whitespace-nowrap">
                          {dateFormatted}
                        </td>
                        <td className="py-1.5 px-4 border-r border-[#cbd5e1] text-xs font-semibold text-slate-800">
                          <span className="truncate inline-block max-w-[270px] align-middle">
                            {t.title || 'Untitled Transaction'}
                          </span>
                          {t.category && (
                            <span className="text-[10px] text-slate-500 font-normal ml-1.5">
                              • {t.category}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-3 text-right border-r border-[#cbd5e1] text-xs font-bold text-emerald-600">
                          {inc > 0 ? formatCurrency(inc) : ''}
                        </td>
                        <td className="py-1.5 px-3 text-right text-xs font-bold text-rose-600">
                          {exp > 0 ? formatCurrency(exp) : ''}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Totals Row (displayed on the last page) */}
                  {isLastPage && (
                    <tr className="bg-[#5a75f6] text-white border-b border-[#cbd5e1]">
                      <td colSpan="3" className="py-2.5 px-4 font-black text-xs border-r border-white/80 uppercase tracking-wider text-right">
                        TOTALS:
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-xs border-r border-white/80 tracking-wide">
                        {formatCurrency(totalIncome)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-xs tracking-wide">
                        {formatCurrency(totalExpense)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Last Page Summary and Sign-off */}
              {isLastPage && (
                <div className="mt-4 space-y-3">
                  {/* Balance Bar */}
                  <div className="bg-[#f0f4ff] border border-[#cbd5e1] rounded-lg p-3 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Net Ledger Balance
                      </p>
                      <p className={`text-xl font-black tracking-wide ${balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {formatCurrency(balance)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        balance >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {balance >= 0 ? 'Surplus Account' : 'Deficit Account'}
                      </span>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1">
                        {safeTransactions.length} Verified Entries
                      </p>
                    </div>
                  </div>

                  {/* Signatures & Certification Area */}
                  <div className="pt-2 flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                          Official Certified Document
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Verification Ref: CB-LEDGER-{today.getFullYear()}-{today.getMonth() + 1}-{(safeTransactions.length * 17) + 101}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Generated: {today.toLocaleDateString('en-GB')} {today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-center flex flex-col items-center">
                      <img
                        src="/signature.png"
                        alt="Signature"
                        className="h-11 object-contain mb-1"
                        crossOrigin="anonymous"
                      />
                      <div className="border-t border-slate-400 w-48 pt-1 text-center font-bold text-xs text-slate-800">
                        {userName}
                      </div>
                      <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER BAR */}
            <div className="relative z-10 w-full px-8 py-3 border-t border-slate-200 flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-white">
              <span>© {today.getFullYear()} Cash-Book Official Accounting</span>
              <span>Official Financial Statement</span>
              <span>Page {pageNum} of {totalPages}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
