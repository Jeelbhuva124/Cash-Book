const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePerfectWord() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Load the HTML file
    const htmlPath = 'file:///' + path.join(__dirname, 'Cash_Book_Project_Report.html').replace(/\\/g, '/');
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    
    console.log('Extracting and replacing Mermaid diagrams with SVGs...');
    await page.evaluate(() => {
        // Find all mermaid divs
        const mermaidDivs = document.querySelectorAll('.mermaid');
        mermaidDivs.forEach((div) => {
            const svg = div.querySelector('svg');
            if (svg) {
                // Ensure SVG has proper XML namespace if missing
                if (!svg.getAttribute('xmlns')) {
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                }
                const svgString = new XMLSerializer().serializeToString(svg);
                const base64 = window.btoa(unescape(encodeURIComponent(svgString)));
                const img = document.createElement('img');
                img.src = 'data:image/svg+xml;base64,' + base64;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                
                // Replace div content with the image
                div.innerHTML = '';
                div.appendChild(img);
            }
        });
        
        // Fix CSS for Word formatting while preserving colors
        const styleSheet = document.querySelector('style');
        if (styleSheet) {
            let css = styleSheet.innerHTML;
            
            // Remove A4 specific sizing that breaks Word
            css = css.replace(/width:\s*210mm;/g, 'width: 100%;');
            css = css.replace(/height:\s*297mm;/g, '');
            css = css.replace(/min-height:\s*297mm;/g, '');
            css = css.replace(/box-shadow:[^;]+;/g, '');
            
            // Add page break to .page
            css = css.replace(/\.page\s*\{/g, '.page { page-break-after: always; padding: 20px 40px; border: none; ');
            
            styleSheet.innerHTML = css;
        }
        
        // Remove empty placeholders text if any are left
        document.body.innerHTML = document.body.innerHTML.replace(/\[\s*Insert Screenshot[^\]]*\]/gi, '');
    });
    
    console.log('Retrieving updated HTML...');
    const finalHtml = await page.content();
    
    const docPath = path.join(__dirname, 'Cash_Book_Project_Report_Editable.doc');
    fs.writeFileSync(docPath, finalHtml);
    console.log('Perfect Word DOC saved successfully to', docPath);
    
    await browser.close();
}

generatePerfectWord().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
