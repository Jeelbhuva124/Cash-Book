const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function createWordFriendlyDoc() {
  const htmlPath = path.join(__dirname, 'Cash_Book_Project_Report.html');
  const outPath = path.join(__dirname, 'Cash_Book_Project_Report_Word_Friendly.doc');
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // 1. Remove all style tags
  const styles = document.querySelectorAll('style');
  styles.forEach(s => s.remove());
  
  // 2. Add basic Word-friendly styles
  const newStyle = document.createElement('style');
  newStyle.innerHTML = `
    body {
        font-family: 'Calibri', 'Arial', sans-serif;
        background-color: white;
        color: black;
        margin: 0;
        padding: 0;
    }
    .page {
        page-break-after: always;
        padding: 40px;
    }
    h1, h2, h3, h4 {
        color: #2c3e50;
    }
    .title-box {
        background-color: white;
        border: 2px solid #3498db;
        color: #2c3e50;
        padding: 10px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin: 20px 0;
    }
    .page-header {
        text-align: left;
        border-bottom: 2px solid #8B0000;
        padding-bottom: 5px;
        margin-bottom: 20px;
        color: #333;
        font-weight: bold;
    }
    .sub-title {
        font-size: 20px;
        font-weight: bold;
        margin: 20px 0 10px 0;
    }
    .text-red {
        color: #8B0000 !important;
    }
    .text-center {
        text-align: center;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    table, th, td {
        border: 1px solid black;
    }
    th, td {
        padding: 10px;
        text-align: left;
    }
    th {
        background-color: #f3f4f6;
        color: black;
        font-weight: bold;
    }
    .footer-line {
        border-top: 2px solid #8B0000;
        margin-top: 30px;
        padding-top: 5px;
    }
    .page-number {
        text-align: right;
        font-weight: bold;
    }
    .diagram-placeholder {
        border: 2px dashed #999;
        text-align: center;
        padding: 50px 20px;
        margin: 20px 0;
        background-color: #f9f9f9;
        color: #666;
    }
  `;
  document.head.appendChild(newStyle);
  
  // Clean up any inline styles on tables that might cause dark themes
  const tables = document.querySelectorAll('table');
  tables.forEach(t => {
      t.removeAttribute('class');
      t.style = "";
      const ths = t.querySelectorAll('th');
      ths.forEach(th => { th.style = ""; th.removeAttribute('class'); });
      const tds = t.querySelectorAll('td');
      tds.forEach(td => { td.style = ""; td.removeAttribute('class'); });
  });
  
  // Remove scripts
  const scripts = document.querySelectorAll('script');
  scripts.forEach(s => s.remove());
  
  fs.writeFileSync(outPath, document.documentElement.outerHTML);
  console.log('Word-friendly DOC generated successfully!');
}

createWordFriendlyDoc().catch(console.error);
