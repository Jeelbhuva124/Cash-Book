const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function buildHorizontalPpt() {
    console.log('Extracting assets from Cash_Book_Project_Report_Final.docx...');
    const docxZip = await JSZip.loadAsync(fs.readFileSync('Cash_Book_Project_Report_Final.docx'));
    
    // Helper to get image base64 data url from docx
    const getImageData = async (imageName) => {
        const file = docxZip.file('word/media/' + imageName);
        if (!file) return null;
        const buf = await file.async('nodebuffer');
        return 'data:image/png;base64,' + buf.toString('base64');
    };

    // Load College Logo if available
    let logoData = null;
    if (fs.existsSync('college_logo.png')) {
        const buf = fs.readFileSync('college_logo.png');
        logoData = 'data:image/png;base64,' + buf.toString('base64');
    }

    console.log('Initializing Presentation (16:9 Widescreen)...');
    let pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9'; // 10.0 in x 5.625 in

    // Colors
    const NAVY = '0F172A';
    const PRIMARY_BLUE = '1D4ED8';
    const ACCENT_SKY = '0284C7';
    const ACCENT_GREEN = '10B981';
    const TEXT_MAIN = '1E293B';
    const TEXT_MUTED = '64748B';
    const BG_LIGHT = 'F8FAFC';
    const CARD_BG = 'FFFFFF';
    const CARD_BORDER = 'E2E8F0';

    // Master Layout Template
    pres.defineSlideMaster({
        title: 'MAIN_LAYOUT',
        background: { color: 'F8FAFC' },
        objects: [
            // Header top accent line
            { rect: { x: 0, y: 0, w: 10.0, h: 0.08, fill: { color: PRIMARY_BLUE } } },
            // Top breadcrumb / app label
            { text: { text: 'CASH-BOOK  •  SMART FINANCE & DIGITAL LEDGER', options: { x: 0.8, y: 0.2, w: 8.0, h: 0.3, fontSize: 10, bold: true, color: ACCENT_SKY, fontFace: 'Calibri' } } },
            // Header divider line
            { line: { x: 0.8, y: 0.95, w: 8.4, h: 0, line: { color: CARD_BORDER, width: 1 } } },
            // Footer divider line
            { line: { x: 0.8, y: 5.2, w: 8.4, h: 0, line: { color: CARD_BORDER, width: 1 } } },
            // Footer Left: College & Course
            { text: { text: 'Sutex Bank College of Computer Applications & Science, Amroli  |  B.C.A. Sem-5', options: { x: 0.8, y: 5.25, w: 6.5, h: 0.3, fontSize: 9, color: TEXT_MUTED, fontFace: 'Calibri' } } },
            // Footer Right: Project Name
            { text: { text: 'Cash-Book Presentation', options: { x: 7.5, y: 5.25, w: 1.7, h: 0.3, fontSize: 9, bold: true, align: 'right', color: TEXT_MUTED, fontFace: 'Calibri' } } }
        ]
    });

    // Helper: Add Standard Slide Title
    const addHeader = (slide, title, category = '') => {
        slide.addText(title, {
            x: 0.8,
            y: 0.45,
            w: 8.4,
            h: 0.45,
            fontSize: 22,
            bold: true,
            color: NAVY,
            fontFace: 'Segoe UI'
        });
    };

    // Helper: Add Section Divider Slide
    const addSectionSlide = (number, title, subtitle) => {
        let slide = pres.addSlide();
        slide.background = { color: NAVY };

        slide.addShape(pres.ShapeType.rect, {
            x: 1.0, y: 1.8, w: 1.2, h: 0.35,
            fill: { color: ACCENT_SKY },
            rectRadius: 0.05
        });
        slide.addText(`SECTION ${number}`, {
            x: 1.0, y: 1.8, w: 1.2, h: 0.35,
            fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Segoe UI'
        });

        slide.addText(title, {
            x: 1.0, y: 2.3, w: 8.0, h: 0.8,
            fontSize: 34, bold: true, color: 'FFFFFF', fontFace: 'Segoe UI'
        });

        slide.addText(subtitle, {
            x: 1.0, y: 3.2, w: 8.0, h: 0.6,
            fontSize: 16, color: '94A3B8', fontFace: 'Calibri'
        });

        slide.addShape(pres.ShapeType.line, {
            x: 1.0, y: 4.2, w: 8.0, h: 0,
            line: { color: '334155', width: 1.5 }
        });

        slide.addText('Cash-Book: Smart Finance & Digital Ledger', {
            x: 1.0, y: 4.4, w: 8.0, h: 0.4,
            fontSize: 12, color: '64748B', fontFace: 'Calibri'
        });
    };

    // Helper: Add Feature Slide with Screenshot + Explanatory Bullet Card
    const addFeatureSlide = async (title, imageName, bullets, badgeText = 'Feature Overview') => {
        let slide = pres.addSlide('MAIN_LAYOUT');
        addHeader(slide, title);

        const imgData = await getImageData(imageName);

        // Left Container: High-Res Screenshot Card
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.15, w: 5.35, h: 3.85,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        if (imgData) {
            slide.addImage({
                data: imgData,
                x: 0.9, y: 1.25, w: 5.15, h: 3.65,
                sizing: { type: 'contain' }
            });
        } else {
            slide.addText('[Screenshot Display]', {
                x: 0.9, y: 2.8, w: 5.15, h: 0.5,
                fontSize: 14, color: TEXT_MUTED, align: 'center'
            });
        }

        // Right Container: Detailed Editable Bullet Card
        slide.addShape(pres.ShapeType.rect, {
            x: 6.35, y: 1.15, w: 2.85, h: 3.85,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        // Badge - Centered in Right Card (Card starts at 6.35, width 2.85)
        slide.addShape(pres.ShapeType.rect, {
            x: 6.58, y: 1.35, w: 2.4, h: 0.32,
            fill: { color: 'EFF6FF' },
            line: { color: 'BFDBFE', width: 1 },
            rectRadius: 0.04
        });
        slide.addText(badgeText.toUpperCase(), {
            x: 6.58, y: 1.35, w: 2.4, h: 0.32,
            fontSize: 9.5, bold: true, color: PRIMARY_BLUE, align: 'center', fontFace: 'Segoe UI'
        });

        // Bullets: Clean single bullet per point with spaceAfter (NO extra empty bullets)
        const textItems = bullets.map(b => ({
            text: b.trim(),
            options: {
                bullet: true,
                fontSize: 11,
                color: TEXT_MAIN,
                fontFace: 'Segoe UI',
                spaceAfter: 12,
                breakLine: true
            }
        }));

        slide.addText(textItems, {
            x: 6.55, y: 1.85, w: 2.45, h: 3.0,
            valign: 'top'
        });
    };

    // Helper: Add Diagram Slide (Horizontal 16:9 full view with summary card)
    const addDiagramSlide = async (title, imageName, descriptionPoints, diagramType) => {
        let slide = pres.addSlide('MAIN_LAYOUT');
        addHeader(slide, title);

        const imgData = await getImageData(imageName);

        // Diagram Box (Big Horizontal Showcase)
        slide.addShape(pres.ShapeType.rect, {
            x: 0.8, y: 1.15, w: 5.65, h: 3.85,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        if (imgData) {
            slide.addImage({
                data: imgData,
                x: 0.9, y: 1.25, w: 5.45, h: 3.65,
                sizing: { type: 'contain' }
            });
        }

        // Details Side Card
        slide.addShape(pres.ShapeType.rect, {
            x: 6.65, y: 1.15, w: 2.55, h: 3.85,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        slide.addShape(pres.ShapeType.rect, {
            x: 6.85, y: 1.35, w: 2.15, h: 0.3,
            fill: { color: 'ECFDF5' },
            line: { color: 'A7F3D0', width: 1 },
            rectRadius: 0.04
        });
        slide.addText(diagramType.toUpperCase(), {
            x: 6.85, y: 1.35, w: 2.15, h: 0.3,
            fontSize: 9.5, bold: true, color: '059669', align: 'center', fontFace: 'Segoe UI'
        });

        const items = descriptionPoints.map(p => ({
            text: p.trim(),
            options: {
                bullet: true,
                fontSize: 10.5,
                color: TEXT_MAIN,
                fontFace: 'Segoe UI',
                spaceAfter: 8,
                breakLine: true
            }
        }));

        slide.addText(items, {
            x: 6.85, y: 1.8, w: 2.15, h: 3.0,
            valign: 'top'
        });
    };

    // ==========================================
    // SLIDE 1: Title & College Header Slide
    // ==========================================
    console.log('Generating Slide 1: Cover Slide...');
    let slide1 = pres.addSlide();
    slide1.background = { color: 'FFFFFF' };

    // Header Background Band
    slide1.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: 10.0, h: 1.4,
        fill: { color: 'F1F5F9' },
        line: { color: 'CBD5E1', width: 1 }
    });

    if (logoData) {
        slide1.addImage({
            data: logoData,
            x: 0.6, y: 0.15, w: 1.1, h: 1.1,
            sizing: { type: 'contain' }
        });
    }

    slide1.addText('Prof. V. B. Shah Institute of Management & R. V. Patel College of Commerce (Eng. Med.)', {
        x: 1.8, y: 0.2, w: 7.6, h: 0.3,
        fontSize: 13, bold: true, color: NAVY, fontFace: 'Segoe UI'
    });
    slide1.addText('Sutex Bank College of Computer Applications & Science, Amroli, Surat', {
        x: 1.8, y: 0.5, w: 7.6, h: 0.25,
        fontSize: 11, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI'
    });
    slide1.addText('Affiliated to Veer Narmad South Gujarat University (VNSGU)  •  B.C.A. (5th Semester) Minor Project', {
        x: 1.8, y: 0.8, w: 7.6, h: 0.25,
        fontSize: 10, color: TEXT_MUTED, fontFace: 'Calibri'
    });

    // Main Title Box
    slide1.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 1.6, w: 8.4, h: 1.7,
        fill: { color: 'F8FAFC' },
        line: { color: 'E2E8F0', width: 1 },
        rectRadius: 0.08
    });
    slide1.addText('PROJECT PRESENTATION ON', {
        x: 1.0, y: 1.75, w: 8.0, h: 0.3,
        fontSize: 11, bold: true, color: ACCENT_SKY, align: 'center', fontFace: 'Segoe UI'
    });
    slide1.addText('Cash-Book: Smart Finance & Digital Ledger', {
        x: 1.0, y: 2.1, w: 8.0, h: 0.6,
        fontSize: 28, bold: true, color: NAVY, align: 'center', fontFace: 'Segoe UI'
    });
    slide1.addText('A Comprehensive Web Application for Personal & Small Business Cashflows, Ledgers & Expense Analytics', {
        x: 1.0, y: 2.75, w: 8.0, h: 0.35,
        fontSize: 12, color: TEXT_MUTED, align: 'center', fontFace: 'Calibri'
    });

    // Student & Guide Information Cards
    // Left Card: Submitted By
    slide1.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 3.5, w: 4.8, h: 1.7,
        fill: { color: 'FFFFFF' },
        line: { color: CARD_BORDER, width: 1 },
        rectRadius: 0.08
    });
    slide1.addText('SUBMITTED BY:', {
        x: 1.1, y: 3.65, w: 4.2, h: 0.25,
        fontSize: 11, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI'
    });
    slide1.addText([
        { text: '•  Bhuva Jeel M.  (Roll No: 520)\n' },
        { text: '•  Savsaviya Kushal B.  (Roll No: 526)\n' },
        { text: '•  Narola Jash M.  (Roll No: 558)' }
    ], {
        x: 1.1, y: 3.95, w: 4.2, h: 1.1,
        fontSize: 12, bold: true, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 22
    });

    // Right Card: Guided By
    slide1.addShape(pres.ShapeType.rect, {
        x: 5.8, y: 3.5, w: 3.4, h: 1.7,
        fill: { color: 'FFFFFF' },
        line: { color: CARD_BORDER, width: 1 },
        rectRadius: 0.08
    });
    slide1.addText('GUIDED BY:', {
        x: 6.1, y: 3.65, w: 2.8, h: 0.25,
        fontSize: 11, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI'
    });
    slide1.addText([
        { text: 'Mrs. Damyanti Patel\n\n', options: { fontSize: 14, bold: true, color: NAVY } },
        { text: 'Assistant Professor, BCA Dept.\n', options: { fontSize: 11, color: TEXT_MUTED } },
        { text: 'Academic Year: 2024–2025', options: { fontSize: 11, color: TEXT_MUTED } }
    ], {
        x: 6.1, y: 4.0, w: 2.8, h: 1.0,
        fontFace: 'Segoe UI'
    });

    // ==========================================
    // SLIDE 2: Project Profile Table (100% Native Table)
    // ==========================================
    console.log('Generating Slide 2: Project Profile Table...');
    let slide2 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide2, 'Project Profile & Specifications');

    const profileTableRows = [
        [
            { text: 'Attribute', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true, fontSize: 12, fontFace: 'Segoe UI' } },
            { text: 'Specification Details', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true, fontSize: 12, fontFace: 'Segoe UI' } }
        ],
        [
            { text: 'Project Title', options: { bold: true, fill: 'F1F5F9', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'Cash-Book: Smart Finance & Digital Ledger', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Application Domain', options: { bold: true, fill: 'FFFFFF', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'Personal Finance, Digital Bookkeeping, Small Business Accounts Management', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Front-End Technologies', options: { bold: true, fill: 'F1F5F9', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'React 18 (Vite Bundler), Tailwind CSS, Framer Motion, Lucide React Icons', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Back-End Technologies', options: { bold: true, fill: 'FFFFFF', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'Node.js, Express.js (RESTful API Server)', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Database Management', options: { bold: true, fill: 'F1F5F9', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'MongoDB (NoSQL Document Store) with Mongoose ODM', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Security & Auth', options: { bold: true, fill: 'FFFFFF', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'JSON Web Tokens (JWT), Bcrypt Password Hashing, Role-Based Access Control', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Development Tools & IDE', options: { bold: true, fill: 'F1F5F9', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'Visual Studio Code, Git, GitHub, Postman API Client, MongoDB Compass', options: { fontFace: 'Calibri', fontSize: 11 } }
        ],
        [
            { text: 'Target Platforms', options: { bold: true, fill: 'FFFFFF', fontFace: 'Calibri', fontSize: 11 } },
            { text: 'Cross-Platform Modern Web Browsers (Chrome, Edge, Firefox, Safari)', options: { fontFace: 'Calibri', fontSize: 11 } }
        ]
    ];

    slide2.addTable(profileTableRows, {
        x: 0.8, y: 1.2, w: 8.4,
        colW: [2.5, 5.9],
        border: { pt: 1, color: CARD_BORDER },
        margin: [4, 8, 4, 8]
    });

    // ==========================================
    // SLIDE 3: Overview / Agenda
    // ==========================================
    console.log('Generating Slide 3: Agenda...');
    let slide3 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide3, 'Presentation Overview (Table of Contents)');

    const agendaBoxes = [
        { num: '01', title: 'Introduction & Objectives', desc: 'Background, problem statement & system scope' },
        { num: '02', title: 'Technology Architecture', desc: 'MERN stack, design patterns & development tools' },
        { num: '03', title: 'System Modeling & Diagrams', desc: 'System Flow, Context DFD & ER Diagrams' },
        { num: '04', title: 'Database Schema Design', desc: 'MongoDB collections, constraints & relations' },
        { num: '05', title: 'Admin Governance Modules', desc: 'Dashboard, user controls & platform analytics' },
        { num: '06', title: 'User Digital Ledger Modules', desc: 'Cashbooks, Party Ledger, EMI tracker & vault' },
        { num: '07', title: 'Security & Best Practices', desc: 'JWT sessions, hashing & data validation' },
        { num: '08', title: 'Future Enhancements & Conclusion', desc: 'AI OCR scanning, roadmap & project references' }
    ];

    for (let i = 0; i < agendaBoxes.length; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = 0.8 + col * 2.15;
        const y = 1.35 + row * 1.8;

        slide3.addShape(pres.ShapeType.rect, {
            x: x, y: y, w: 2.0, h: 1.6,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        slide3.addText(agendaBoxes[i].num, {
            x: x + 0.15, y: y + 0.15, w: 1.7, h: 0.35,
            fontSize: 20, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI'
        });

        slide3.addText(agendaBoxes[i].title, {
            x: x + 0.15, y: y + 0.55, w: 1.7, h: 0.45,
            fontSize: 12, bold: true, color: NAVY, fontFace: 'Segoe UI'
        });

        slide3.addText(agendaBoxes[i].desc, {
            x: x + 0.15, y: y + 1.05, w: 1.7, h: 0.45,
            fontSize: 10, color: TEXT_MUTED, fontFace: 'Calibri'
        });
    }

    // ==========================================
    // SLIDE 4: Problem Statement & Motivation
    // ==========================================
    console.log('Generating Slide 4: Problem Statement...');
    let slide4 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide4, 'Introduction & Problem Statement');

    // Traditional Paper Ledger vs Cash-Book Digital
    // Left: The Challenge
    slide4.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 1.25, w: 4.05, h: 3.7,
        fill: { color: CARD_BG },
        line: { color: 'FCA5A5', width: 1 },
        rectRadius: 0.08
    });
    slide4.addText('Traditional Paper Ledgers (Challenges)', {
        x: 1.0, y: 1.45, w: 3.65, h: 0.35,
        fontSize: 14, bold: true, color: 'DC2626', fontFace: 'Segoe UI'
    });
    slide4.addText([
        { text: '• High Risk of Data Loss: ', options: { bold: true } }, { text: 'Physical books get damaged by water, fire, or accidental misplacement.\n\n' },
        { text: '• Calculation Errors: ', options: { bold: true } }, { text: 'Manual arithmetic calculations lead to discrepancies and accounting mistakes.\n\n' },
        { text: '• Lack of Portability: ', options: { bold: true } }, { text: 'Physical books cannot be accessed remotely or shared across multiple partners.\n\n' },
        { text: '• No Real-Time Insights: ', options: { bold: true } }, { text: 'Impossible to see automated monthly spending charts, trends, or debt forecasts.' }
    ], {
        x: 1.0, y: 1.9, w: 3.65, h: 2.8,
        fontSize: 11.5, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 18
    });

    // Right: The Solution
    slide4.addShape(pres.ShapeType.rect, {
        x: 5.15, y: 1.25, w: 4.05, h: 3.7,
        fill: { color: CARD_BG },
        line: { color: '86EFAC', width: 1 },
        rectRadius: 0.08
    });
    slide4.addText('The Cash-Book Digital Solution', {
        x: 5.35, y: 1.45, w: 3.65, h: 0.35,
        fontSize: 14, bold: true, color: '059669', fontFace: 'Segoe UI'
    });
    slide4.addText([
        { text: '• 100% Cloud Persistence: ', options: { bold: true } }, { text: 'Secure MongoDB database ensures transactions are never lost or corrupted.\n\n' },
        { text: '• Automated Calculations: ', options: { bold: true } }, { text: 'Real-time running balances, income/expense aggregation, and debt summaries.\n\n' },
        { text: '• Multi-Cashbook Sharing: ', options: { bold: true } }, { text: 'Invite business partners or family members via email invitations to collaborate.\n\n' },
        { text: '• Built-in Receipts Vault: ', options: { bold: true } }, { text: 'Upload digital bill images and attach them directly to monetary transaction logs.' }
    ], {
        x: 5.35, y: 1.9, w: 3.65, h: 2.8,
        fontSize: 11.5, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 18
    });

    // ==========================================
    // SLIDE 5: Project Objectives
    // ==========================================
    console.log('Generating Slide 5: Objectives...');
    let slide5 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide5, 'Project Objectives & Key Goals');

    const objectives = [
        { icon: '01', title: 'Simplify Financial Tracking', desc: 'Enable users to log daily income and expenses in seconds with categorized tags and payment modes.' },
        { icon: '02', title: 'Credit Tracking (Party Ledger)', desc: 'Track credit, borrowing, and lending with automated Net Balance calculators and WhatsApp credit reminder triggers.' },
        { icon: '03', title: 'Manage Fixed Financial Commitments', desc: 'Centralized tracking of EMIs and recurring subscriptions with due-date calendar views to prevent late fees.' },
        { icon: '04', title: 'Digital Proof Storage (Vault)', desc: 'Eliminate physical paper receipts by offering a digital image vault linked to individual transaction records.' },
        { icon: '05', title: 'Analytical Decision Making', desc: 'Equip users and admins with graphical category charts, cash flow breakdowns, and PDF/Excel export reports.' },
        { icon: '06', title: 'Platform Security & Privacy', desc: 'Deliver military-grade hashed authentication, active session oversight, and multi-user invitation controls.' }
    ];

    for (let i = 0; i < objectives.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 0.8 + col * 2.9;
        const y = 1.35 + row * 1.85;

        slide5.addShape(pres.ShapeType.rect, {
            x: x, y: y, w: 2.65, h: 1.65,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        slide5.addShape(pres.ShapeType.rect, {
            x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.3,
            fill: { color: 'EFF6FF' },
            rectRadius: 0.04
        });
        slide5.addText(objectives[i].icon, {
            x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.3,
            fontSize: 11, bold: true, color: PRIMARY_BLUE, align: 'center', fontFace: 'Segoe UI'
        });

        slide5.addText(objectives[i].title, {
            x: x + 0.7, y: y + 0.15, w: 1.8, h: 0.35,
            fontSize: 12, bold: true, color: NAVY, fontFace: 'Segoe UI'
        });

        slide5.addText(objectives[i].desc, {
            x: x + 0.15, y: y + 0.55, w: 2.35, h: 0.95,
            fontSize: 10.5, color: TEXT_MUTED, fontFace: 'Calibri', lineSpacing: 16
        });
    }

    // ==========================================
    // SLIDE 6: Technology Stack Breakdown
    // ==========================================
    console.log('Generating Slide 6: Technology Stack...');
    let slide6 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide6, 'Comprehensive Technology Stack');

    const techCategories = [
        {
            title: 'Frontend Tier',
            accent: PRIMARY_BLUE,
            bg: 'EFF6FF',
            items: [
                'React.js (v18) Single Page Application',
                'Vite Ultra-Fast Build Engine',
                'Tailwind CSS Utility Styling',
                'Framer Motion Micro-Animations',
                'Lucide React Vector Icons Suite'
            ]
        },
        {
            title: 'Backend Tier',
            accent: '059669',
            bg: 'ECFDF5',
            items: [
                'Node.js Asynchronous Runtime',
                'Express.js REST API Server',
                'Modular Controller-Route Pattern',
                'JSON Request / Response Format',
                'CORS & Security Middleware'
            ]
        },
        {
            title: 'Database Tier',
            accent: 'D97706',
            bg: 'FFFBEB',
            items: [
                'MongoDB Cloud Document Database',
                'Mongoose Schema & ODM Modeling',
                'Embedded Documents & Arrays',
                'Indexing for High Query Velocity',
                'Aggregation Pipelines for Balance'
            ]
        },
        {
            title: 'DevOps & Tooling',
            accent: '7C3AED',
            bg: 'F5F3FF',
            items: [
                'Visual Studio Code Editor',
                'Git Version Control & GitHub',
                'Postman API Testing Suite',
                'MongoDB Compass Database GUI',
                'PptxGenJS / Puppeteer Reporting'
            ]
        }
    ];

    for (let i = 0; i < 4; i++) {
        const x = 0.8 + i * 2.15;
        const cat = techCategories[i];

        slide6.addShape(pres.ShapeType.rect, {
            x: x, y: 1.3, w: 2.0, h: 3.65,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        slide6.addShape(pres.ShapeType.rect, {
            x: x, y: 1.3, w: 2.0, h: 0.55,
            fill: { color: cat.bg },
            rectRadius: 0.08
        });

        slide6.addText(cat.title, {
            x: x + 0.1, y: 1.4, w: 1.8, h: 0.35,
            fontSize: 13, bold: true, color: cat.accent, align: 'center', fontFace: 'Segoe UI'
        });

        const bullets = cat.items.map(it => ({
            text: '•  ' + it + '\n\n',
            options: { fontSize: 10.5, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 16 }
        }));

        slide6.addText(bullets, {
            x: x + 0.15, y: 2.0, w: 1.7, h: 2.8,
            valign: 'top'
        });
    }

    // ==========================================
    // SLIDE 7: System Architecture / High-Level Flow
    // ==========================================
    console.log('Generating Slide 7: System Architecture Overview...');
    let slide7 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide7, 'Platform Architecture: Admin vs User Roles');

    // Admin Architecture Card
    slide7.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 1.3, w: 4.05, h: 3.65,
        fill: { color: CARD_BG },
        line: { color: CARD_BORDER, width: 1 },
        rectRadius: 0.08
    });
    slide7.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 1.3, w: 4.05, h: 0.5,
        fill: { color: 'F1F5F9' },
        rectRadius: 0.08
    });
    slide7.addText('ADMINISTRATOR MODULE', {
        x: 1.0, y: 1.4, w: 3.65, h: 0.3,
        fontSize: 13, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI'
    });
    slide7.addText([
        { text: '• System Analytics: ', options: { bold: true } }, { text: 'Real-time overview of active users, total cashbooks, platform transaction volume.\n\n' },
        { text: '• User Account Management: ', options: { bold: true } }, { text: 'List, inspect, activate, deactivate, or delete user accounts across the system.\n\n' },
        { text: '• Transaction Oversight: ', options: { bold: true } }, { text: 'Audit platform transactions, monitor flags, and ensure database compliance.\n\n' },
        { text: '• Cashbook Governance: ', options: { bold: true } }, { text: 'Oversee shared cashbooks and invitation links for anti-abuse regulation.' }
    ], {
        x: 1.0, y: 2.0, w: 3.65, h: 2.8,
        fontSize: 11.5, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 18
    });

    // User Architecture Card
    slide7.addShape(pres.ShapeType.rect, {
        x: 5.15, y: 1.3, w: 4.05, h: 3.65,
        fill: { color: CARD_BG },
        line: { color: CARD_BORDER, width: 1 },
        rectRadius: 0.08
    });
    slide7.addShape(pres.ShapeType.rect, {
        x: 5.15, y: 1.3, w: 4.05, h: 0.5,
        fill: { color: 'F1F5F9' },
        rectRadius: 0.08
    });
    slide7.addText('END-USER (CLIENT) MODULE', {
        x: 5.35, y: 1.4, w: 3.65, h: 0.3,
        fontSize: 13, bold: true, color: '059669', fontFace: 'Segoe UI'
    });
    slide7.addText([
        { text: '• Multi-Cashbook Ledgers: ', options: { bold: true } }, { text: 'Create distinct personal, household, and business financial books.\n\n' },
        { text: '• Party Ledger (Credit Book): ', options: { bold: true } }, { text: 'Record credit and debit amounts against specific party names with reminder dispatch.\n\n' },
        { text: '• Receipts Vault: ', options: { bold: true } }, { text: 'Upload and organize bill photos, PDF receipts, and transaction proofs.\n\n' },
        { text: '• Reports & History: ', options: { bold: true } }, { text: 'Filter records by date range, payment mode, or category with instant CSV/PDF export.' }
    ], {
        x: 5.35, y: 2.0, w: 3.65, h: 2.8,
        fontSize: 11.5, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 18
    });

    // ==========================================
    // SLIDE 8: System Flow Diagram (Process Flow)
    // ==========================================
    console.log('Generating Slide 8: System Flow Diagram...');
    await addDiagramSlide(
        '5. System Flow Diagram (Process Flow)',
        'image1.png',
        [
            'Start: User accesses the Cash-Book portal.',
            'Auth Check: Checks existing account session; redirects to Sign Up or Login.',
            'Authorization: Validates hashed credentials via JWT token.',
            'Main Menu: Unlocks Dashboard, Transactions, Party Ledger, Receipts, Settings.',
            'Action Execution: Real-time CRUD operations update MongoDB state.',
            'End: Session termination or logout.'
        ],
        'Process Flow'
    );

    // ==========================================
    // SLIDE 9: Context Diagram (0 Level DFD)
    // ==========================================
    console.log('Generating Slide 9: Context DFD Diagram...');
    await addDiagramSlide(
        '6. Data Flow Diagram (Context Level 0 DFD)',
        'image2.png',
        [
            'External Entity (User): Registers, manages transactions, logs debts, views reports.',
            'External Entity (Admin): Monitors platform metrics, inspects accounts, oversees system health.',
            'Core Process (Cash-Book System): Central routing engine processing authenticated payloads.',
            'Bi-directional Flows: Alerts, reminders, and generated financial reports flow back to user.'
        ],
        'Context DFD'
    );

    // ==========================================
    // SLIDE 10: ER Diagram
    // ==========================================
    console.log('Generating Slide 10: ER Diagram...');
    await addDiagramSlide(
        '7. Entity-Relationship (ER) Diagram',
        'image3.png',
        [
            'User Entity: PK email, credentials, admin role flag. Sends invitations, owns cashbooks.',
            'Cashbook Entity: Multi-cashbook support containing transactions.',
            'Transaction Entity: Linked to Cashbook; attributes: amount, type, party, date, time.',
            'Category & Receipt: Categorization mapping & cloud image URL attachment.'
        ],
        'ER Diagram'
    );

    // ==========================================
    // SLIDE 11: Section Divider – Database Schema Design
    // ==========================================
    console.log('Generating Slide 11: Section Divider Database...');
    addSectionSlide('02', 'DATABASE DESIGN & SCHEMAS', 'Data dictionary, field data types, constraints & Mongoose schemas');

    // ==========================================
    // SLIDE 12: DB Table - User Collection
    // ==========================================
    console.log('Generating Slide 12: User Schema Table...');
    let slide12 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide12, 'Database Schema: User Collection');

    const userTableRows = [
        [
            { text: 'Field Name', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Data Type', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Constraints', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Description', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } }
        ],
        [ { text: 'username', options: { bold: true } }, { text: 'String' }, { text: 'Required, Trim' }, { text: 'User display / business name' } ],
        [ { text: 'email_id', options: { bold: true } }, { text: 'String' }, { text: 'Required, Unique, Lowercase' }, { text: 'Primary account identifier & login email' } ],
        [ { text: 'password', options: { bold: true } }, { text: 'String' }, { text: 'Required, Min: 6 chars' }, { text: 'Bcrypt-hashed encrypted password string' } ],
        [ { text: 'phone_number', options: { bold: true } }, { text: 'String' }, { text: 'Optional' }, { text: 'Phone number for SMS/WhatsApp debt reminders' } ],
        [ { text: 'is_admin', options: { bold: true } }, { text: 'Boolean' }, { text: 'Default: false' }, { text: 'Flag distinguishing Admin vs Standard User' } ],
        [ { text: 'status', options: { bold: true } }, { text: 'String' }, { text: 'Enum: [active, suspended]' }, { text: 'Account moderation state' } ],
        [ { text: 'created_at', options: { bold: true } }, { text: 'Date' }, { text: 'Default: Date.now' }, { text: 'Timestamp when account was registered' } ]
    ];

    slide12.addTable(userTableRows, {
        x: 0.8, y: 1.25, w: 8.4,
        colW: [2.0, 1.5, 2.2, 2.7],
        border: { pt: 1, color: CARD_BORDER },
        margin: [5, 8, 5, 8],
        fontSize: 11,
        fontFace: 'Calibri'
    });

    // ==========================================
    // SLIDE 13: DB Table - Transaction Collection
    // ==========================================
    console.log('Generating Slide 13: Transaction Schema Table...');
    let slide13 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide13, 'Database Schema: Transaction Collection');

    const txTableRows = [
        [
            { text: 'Field Name', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Data Type', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Constraints', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Description', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } }
        ],
        [ { text: 'cashbook_id', options: { bold: true } }, { text: 'ObjectId' }, { text: 'Ref: Cashbook, Required' }, { text: 'Parent cashbook partition' } ],
        [ { text: 'title', options: { bold: true } }, { text: 'String' }, { text: 'Required, Trim' }, { text: 'Brief transaction description / item' } ],
        [ { text: 'amount', options: { bold: true } }, { text: 'Number' }, { text: 'Required, Min: 0' }, { text: 'Monetary numeric value of transaction' } ],
        [ { text: 'type', options: { bold: true } }, { text: 'String' }, { text: 'Enum: [income, expense]' }, { text: 'Flow indicator affecting net balance' } ],
        [ { text: 'party_type', options: { bold: true } }, { text: 'String' }, { text: 'Enum: [creditor, debtor]' }, { text: 'Credit / Debit tracking classification' } ],
        [ { text: 'party_name', options: { bold: true } }, { text: 'String' }, { text: 'Optional, Trim' }, { text: 'Name of the party/person owed to/from' } ],
        [ { text: 'payment_mode', options: { bold: true } }, { text: 'String' }, { text: 'Enum: [Cash, Bank, UPI]' }, { text: 'Payment method utilized' } ],
        [ { text: 'date / time', options: { bold: true } }, { text: 'String / Date' }, { text: 'Default: Current' }, { text: 'Audit timestamp of the record' } ]
    ];

    slide13.addTable(txTableRows, {
        x: 0.8, y: 1.25, w: 8.4,
        colW: [2.0, 1.5, 2.2, 2.7],
        border: { pt: 1, color: CARD_BORDER },
        margin: [4, 8, 4, 8],
        fontSize: 10.5,
        fontFace: 'Calibri'
    });

    // ==========================================
    // SLIDE 14: DB Table - Cashbook & Invitation Collections
    // ==========================================
    console.log('Generating Slide 14: Cashbook & Invitation Schema...');
    let slide14 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide14, 'Database Schemas: Cashbook & Invitation');

    slide14.addText('Collection: Cashbook', { x: 0.8, y: 1.15, w: 8.4, h: 0.3, fontSize: 13, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI' });
    const cbTableRows = [
        [
            { text: 'Field Name', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Data Type', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Constraints', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } },
            { text: 'Description', options: { fill: PRIMARY_BLUE, color: 'FFFFFF', bold: true } }
        ],
        [ { text: 'cashbook_name', options: { bold: true } }, { text: 'String' }, { text: 'Required' }, { text: 'Display title of the ledger' } ],
        [ { text: 'owner_email', options: { bold: true } }, { text: 'String' }, { text: 'Required' }, { text: 'Creator user identifier' } ],
        [ { text: 'members', options: { bold: true } }, { text: 'Array of String' }, { text: 'Default: []' }, { text: 'List of accepted member emails' } ]
    ];
    slide14.addTable(cbTableRows, {
        x: 0.8, y: 1.45, w: 8.4, colW: [2.0, 1.5, 2.2, 2.7],
        border: { pt: 1, color: CARD_BORDER }, margin: [3, 8, 3, 8], fontSize: 10, fontFace: 'Calibri'
    });

    slide14.addText('Collection: Invitation', { x: 0.8, y: 3.15, w: 8.4, h: 0.3, fontSize: 13, bold: true, color: '059669', fontFace: 'Segoe UI' });
    const invTableRows = [
        [
            { text: 'Field Name', options: { fill: '059669', color: 'FFFFFF', bold: true } },
            { text: 'Data Type', options: { fill: '059669', color: 'FFFFFF', bold: true } },
            { text: 'Constraints', options: { fill: '059669', color: 'FFFFFF', bold: true } },
            { text: 'Description', options: { fill: '059669', color: 'FFFFFF', bold: true } }
        ],
        [ { text: 'inviter_email', options: { bold: true } }, { text: 'String' }, { text: 'Required' }, { text: 'Email of user sending the invite' } ],
        [ { text: 'invitee_email', options: { bold: true } }, { text: 'String' }, { text: 'Required' }, { text: 'Target collaborator email' } ],
        [ { text: 'status', options: { bold: true } }, { text: 'String' }, { text: 'Enum: [pending, accepted, rejected]' }, { text: 'Invitation status workflow' } ]
    ];
    slide14.addTable(invTableRows, {
        x: 0.8, y: 3.45, w: 8.4, colW: [2.0, 1.5, 2.2, 2.7],
        border: { pt: 1, color: CARD_BORDER }, margin: [3, 8, 3, 8], fontSize: 10, fontFace: 'Calibri'
    });

    // ==========================================
    // SLIDE 15: Section Divider – Admin Modules
    // ==========================================
    console.log('Generating Slide 15: Section Divider Admin...');
    addSectionSlide('03', 'ADMINISTRATOR MODULES', 'Complete walk-through of admin security, analytics & platform moderation');

    // Admin Feature Slides
    await addFeatureSlide(
        'Admin Portal: Secure Authentication',
        'image4.png',
        [
            'Dedicated administrator login route (/admin/login).',
            'Enforces role-based checks (is_admin === true).',
            'Protection against unauthorized privilege escalation.',
            'Session storage caching for rapid administrative workflow.'
        ],
        'Admin Login'
    );

    await addFeatureSlide(
        'Admin Overview: Real-Time Analytics',
        'image6.png',
        [
            'Dynamic summary widgets: Total platform users, active ledgers, total cash volume.',
            'Interactive visual charts breaking down growth velocity.',
            'Quick action links to review user reports and system alerts.',
            'Health status monitoring for database and server load.'
        ],
        'Overview'
    );

    await addFeatureSlide(
        'Admin User Management: Account Moderation',
        'image7.png',
        [
            'Tabular view of all registered users across the platform.',
            'Search and filter accounts by email, username, or role.',
            'One-click suspend, reactivate, or delete user controls.',
            'Inspection of user created cashbooks and activity timestamps.'
        ],
        'User Management'
    );

    await addFeatureSlide(
        'Cashbook Registry & Global Oversight',
        'image8.png',
        [
            'Global transaction audit ledger spanning all users.',
            'Filter by monetary range, payment type, or suspicious flags.',
            'Audit log records ensuring database transaction integrity.',
            'Direct access to manage orphaned or shared cashbooks.'
        ],
        'Cashbook Registry'
    );

    // ==========================================
    // SLIDE 20: Section Divider – User Modules
    // ==========================================
    console.log('Generating Slide 20: Section Divider User Modules...');
    addSectionSlide('04', 'USER CLIENT MODULES', 'Personal finances, digital cashbooks, credit ledger, receipts vault & reports');

    // User Feature Slides
    await addFeatureSlide(
        'Landing Page: Modern Responsive Portal',
        'image11.png',
        [
            'Clean landing page with clear call-to-actions (Get Started, Sign In).',
            'Feature highlight cards illustrating the advantages of digital bookkeeping.',
            'Customer testimonials and responsive mobile/desktop layout.',
            'Direct onboarding path for new users.'
        ],
        'Landing Page'
    );

    await addFeatureSlide(
        'User Authentication: Login & Sign Up',
        'image12.png',
        [
            'Secure Sign In and Sign Up with validation.',
            'Bcrypt password encryption and JWT token exchange.',
            'Persistent light/dark UI theme preference storage.',
            'Session restoration to keep logged-in users productive.'
        ],
        'User Login'
    );

    await addFeatureSlide(
        'User Home Dashboard: Financial Overview',
        'image14.png',
        [
            'Real-time Net Balance card (Total In vs Total Out).',
            'Color-coded cash inflow (Green) and outflow (Red) metrics.',
            'Recent transaction feed with instant search and pagination.',
            'Quick access buttons to add entries or view ledger statements.'
        ],
        'Dashboard'
    );

    await addFeatureSlide(
        'Cashbooks: Multi-Ledger Management',
        'image15.png',
        [
            'Create unlimited segregated cashbooks (e.g. Home, Shop, Freelance).',
            'Independent balances calculated per cashbook.',
            'Seamless one-click switching between active cashbooks.',
            'Shared cashbook indicators showing collaborator count.'
        ],
        'Cashbooks'
    );

    await addFeatureSlide(
        'Transactions: Fast Logging & Popup',
        'image17.png',
        [
            'Fast modal popup for friction-free transaction entry.',
            'Select transaction type (Income vs Expense).',
            'Payment mode selection (Cash, Bank Transfer, UPI).',
            'Optional party tagging for credit and debit ledger syncing.'
        ],
        'Transactions'
    );

    // ==========================================
    // SLIDE 26: Party Ledger (Credit Book) - Highlighted!
    // ==========================================
    console.log('Generating Slide 26: Party Ledger...');
    await addFeatureSlide(
        'Party Ledger: Credit / Debit Tracking',
        'image18.png',
        [
            'Dedicated digitized ledger for tracking credit given and credit received.',
            'Visual cards for each party with Net Balance and credit/debt status indicator.',
            'Single-click WhatsApp reminder generator with pre-filled credit balance message.',
            'Historical ledger timeline per person showing credits, debits, and settlements.'
        ],
        'Party Ledger'
    );

    await addFeatureSlide(
        'EMI & Subscription Tracker',
        'image19.png',
        [
            'Centralized tracker for fixed monthly installments and subscriptions.',
            'Due-date calendar views and countdown days remaining badges.',
            'Auto-calculation of monthly recurring expenditure liability.',
            'Mark paid / active toggles to prevent missed deadline penalties.'
        ],
        'EMI & Subs'
    );

    await addFeatureSlide(
        'Receipts Vault: Document Storage',
        'image20.png',
        [
            'Secure digital storage for paper bill proofs, invoices, and warranties.',
            'Upload image files directly attached to monetary transactions.',
            'Full-screen modal image preview and download options.',
            'Search receipts by merchant name, date, or amount.'
        ],
        'Receipts Vault'
    );

    await addFeatureSlide(
        'Reminders & Custom Payment Modes',
        'image22.png',
        [
            'Manage and add customized payment channels (Cash, Google Pay, PhonePe, Cards).',
            'Set scheduled reminder alerts for recurring supplier payments.',
            'Visual icons indicating transaction payment mode on statement feeds.',
            'Real-time filter by payment channel in reports.'
        ],
        'Payment Mode'
    );

    await addFeatureSlide(
        'Shared Cashbooks & Member Invitations',
        'image23.png',
        [
            'Invite business partners, accountants, or family via email address.',
            'Real-time invitation approval workflow (Pending, Accepted, Rejected).',
            'Role permissions preventing unauthorized modifications.',
            'Collaborative live updates across invited members.'
        ],
        'Invitations'
    );

    await addFeatureSlide(
        'Financial Analytics & Exportable Reports',
        'image24.png',
        [
            'Interactive graphical analytics breaking down spending by category.',
            'Date range filtering (Today, This Month, This Year, Custom).',
            'One-click export of financial statements to PDF and Excel/CSV.',
            'Print-ready professional statement formatting for tax/accounting.'
        ],
        'Reports'
    );

    await addFeatureSlide(
        'User Settings: Security & Active Sessions',
        'image27.png',
        [
            'View all active devices and browser login sessions.',
            'Remote session revocation to terminate unauthorized logins.',
            'Profile information editing (Name, Phone Number, Password update).',
            'UI Theme preferences with instant dark/light mode toggle.'
        ],
        'Settings'
    );

    // ==========================================
    // SLIDE 33: Security & Performance Architecture
    // ==========================================
    console.log('Generating Slide 33: Security...');
    let slide33 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide33, 'Security Architecture & Performance Engineering');

    const securityCards = [
        { title: 'JWT Authentication', desc: 'Stateless JSON Web Tokens with encrypted HMAC signing for API request authorization.' },
        { title: 'Bcrypt Password Hashing', desc: 'Salt rounds of 10 applied to all passwords before database storage; zero plain-text storage.' },
        { title: 'Payload Sanitization', desc: 'Mongoose schema validators and input scrubbing preventing NoSQL injection and XSS.' },
        { title: 'CORS & Protection', desc: 'Whitelisted origin access ensuring backend endpoints only accept valid requests.' },
        { title: 'Database Indexing', desc: 'Compound index on user_email, cashbook_id, and date for sub-millisecond query returns.' },
        { title: 'Client Cache Optimization', desc: 'React state caching and optimistic UI updates minimizing redundant backend network roundtrips.' }
    ];

    for (let i = 0; i < securityCards.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 0.8 + col * 2.9;
        const y = 1.35 + row * 1.85;

        slide33.addShape(pres.ShapeType.rect, {
            x: x, y: y, w: 2.65, h: 1.65,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        slide33.addText(securityCards[i].title, {
            x: x + 0.2, y: y + 0.2, w: 2.25, h: 0.35,
            fontSize: 12.5, bold: true, color: PRIMARY_BLUE, fontFace: 'Segoe UI'
        });

        slide33.addText(securityCards[i].desc, {
            x: x + 0.2, y: y + 0.6, w: 2.25, h: 0.9,
            fontSize: 11, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 17
        });
    }

    // ==========================================
    // SLIDE 34: Future Enhancements & Roadmap
    // ==========================================
    console.log('Generating Slide 34: Future Scope...');
    let slide34 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide34, 'Future Scope & Technological Enhancements');

    const futureCards = [
        { icon: '🤖', title: 'AI Receipt OCR Scanner', desc: 'Integrate Tesseract.js / OpenAI Vision to automatically extract merchant name, date, and total amount from photographed bills.' },
        { icon: '📱', title: 'Cross-Platform Mobile App', desc: 'Develop React Native iOS and Android companion apps with offline-first synchronization and biometric fingerprint login.' },
        { icon: '🔔', title: 'Automated SMS & WhatsApp Bots', desc: 'Automated scheduling bot dispatching friendly payment reminders and one-tap payment link receipts via Twilio/Meta API.' },
        { icon: '🏦', title: 'Open Banking API Sync', desc: 'Direct integration with UPI and bank account feeds for automatic transaction logging without manual user input.' }
    ];

    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 0.8 + col * 4.3;
        const y = 1.35 + row * 1.85;

        slide34.addShape(pres.ShapeType.rect, {
            x: x, y: y, w: 4.1, h: 1.65,
            fill: { color: CARD_BG },
            line: { color: CARD_BORDER, width: 1 },
            rectRadius: 0.08
        });

        slide34.addText(futureCards[i].icon, {
            x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.4,
            fontSize: 20
        });

        slide34.addText(futureCards[i].title, {
            x: x + 0.8, y: y + 0.2, w: 3.1, h: 0.35,
            fontSize: 13, bold: true, color: NAVY, fontFace: 'Segoe UI'
        });

        slide34.addText(futureCards[i].desc, {
            x: x + 0.8, y: y + 0.6, w: 3.1, h: 0.9,
            fontSize: 11, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 17
        });
    }

    // ==========================================
    // SLIDE 35: References & Acknowledgments
    // ==========================================
    console.log('Generating Slide 35: References...');
    let slide35 = pres.addSlide('MAIN_LAYOUT');
    addHeader(slide35, 'References & Bibliography');

    slide35.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 1.3, w: 8.4, h: 3.65,
        fill: { color: CARD_BG },
        line: { color: CARD_BORDER, width: 1 },
        rectRadius: 0.08
    });

    slide35.addText([
        { text: 'Documentation & Technical Resources:\n', options: { bold: true, fontSize: 13, color: PRIMARY_BLUE } },
        { text: '•  React Official Documentation:  https://react.dev\n' },
        { text: '•  Node.js & Express API Reference:  https://nodejs.org  |  https://expressjs.com\n' },
        { text: '•  MongoDB & Mongoose Manuals:  https://www.mongodb.com/docs  |  https://mongoosejs.com\n' },
        { text: '•  Tailwind CSS Design Framework:  https://tailwindcss.com/docs\n' },
        { text: '•  Mermaid JS Software Diagramming:  https://mermaid.js.org\n\n' },
        { text: 'Institutional Guidance & Support:\n', options: { bold: true, fontSize: 13, color: PRIMARY_BLUE } },
        { text: '•  Prof. V. B. Shah Institute of Management & Sutex Bank College of Computer Applications & Science, Amroli\n' },
        { text: '•  Guidance and Mentorship by Mrs. Damyanti Patel (Assistant Professor)\n' },
        { text: '•  Veer Narmad South Gujarat University (VNSGU), Surat' }
    ], {
        x: 1.1, y: 1.5, w: 7.8, h: 3.2,
        fontSize: 11.5, color: TEXT_MAIN, fontFace: 'Calibri', lineSpacing: 20
    });

    // ==========================================
    // SLIDE 36: Conclusion & Thank You Slide
    // ==========================================
    console.log('Generating Slide 36: Thank You Slide...');
    let slide36 = pres.addSlide();
    slide36.background = { color: NAVY };

    slide36.addShape(pres.ShapeType.rect, {
        x: 1.5, y: 1.2, w: 7.0, h: 3.2,
        fill: { color: '1E293B' },
        line: { color: '334155', width: 1.5 },
        rectRadius: 0.1
    });

    slide36.addText('THANK YOU', {
        x: 1.5, y: 1.6, w: 7.0, h: 0.8,
        fontSize: 44, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Segoe UI'
    });

    slide36.addText('Cash-Book: Smart Finance & Digital Ledger', {
        x: 1.5, y: 2.4, w: 7.0, h: 0.4,
        fontSize: 18, bold: true, color: ACCENT_SKY, align: 'center', fontFace: 'Segoe UI'
    });

    slide36.addText('Any Questions or Feedback?', {
        x: 1.5, y: 2.9, w: 7.0, h: 0.4,
        fontSize: 14, color: '94A3B8', align: 'center', fontFace: 'Calibri'
    });

    slide36.addText('Bhuva Jeel M.  •  Savsaviya Kushal B.  •  Narola Jash M.', {
        x: 1.5, y: 3.6, w: 7.0, h: 0.4,
        fontSize: 12, bold: true, color: 'CBD5E1', align: 'center', fontFace: 'Calibri'
    });

    // Output presentations
    const outFiles = [
        'Cash_Book_Project_Presentation_Horizontal.pptx',
        'Cash_Book_Editable.pptx',
        'Cash_Book_Project_Report.pptx'
    ];

    console.log('Writing output PPTX files...');
    for (const outFile of outFiles) {
        await pres.writeFile({ fileName: outFile });
        console.log(`Saved: ${outFile}`);
    }

    console.log('ALL DONE! Total Slides Created:', pres.slides.length);
}

buildHorizontalPpt().catch(console.error);
