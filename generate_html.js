const fs = require('fs');
const ROUTES = [
    { name: "Admin Login" },
    { name: "Admin Register" },
    { name: "Admin Dashboard" },
    { name: "User Management" },
    { name: "Transaction Management" },
    { name: "Cashbook Management" },
    { name: "System Analytics" },
    { name: "Landing Page (Index)" },
    { name: "User Login" },
    { name: "User Register" },
    { name: "Dashboard (Home)" },
    { name: "User Cashbooks" },
    { name: "Transactions Page" },
    { name: "Add Transaction Popup" },
    { name: "Party Ledger" },
    { name: "EMI & Subs" },
    { name: "Receipts Vault" },
    { name: "Reminders" },
    { name: "Payment Mode" },
    { name: "Invitations" },
    { name: "Reports" },
    { name: "History" },
    { name: "Profile" },
    { name: "Active Sessions" },
    { name: "Preferences" },
];

let html = \<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cash-Book: Smart Finance & Digital Ledger</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f7f6; }
        .container { max-width: 900px; margin: auto; background: #fff; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .page { page-break-after: always; margin-bottom: 40px; }
        h1, h2, h3 { color: #2c3e50; }
        h1 { font-size: 2.5em; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px; margin-bottom: 30px; }
        h2 { font-size: 1.8em; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; margin-top: 40px; }
        .diagram-placeholder { margin: 20px 0; display: flex; justify-content: center; align-items: center; }
        img { max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px; border: 1px solid #ccc; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .text-center { text-align: center; }
        .text-red { color: #e74c3c; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; }
        th { background-color: #3498db; color: #fff; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Title Page -->
        <div class="page text-center" style="display: flex; flex-direction: column; justify-content: center; height: 800px;">
            <h1 style="font-size: 3em; border: none; margin-bottom: 10px;">Cash-Book</h1>
            <h2 style="font-size: 1.5em; color: #7f8c8d; border: none; margin-top: 0;">Smart Finance & Digital Ledger</h2>
            <div style="margin: 40px 0;">
                <h3 style="margin: 20px 0;">ON</h3>
                <h2 style="color: #3498db;">FINANCE MANAGEMENT SYSTEM</h2>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 60px; padding: 0 50px;">
                <h3 style="color: red; font-size: 22px;">SUBMITTED BY:</h3>
                <h3 style="color: red; font-size: 22px;">GUIDED BY:</h3>
            </div>
        </div>

        <!-- Introduction -->
        <div class="page">
            <h2>1. Introduction</h2>
            <p><strong>Cash-Book</strong> is a modern, responsive, and secure web application designed to simplify financial tracking for individuals and small businesses. It replaces traditional paper-based ledgers with an intuitive digital interface.</p>
            <h3>Key Features:</h3>
            <ul>
                <li>Real-time Income and Expense tracking</li>
                <li>Multi-user role support (Admin and Standard Users)</li>
                <li>Secure Authentication (JWT based)</li>
                <li>Party Ledger for managing lending and borrowing (Udhaar)</li>
                <li>Receipts Vault for storing transaction proofs</li>
                <li>Automated EMI & Subscription reminders</li>
                <li>Comprehensive Analytics and Reports</li>
            </ul>
        </div>

        <!-- Architecture -->
        <div class="page">
            <h2>2. System Architecture</h2>
            <p>The application follows a standard Three-Tier Architecture:</p>
            <ul>
                <li><strong>Presentation Layer (Frontend):</strong> React.js, Tailwind CSS, Lucide Icons. Provides a responsive and interactive user interface.</li>
                <li><strong>Application Layer (Backend):</strong> Node.js, Express.js. Handles business logic, API endpoints, and authentication.</li>
                <li><strong>Data Layer (Database):</strong> PostgreSQL. Ensures ACID compliance and secure data storage.</li>
            </ul>
        </div>

        <!-- Flow Diagram -->
        <div class="page">
            <h2>3. System Flow</h2>
            <h3 class="text-red text-center" style="margin-top: 30px;">Start To End Process</h3>
            <div class="diagram-placeholder" style="height: 400px; background-color: #f8f9fa; border: 2px dashed #ccc; border-radius: 8px;">
                <img src="flow.png" width="600" height="400" alt="Flow Diagram" style="width: 600px; max-width: 100%; height: auto;" />
            </div>
        </div>

        <!-- UI Screenshots -->
        <div class="page">
            <h2>4. User Interface Screenshots</h2>
\;

for (let i = 0; i < ROUTES.length; i++) {
    html += \
            <h3 style="margin-top: 30px;">\</h3>
            <div class="diagram-placeholder" style="min-height: 200px;"></div>
\;
    if ((i + 1) % 2 === 0 && i !== ROUTES.length - 1) {
        html += \        </div>\n        <div class="page">\n\;
    }
}

html += \
        </div>
    </div>
</body>
</html>
\;

fs.writeFileSync('Cash_Book_Project_Report.html', html);
console.log('HTML regenerated.');
