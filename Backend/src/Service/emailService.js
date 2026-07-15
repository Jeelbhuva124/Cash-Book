import nodemailer from 'nodemailer';

const sendOtpEmail = async (email, otp) => {
    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (!hasSmtpConfig) {
        console.log(`\n==========================================`);
        console.log(`[DEVELOPMENT] SMTP not configured. OTP for ${email} is: ${otp}`);
        console.log(`==========================================\n`);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: `"Daily Chalan Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Your Daily Chalan Login OTP: ${otp}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; padding: 12px; background-color: #101b37; border-radius: 12px;">
                            <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">Daily Chalan</span>
                        </div>
                        <p style="font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Smart Finance Tracker</p>
                    </div>
                    <h2 style="font-size: 20px; font-weight: 800; text-align: center; color: #0f172a; margin-top: 0;">Verify Your Account Access</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #475569; text-align: center; margin-bottom: 24px;">
                        To complete your login, please use the following one-time verification code. This code will expire in 10 minutes.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563eb; background-color: #eff6ff; padding: 16px 32px; border-radius: 12px; border: 1px dashed #bfdbfe;">
                            ${otp}
                        </div>
                    </div>
                    <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                        If you did not request this verification code, please ignore this email or secure your account password.
                    </p>
                    <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #cbd5e1;">
                        © 2026 Daily Chalan Ledger Systems. All rights reserved.
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] OTP email sent successfully to ${email}`);
        return true;
    } catch (err) {
        console.error(`[SMTP] Failed to send OTP email to ${email}:`, err.message);
        // During dev/testing, fallback to console so the app doesn't break
        console.log(`\n==========================================`);
        console.log(`[SMTP FAIL FALLBACK] OTP for ${email} is: ${otp}`);
        console.log(`==========================================\n`);
        return true;
    }
};

export default { sendOtpEmail };
