const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateDocx() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Load the local HTML file
    const htmlPath = 'file:///' + path.join(__dirname, 'Cash_Book_Project_Report.html').replace(/\\/g, '/');
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    
    console.log('Converting SVGs to PNGs and simplifying layout for Word...');
    await page.evaluate(async () => {
        // Convert Mermaid SVGs to PNGs
        const mermaidDivs = document.querySelectorAll('.mermaid');
        for (let div of mermaidDivs) {
            const svg = div.querySelector('svg');
            if (svg) {
                // Set XML namespace
                if (!svg.getAttribute('xmlns')) {
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                }
                const svgString = new XMLSerializer().serializeToString(svg);
                const base64 = window.btoa(unescape(encodeURIComponent(svgString)));
                const svgUrl = 'data:image/svg+xml;base64,' + base64;
                
                // Draw to canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                await new Promise((resolve) => {
                    img.onload = () => {
                        canvas.width = img.width || 800;
                        canvas.height = img.height || 600;
                        // fill white background
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        resolve();
                    };
                    img.src = svgUrl;
                });
                
                const pngDataUrl = canvas.toDataURL('image/png');
                const newImg = document.createElement('img');
                newImg.src = pngDataUrl;
                newImg.style.maxWidth = '100%';
                newImg.style.height = 'auto';
                
                div.innerHTML = '';
                div.appendChild(newImg);
            }
        }
        
        // Remove manual headers and footers since Word has its own pagination
        document.querySelectorAll('.page-header, .footer-line, .page-number').forEach(el => el.remove());
        
        // Remove complex flex/absolute layouts
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.position === 'absolute') {
                el.style.position = 'static';
            }
            if (style.display === 'flex') {
                el.style.display = 'block';
                el.style.textAlign = 'center';
            }
        });
        
        // Clean up CSS for Word
        const styleSheet = document.querySelector('style');
        if (styleSheet) {
            let css = styleSheet.innerHTML;
            css = css.replace(/width:\s*210mm;/g, '');
            css = css.replace(/height:\s*297mm;/g, '');
            css = css.replace(/min-height:\s*297mm;/g, '');
            css = css.replace(/box-shadow:[^;]+;/g, '');
            css = css.replace(/position:\s*absolute;/g, 'position: static;');
            css = css.replace(/position:\s*relative;/g, 'position: static;');
            // Word needs explicit page breaks
            // css += `\n.page { page-break-after: always; clear: both; }`;
            styleSheet.innerHTML = css;
        }
    });
    
    console.log('Getting updated HTML...');
    let finalHtml = await page.content();
    
    // We will save this as an HTML file but with .doc extension, which Word understands beautifully 
    // IF the images are base64 PNGs and layout is simple.
    
    // Wait, html-docx-js is better for real docx. Let's try to use it if it exists.
    let outPath;
    try {
        const htmlDocx = require('html-docx-js');
        const docxBlob = htmlDocx.asBlob(finalHtml);
        outPath = path.join(__dirname, 'Cash_Book_Project_Report_Final.docx');
        
        // Convert Blob/String to Buffer depending on what html-docx-js returns in node
        let docxBuffer;
        if (typeof docxBlob === 'string') {
            docxBuffer = Buffer.from(docxBlob, 'binary');
        } else if (docxBlob instanceof Buffer || docxBlob instanceof Uint8Array) {
            docxBuffer = docxBlob;
        } else if (docxBlob.arrayBuffer) {
            docxBuffer = Buffer.from(await docxBlob.arrayBuffer());
        } else {
            docxBuffer = Buffer.from(docxBlob);
        }
        
        fs.writeFileSync(outPath, docxBuffer);
        console.log('Saved real DOCX to', outPath);
    } catch (e) {
        console.error('html-docx-js error:', e);
        console.log('html-docx-js not found or failed, falling back to .doc');
        outPath = path.join(__dirname, 'Cash_Book_Final.doc');
        fs.writeFileSync(outPath, finalHtml);
        console.log('Saved DOC to', outPath);
    }
    
    await browser.close();
}

generateDocx().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
