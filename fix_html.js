const fs = require('fs');
let html = fs.readFileSync('Cash_Book_Project_Report.html', 'utf8');

// The mojibake is ?- or ?-
html = html.replace(/\xEF\xBF\xBD\?-/g, '&#10070; ');
html = html.replace(/\uFFFD\?-/g, '&#10070; ');
html = html.replace(/\?-/g, '&#10070; ');

// The problem with images is that they have display: block and margin: 0 auto directly on the img tag.
// In Word, this sometimes causes images to float or overlap. 
// Wrapping them in a div with text-align: center is safer.
html = html.replace(/<img src="data:image([^>]+)style="([^"]*)" \/>/g, (match, p1, p2) => {
    let newStyle = p2.replace(/display:\s*block;?/, '').replace(/margin:\s*0\s+auto[^;]*;?/, '');
    return `<p style="text-align: center; margin-bottom: 20px; clear: both;"><img src="data:image${p1}style="${newStyle}" /></p>`;
});

// Write it back
fs.writeFileSync('Cash_Book_Project_Report.html', html, 'utf8');
console.log('Fixed HTML');
