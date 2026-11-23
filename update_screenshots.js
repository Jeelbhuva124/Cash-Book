const fs = require('fs');
let content = fs.readFileSync('capture_screenshots.js', 'utf8');

// Replace Tracker / Reports Analytics with Reports
content = content.replace('{ name: "Tracker / Reports Analytics", url: "http://localhost:5174/dashboard/reports", userAuth: true },', '{ name: "Reports", url: "http://localhost:5174/dashboard/reports", userAuth: true },');

// Add new routes
const newRoutes = 
    { name: "User Cashbooks", url: "http://localhost:5174/dashboard/cashbooks", userAuth: true },
    { name: "EMI & Subs", url: "http://localhost:5174/dashboard/tracker", userAuth: true },
    { name: "Payment Mode", url: "http://localhost:5174/dashboard/payment-modes", userAuth: true },
    { name: "Invitations", url: "http://localhost:5174/dashboard/invitations", userAuth: true },
    { name: "History", url: "http://localhost:5174/dashboard/history", userAuth: true },
;

content = content.replace('{ name: "Reminders", url: "http://localhost:5174/dashboard/reminders", userAuth: true },', '{ name: "Reminders", url: "http://localhost:5174/dashboard/reminders", userAuth: true },' + newRoutes);

fs.writeFileSync('capture_screenshots.js', content);
console.log('Updated capture_screenshots.js');
