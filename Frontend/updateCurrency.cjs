const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'Dashboard/pages/Home.jsx',
  'Dashboard/pages/Reminders.jsx',
  'Dashboard/pages/Reports.jsx',
  'Dashboard/pages/Savings.jsx',
  'Dashboard/pages/Cashbooks.jsx',
  'Dashboard/pages/Analytics.jsx',
  'Dashboard/pages/Transactions.jsx'
];

filesToProcess.forEach(file => {
  const filePath = path.join('d:/Cash-Book/Frontend/src', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already imported
  if (!content.includes('formatCurrency')) {
    content = content.replace(/(import React.*?;\n)/, `$1import { formatCurrency } from '../../utils/currencyFormatter';\n`);
    
    // Replace Specific case in Transactions.jsx
    // {totalBalance < 0 ? '-' : ''}₹{Math.abs(totalBalance).toLocaleString()}
    content = content.replace(/\{([a-zA-Z0-9_.\s]+)\s*<\s*0\s*\?\s*'-'\s*:\s*''\}₹\{Math\.abs\(([a-zA-Z0-9_.\s]+)\)\.toLocaleString\(\)\}/g,
      '{formatCurrency($1)}'
    );
    
    // Replace {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
    content = content.replace(/\{([a-zA-Z0-9_.\s]+)\s*===\s*'income'\s*\?\s*'\+'\s*:\s*'-'\}₹\{([a-zA-Z0-9_.\s]+)\.toLocaleString\(\)\}/g, 
      "{$1 === 'income' ? '+' : ''}{formatCurrency($1 === 'income' ? $2 : -$2)}"
    );
    
    // Replace -₹{tx.amount.toLocaleString()}
    content = content.replace(/-₹\{([a-zA-Z0-9_.\s]+)\.toLocaleString\(\)\}/g, '{formatCurrency(-$1)}');
    
    // Replace ₹{amount.toLocaleString()}
    content = content.replace(/₹\{([a-zA-Z0-9_.\s\+\-\(\)]+)\.toLocaleString\(\)\}/g, '{formatCurrency($1)}');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
