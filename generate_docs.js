const fs = require('fs');
const path = require('path');
const htmlToDocx = require('html-to-docx');
const PptxGenJS = require('pptxgenjs');
const { JSDOM } = require('jsdom');

async function generateDocx() {
  const htmlPath = path.join(__dirname, 'Cash_Book_Project_Report.html');
  const docxPath = path.join(__dirname, 'Cash_Book_Project_Report.docx');
  
  console.log('Reading HTML...');
  let htmlString = fs.readFileSync(htmlPath, 'utf8');

  // Strip scripts and handle mermaid gracefully for docx
  htmlString = htmlString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Clean up table styles to prevent docx errors
  htmlString = htmlString.replace(/<table[^>]*>/g, "<table>");
  htmlString = htmlString.replace(/<td[^>]*>/g, "<td>");
  htmlString = htmlString.replace(/<th[^>]*>/g, "<th>");
  
  // HTML-to-docx works best with clean semantic HTML. We'll pass the string directly.
  console.log('Generating DOCX...');
  const fileBuffer = await htmlToDocx(htmlString, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });

  fs.writeFileSync(docxPath, fileBuffer);
  console.log('DOCX generated successfully at', docxPath);
}

async function generatePptx() {
  const pptxPath = path.join(__dirname, 'Cash_Book_Project_Report.pptx');
  let pres = new PptxGenJS();

  pres.layout = 'LAYOUT_16x9';

  // Slide 1: Title
  let slide1 = pres.addSlide();
  slide1.addText('PROJECT REPORT', { x: 1, y: 1.5, w: '80%', fontSize: 24, bold: true, align: 'center', color: '363636' });
  slide1.addText('Cash-Book: Smart Finance & Digital Ledger', { x: 1, y: 2.2, w: '80%', fontSize: 36, bold: true, align: 'center', color: 'ff0000' });
  slide1.addText('Submitted By:\nStudent 1 (ID)\nStudent 2 (ID)\nStudent 3 (ID)', { x: 1, y: 4.5, w: '40%', fontSize: 16, color: '363636' });
  slide1.addText('Guided By:\nGuide Name', { x: 5, y: 4.5, w: '40%', fontSize: 16, align: 'right', color: '363636' });

  // Slide 2: Introduction
  let slide2 = pres.addSlide();
  slide2.addText('1. Introduction', { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: '2c3e50', border: [0,0,{pt:2, color:'3498db'},0] });
  slide2.addText([
    { text: 'Aims to simplify personal and small business finance management.' },
    { text: 'Eliminates limitations of traditional paper ledgers (data loss, manual errors).' },
    { text: 'Offers essential features like tracking income, expenses, debts, EMI, and receipts.' },
    { text: 'Acts as a digital companion for better financial decisions.' }
  ], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, bullet: true, color: '333333', lineSpacing: 35 });

  // Slide 3: Technology
  let slide3 = pres.addSlide();
  slide3.addText('2. Technology Stack', { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: '2c3e50', border: [0,0,{pt:2, color:'3498db'},0] });
  slide3.addText([
    { text: 'Frontend: React (Vite), Tailwind CSS, Framer Motion', options: { bullet: true } },
    { text: 'Backend: Node.js, Express.js', options: { bullet: true } },
    { text: 'Database: MongoDB (Mongoose)', options: { bullet: true } },
    { text: 'Tools: VS Code, Git, GitHub, Postman', options: { bullet: true } }
  ], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: '333333', lineSpacing: 40 });

  // Slide 4: Features
  let slide4 = pres.addSlide();
  slide4.addText('3. Key Features', { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: '2c3e50', border: [0,0,{pt:2, color:'3498db'},0] });
  slide4.addText([
    { text: 'Daily transaction tracking (Income/Expense)' },
    { text: 'Party Ledger (Udhaar Book)' },
    { text: 'EMI & Subscription tracking' },
    { text: 'Receipts Vault for bills' },
    { text: 'Advanced analytics and reports' },
    { text: 'Shared cashbooks' }
  ], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, bullet: true, color: '333333', lineSpacing: 35 });

  // Slide 5: Thank You
  let slide5 = pres.addSlide();
  slide5.addText('Thank You', { x: 1, y: 2.5, w: '80%', fontSize: 48, bold: true, align: 'center', color: '2c3e50' });

  console.log('Generating PPTX...');
  await pres.writeFile({ fileName: pptxPath });
  console.log('PPTX generated successfully at', pptxPath);
}

async function run() {
  try {
    await generateDocx();
    await generatePptx();
    console.log('Done.');
  } catch (err) {
    console.error('Error generating documents:', err);
  }
}

run();
