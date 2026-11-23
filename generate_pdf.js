const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  console.log('Launching puppeteer...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.join(__dirname, 'Cash_Book_Project_Report.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  
  console.log('Loading HTML file...');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  console.log('Preparing page for printing...');
  await page.evaluate(() => {
    // Hide manual page boundaries and footers for PDF print
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white !important; padding: 0 !important; margin: 0 !important; display: block !important; }
        .page { 
          box-shadow: none !important; 
          margin: 0 !important; 
          padding: 0 !important; 
          width: auto !important; 
          min-height: auto !important; 
        }
        .page-header, .footer-line, .page-number { display: none !important; }
        .title-box { page-break-before: always !important; page-break-after: avoid !important; display: block !important; }
        h1, h2, h3, h4, h5, .sub-title, .section-title { page-break-after: avoid !important; }
        img, .mermaid, table, .diagram-placeholder { page-break-inside: avoid !important; }
        ul, ol, li, p { page-break-inside: avoid !important; }
      }
    `;
    document.head.appendChild(style);
  });

  const pdfPath = path.join(__dirname, 'Cash_Book_Project_Report.pdf');

  console.log('Saving PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; font-size: 9px; font-weight: 600; color: #888; padding: 0 20mm; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; box-sizing: border-box;">
        <div style="border-bottom: 1px solid #eaeaea; width: 100%; padding-bottom: 5px;">
          Cash-Book: Smart Finance & Digital Ledger
        </div>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 9px; color: #aaa; padding: 0 20mm; font-family: sans-serif; box-sizing: border-box;">
        <div style="border-top: 1px solid #eaeaea; width: 100%; padding-top: 5px; text-align: right;">
          <span class="pageNumber"></span>
        </div>
      </div>
    `,
    margin: {
      top: '25mm',
      bottom: '25mm',
      left: '20mm',
      right: '20mm'
    }
  });
  
  await browser.close();
  console.log('PDF saved successfully!');
}

generatePDF().catch(console.error);
