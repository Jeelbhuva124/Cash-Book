export const formatCurrency = (amount, overrideFormat = null) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  const format = overrideFormat || localStorage.getItem('pref_currencyFormat') || 'full';
  const num = Number(amount);
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (format === 'international') {
    if (absNum >= 1.0e+9) return `${sign}₹ ${(absNum / 1.0e+9).toFixed(1).replace(/\.0$/, '')} B`;
    if (absNum >= 1.0e+6) return `${sign}₹ ${(absNum / 1.0e+6).toFixed(1).replace(/\.0$/, '')} M`;
    if (absNum >= 1.0e+3) return `${sign}₹ ${(absNum / 1.0e+3).toFixed(1).replace(/\.0$/, '')} K`;
    return `${sign}₹${absNum.toLocaleString('en-US')}`;
  } 
  
  if (format === 'indian') {
    if (absNum >= 1.0e+7) return `${sign}₹ ${(absNum / 1.0e+7).toFixed(1).replace(/\.0$/, '')} Cr`;
    if (absNum >= 1.0e+5) return `${sign}₹ ${(absNum / 1.0e+5).toFixed(1).replace(/\.0$/, '')} L`;
    if (absNum >= 1.0e+3) return `${sign}₹ ${(absNum / 1.0e+3).toFixed(1).replace(/\.0$/, '')} K`;
    return `${sign}₹${absNum.toLocaleString('en-IN')}`;
  }

  // full format defaults to Indian comma system (since the app uses ₹)
  return `${sign}₹${absNum.toLocaleString('en-IN')}`;
};
