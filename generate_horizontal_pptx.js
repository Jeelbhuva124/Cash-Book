const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createExactPptx() {
  console.log('Launching puppeteer...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.join(__dirname, 'Cash_Book_Project_Report.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  
  console.log('Loading HTML file...');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  // Wait a little extra just in case mermaid is rendering
  await new Promise(r => setTimeout(r, 2000));
  
  // Get all .page elements
  const pageHandles = await page.$$('.page');
  console.log(`Found ${pageHandles.length} pages.`);
  
  let pres = new PptxGenJS();
  // Set layout to Portrait A4
  
  pres.layout = 'LAYOUT_16x9';
  
  const tmpImages = [];

  for (let i = 0; i < pageHandles.length; i++) {
    const handle = pageHandles[i];
    const imagePath = path.join(__dirname, `page_${i}.jpg`);
    tmpImages.push(imagePath);
    
    console.log(`Taking screenshot of page ${i + 1}...`);
    // Scroll element into view to ensure it renders correctly
    await handle.evaluate(el => el.scrollIntoView());
    
    await handle.screenshot({ path: imagePath, type: 'jpeg', quality: 90 });
    
    // Add a slide
    let slide = pres.addSlide();
    
    // Add the image to fill the slide
    slide.addImage({
      path: imagePath,
      x: 3.01, y: 0, w: 3.97, h: 5.625
    });
  }
  
  await browser.close();
  
  const pptxPath = path.join(__dirname, 'Cash_Book_Project_Report_Horizontal.pptx');
  console.log('Saving PPTX...');
  await pres.writeFile({ fileName: pptxPath });
  console.log('PPTX saved successfully!');
  
  // Clean up images
  for (const img of tmpImages) {
    if (fs.existsSync(img)) {
      fs.unlinkSync(img);
    }
  }
  console.log('Done!');
}

createExactPptx().catch(console.error);
