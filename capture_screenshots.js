const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROUTES = [
    { name: "Admin Login", url: "http://localhost:5174/admin/login" },
    { name: "Admin Register", url: "http://localhost:5174/admin/register" },
    { name: "Admin Dashboard", url: "http://localhost:5174/admin/dashboard", adminAuth: true },
    { name: "User Management", url: "http://localhost:5174/admin/users", adminAuth: true },
    { name: "Transaction Management", url: "http://localhost:5174/admin/transactions", adminAuth: true },
    { name: "Cashbook Management", url: "http://localhost:5174/admin/cashbooks", adminAuth: true },
    { name: "System Analytics", url: "http://localhost:5174/admin/analytics", adminAuth: true },
    
    { name: "User Login", url: "http://localhost:5174/login" },
    { name: "User Register", url: "http://localhost:5174/signup" },
    { name: "Landing Page (Index)", url: "http://localhost:5174/" },
    { name: "Dashboard (Home)", url: "http://localhost:5174/dashboard", userAuth: true },
    { name: "User Cashbooks", url: "http://localhost:5174/dashboard/cashbooks", userAuth: true },
    { name: "Transactions Page", url: "http://localhost:5174/dashboard/transactions", userAuth: true },
    { name: "Add Transaction Popup", url: "http://localhost:5174/dashboard/transactions", userAuth: true },
    { name: "Party Ledger", url: "http://localhost:5174/dashboard/party-ledger", userAuth: true },
    { name: "EMI & Subs", url: "http://localhost:5174/dashboard/tracker", userAuth: true },
    { name: "Receipts Vault", url: "http://localhost:5174/dashboard/receipts-vault", userAuth: true },
    { name: "Reminders", url: "http://localhost:5174/dashboard/reminders", userAuth: true },
    { name: "Payment Mode", url: "http://localhost:5174/dashboard/payment-modes", userAuth: true },
    { name: "Invitations", url: "http://localhost:5174/dashboard/invitations", userAuth: true },
    { name: "Reports", url: "http://localhost:5174/dashboard/reports", userAuth: true },
    { name: "History", url: "http://localhost:5174/dashboard/history", userAuth: true },
    { name: "Profile", url: "http://localhost:5174/dashboard/settings/profile", userAuth: true },
    { name: "Active Sessions", url: "http://localhost:5174/dashboard/settings/sessions", userAuth: true },
    { name: "Preferences", url: "http://localhost:5174/dashboard/settings/preferences", userAuth: true },
];

async function captureAndInject() {
    console.log('Launching browser for screenshots...');
    const browser = await puppeteer.launch({ 
        headless: "new",
        defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Set auth tokens to bypass redirects
    try {
        await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 15000 });
    } catch(e){}
    await page.evaluate(() => {
        sessionStorage.setItem('cashbook_admin_authenticated', 'true');
        sessionStorage.setItem('cashbook_admin_user', JSON.stringify({ is_admin: true, email_id: 'admin@test.com', username: 'Admin' }));
        localStorage.setItem('user', JSON.stringify({ email_id: 'user@test.com', username: 'TestUser' }));
        localStorage.setItem('token', 'dummy_auth_token_for_screenshots');
        localStorage.setItem('cashbook-ui-theme', 'light');
    });

    const screenshots = {};

    for (let route of ROUTES) {
        console.log(`Capturing ${route.name}...`);
        try {
            await page.goto(route.url, { waitUntil: 'networkidle2', timeout: 15000 });
        } catch (e) {
            console.log(`Timeout or error on ${route.name}, continuing anyway.`);
        }
        
        // Hide splash screens or loaders if any
        await page.evaluate(() => {
            const splash = document.querySelector('.splash-screen'); // if exists
            if (splash) splash.remove();
        });

        // Small delay to ensure animations finish
        await new Promise(r => setTimeout(r, 1000));
        
        // If it's Add Transaction, try to open the modal
        if (route.name === "Add Transaction Popup") {
            await page.evaluate(() => {
                const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add') || b.innerText.includes('Add'));
                if (addBtn) addBtn.click();
            });
            await new Promise(r => setTimeout(r, 1000));
        }

        const buffer = await page.screenshot({ type: 'png' });
        screenshots[route.name] = buffer.toString('base64');
    }
    
    await browser.close();

    console.log('Screenshots captured. Injecting into HTML...');
    
    let htmlPath = path.join(__dirname, 'Cash_Book_Project_Report.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Replace the empty placeholders
    for (let route of ROUTES) {
        // Find the <h3> matching route.name and replace the next <div class="diagram-placeholder">
        // Using a regex to find the exact h3 and its following div
        // e.g. <h3 style="margin-top: 30px;">Admin Login</h3>
        // <div class="diagram-placeholder" style="height: 350px;"></div>
        
        // Escape special chars in name
        const safeName = route.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(<h3[^>]*>\\s*${safeName}\\s*</h3>\\s*<div class="diagram-placeholder"[^>]*>)`, 'i');
        
        if (regex.test(htmlContent)) {
            const imgHtml = `<img src="data:image/png;base64,${screenshots[route.name]}" width="480" height="300" style="display: block; margin: 0 auto 20px auto; border-radius: 8px; border: 1px solid #ccc;" />`;
            htmlContent = htmlContent.replace(regex, `$1\n${imgHtml}`);
            console.log(`Injected image for ${route.name}`);
        } else {
            console.log(`Could not find placeholder for ${route.name}`);
        }
    }
    
    // Remove background colors and dashed borders from placeholders so it looks like just the image
    htmlContent = htmlContent.replace(/\.diagram-placeholder \{([^}]+)\}/, '.diagram-placeholder { margin: 20px 0; display: flex; justify-content: center; align-items: center; }');

    fs.writeFileSync(htmlPath, htmlContent);
    console.log('HTML updated successfully!');
}

captureAndInject().catch(err => console.error(err));
