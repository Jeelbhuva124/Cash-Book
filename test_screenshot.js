const puppeteer = require('puppeteer');

async function testScreenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'test_login.png' });
    
    await browser.close();
    console.log('Screenshot saved!');
}

testScreenshot();
