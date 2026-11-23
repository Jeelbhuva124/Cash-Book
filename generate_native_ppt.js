const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const { JSDOM } = require('jsdom');

async function createSimpleNativePpt() {
    console.log('Parsing HTML...');
    const htmlContent = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    let pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9';

    // Simple Theme Colors
    const primaryColor = '0052cc'; // Professional Blue
    const headerBgColor = '0052cc';
    const rowAltColor = 'f4f5f7';

    // Define slide master
    pres.defineSlideMaster({
        title: 'SIMPLE_MASTER',
        background: { color: 'FFFFFF' },
        margin: [0.5, 0.5, 0.5, 0.5],
        objects: [
            { line: { x: 0.5, y: 1.0, w: '9.0', h: 0, line: { color: primaryColor, width: 2 } } }
        ]
    });

    // Helper to add title
    const addTitle = (slide, text) => {
        slide.addText(text.toUpperCase(), { x: 0.5, y: 0.3, w: '90%', fontSize: 28, bold: true, color: primaryColor, fontFace: 'Arial' });
    };

    // 1. Title Slide
    let slide1 = pres.addSlide();
    slide1.addText('PROJECT REPORT ON', { x: '10%', y: '25%', w: '80%', fontSize: 22, bold: true, color: '333333', align: 'center' });
    slide1.addText('Cash-Book: Smart Finance & Digital Ledger', { x: '10%', y: '35%', w: '80%', fontSize: 36, bold: true, color: primaryColor, align: 'center' });
    
    slide1.addText('SUBMITTED BY:\nBhuva Jeel M. (520)\nSavsaviya Kushal B. (526)\nNarola Jash M. (558)', { x: '10%', y: '60%', w: '40%', fontSize: 16, bold: true, color: '333333' });
    slide1.addText('GUIDED BY:\nMrs. Damyanti Patel', { x: '60%', y: '60%', w: '30%', fontSize: 16, bold: true, color: '333333' });

    // 2. OVERVIEW (Agenda)
    let slideAgenda = pres.addSlide('SIMPLE_MASTER');
    addTitle(slideAgenda, 'Overview');
    slideAgenda.addText([
        { text: 'Introduction\n' },
        { text: 'Project Profile\n' },
        { text: 'Features: Admin Panel\n' },
        { text: 'Features: User Panel\n' },
        { text: 'Database Design\n' },
        { text: 'System UI & User Modules\n' },
        { text: 'References\n' }
    ], { x: 0.5, y: 1.5, w: '80%', fontSize: 20, bullet: true, color: '333333', lineSpacing: 35 });

    // 3. PROJECT PROFILE
    let slideProfile = pres.addSlide('SIMPLE_MASTER');
    addTitle(slideProfile, 'Project Profile');
    slideProfile.addText([
        { text: 'Project Title: ', options: { bold: true } }, { text: 'Cash-Book: Smart Finance & Digital Ledger\n\n' },
        { text: 'Front End Technologies: ', options: { bold: true } }, { text: 'React, Tailwind CSS\n\n' },
        { text: 'Back End Technologies: ', options: { bold: true } }, { text: 'Node.js, Express, MongoDB\n\n' },
        { text: 'Platform: ', options: { bold: true } }, { text: 'Web Browser\n\n' },
        { text: 'IDE: ', options: { bold: true } }, { text: 'VS Code\n\n' },
        { text: 'Internal Guide: ', options: { bold: true } }, { text: 'Mrs. Damyanti Patel\n\n' },
        { text: 'Submitted to: ', options: { bold: true } }, { text: 'Mrs. Damyanti Patel\n\n' }
    ], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: '333333' });

    // 4. PROJECT OVERVIEW
    let slideIntro = pres.addSlide('SIMPLE_MASTER');
    addTitle(slideIntro, 'Project Overview');
    slideIntro.addText([
        { text: 'Cash-Book is a smart finance and digital ledger application that simplifies financial management for individuals and small businesses.\n\n' },
        { text: 'It enables users to track income and expenses efficiently, providing a complete dashboard for managing cashflows similar to traditional physical ledgers but digitized.\n\n' },
        { text: 'Cash-Book contains two main panels:\n' },
        { text: 'Admin Panel\n', options: { bullet: true, indentLevel: 1 } },
        { text: 'User Panel\n', options: { bullet: true, indentLevel: 1 } }
    ], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: '333333' });

    // 5. FEATURES : ADMIN PANEL
    let slideAdminFeat = pres.addSlide('SIMPLE_MASTER');
    addTitle(slideAdminFeat, 'Features : Admin Panel');
    slideAdminFeat.addText([
        { text: 'Requires secure login with an Admin account.\n' },
        { text: 'Dashboard with real-time system analytics and statistics.\n' },
        { text: 'Admin can manage customer/user accounts.\n' },
        { text: 'Admin can monitor platform transactions.\n' },
        { text: 'View all user details, active sessions, and cashbook logs.\n' }
    ], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: '333333', bullet: true, lineSpacing: 35 });

    // 6. FEATURES : USER PANEL
    let slideUserFeat = pres.addSlide('SIMPLE_MASTER');
    addTitle(slideUserFeat, 'Features : User Panel');
    slideUserFeat.addText([
        { text: 'New user sign-up and secure login for existing users.\n' },
        { text: 'Personalized dashboard showing income, expense, and balance.\n' },
        { text: 'Create multiple Cashbooks for different purposes/businesses.\n' },
        { text: 'Add, edit, or delete transactions with real-time balance updates.\n' },
        { text: 'Party Ledger and EMI & Subscription management.\n' },
        { text: 'Receipts vault to upload and store payment proofs.\n' },
        { text: 'Generate detailed PDF/Excel reports of transactions.\n' }
    ], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, color: '333333', bullet: true, lineSpacing: 30 });

    // 7. DATABASE DESIGN Title Slide
    let slideDbTitle = pres.addSlide();
    slideDbTitle.addText('DATABASE DESIGN', { x: '10%', y: '40%', w: '80%', fontSize: 44, bold: true, color: primaryColor, align: 'center' });

    // 8. DB Tables
    const dbTitles = document.querySelectorAll('.db-title');
    const dbTables = document.querySelectorAll('.table-db');

    for (let i = 0; i < dbTitles.length; i++) {
        let titleText = dbTitles[i].textContent.replace(/[?-]/g, '').trim();
        let tableEl = dbTables[i];
        
        let slide = pres.addSlide('SIMPLE_MASTER');
        addTitle(slide, titleText);

        let tableData = [];
        let ths = tableEl.querySelectorAll('thead th');
        let headerRow = [];
        ths.forEach(th => {
            headerRow.push({ text: th.textContent, options: { fill: headerBgColor, color: 'ffffff', bold: true, fontFace: 'Arial', fontSize: 14, margin: 5 } });
        });
        tableData.push(headerRow);

        let trs = tableEl.querySelectorAll('tbody tr');
        trs.forEach((tr, index) => {
            let row = [];
            let tds = tr.querySelectorAll('td');
            let bgFill = (index % 2 === 0) ? rowAltColor : 'ffffff';
            tds.forEach(td => {
                row.push({ text: td.textContent, options: { fill: bgFill, color: '333333', fontFace: 'Arial', fontSize: 13, margin: 5 } });
            });
            if (row.length > 0) tableData.push(row);
        });

        if (tableData.length > 1) {
            slide.addTable(tableData, { x: 0.5, y: 1.2, w: '90%', autoPage: true });
        }
    }

    // 9. UI Screenshots (Dynamically from HTML)
    const headers = document.querySelectorAll('h3');
    headers.forEach(h => {
        let next = h.nextElementSibling;
        if (next && next.classList.contains('diagram-placeholder')) {
            let img = next.querySelector('img');
            if (img && img.src.startsWith('data:image')) {
                let slide = pres.addSlide('SIMPLE_MASTER');
                addTitle(slide, h.textContent + ':');
                // The base64 includes the 'data:image/png;base64,' prefix which PptxGenJS accepts via `data`
                slide.addImage({ data: img.src, x: 1.0, y: 1.2, w: 8.0, h: 4.0, sizing: { type: 'contain' } });
            }
        }
    });

    // 10. References
    let slideRef = pres.addSlide('SIMPLE_MASTER');
    addTitle(slideRef, 'References');
    slideRef.addText([
        { text: 'ReactJS Documentation: https://reactjs.org\n' },
        { text: 'Node.js Documentation: https://nodejs.org\n' },
        { text: 'MongoDB Manual: https://docs.mongodb.com\n' },
        { text: 'Tailwind CSS Documentation: https://tailwindcss.com\n' },
        { text: 'Mermaid.js for Diagrams: https://mermaid-js.github.io/mermaid/\n' },
        { text: 'OpenAI ChatGPT: https://openai.com/chatgpt\n' }
    ], { x: 0.5, y: 1.5, w: '80%', fontSize: 18, color: '333333', bullet: true, lineSpacing: 35 });

    // 11. Thank You
    let slideEnd = pres.addSlide();
    slideEnd.addText('THANK YOU', { x: '10%', y: '40%', w: '80%', fontSize: 54, bold: true, color: primaryColor, align: 'center' });

    let pptxPath = 'Cash_Book_Project_Presentation_Simple.pptx';
    console.log('Generating PPTX...');
    await pres.writeFile({ fileName: pptxPath });
    console.log('PPTX generated successfully at', pptxPath);
}

createSimpleNativePpt().catch(console.error);
