import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
    console.log("Testing SMTP connection...");
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : ''
        },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.verify();
        console.log("SMTP Connection verified successfully!");
        
        // Try sending a test email
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: "Test Email from Cash-Book",
            text: "If you receive this, SMTP is working!"
        });
        console.log("Test email sent:", info.messageId);
    } catch (error) {
        console.error("SMTP Error:", error);
    }
}

testEmail();
