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
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

        const transporterConfig = {
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: smtpPass
            },
            tls: { rejectUnauthorized: false }
        };

        const transporter = nodemailer.createTransport(transporterConfig);

        // Each digit cell: fixed width ensures all 4 always fit on one row
        const digitTd = `width:44px;height:52px;text-align:center;vertical-align:middle;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#1a2475;background-color:#f0f0f5;border:1px solid #dcdfe4;border-radius:10px;padding:0;`;

        const mailOptions = {
            from: `"Cash Book" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${otp} - Your Cash Book Login Code`,
            html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Cash Book Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    body { margin: 0; padding: 0; background-color: #eeeff2; }
    * { box-sizing: border-box; }
    @media only screen and (max-width: 480px) {
      .card { width: 100% !important; border-radius: 0 !important; }
      .body-cell { padding: 28px 20px 24px !important; }
      .header-cell { padding: 22px 20px !important; }
      .footer-cell { padding: 16px 20px !important; }
      .notice-cell { padding: 10px 12px !important; }
      .digit-gap { width: 6px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#eeeff2;font-family:'Roboto',Arial,Helvetica,sans-serif;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeff2;min-height:100%;">
    <tr>
      <td align="center" valign="top" style="padding:32px 12px;">

        <!-- Card -->
        <table role="presentation" class="card" width="440" cellpadding="0" cellspacing="0" border="0" style="width:440px;max-width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dcdfe4;">

          <!-- Header -->
          <tr>
            <td class="header-cell" align="center" style="background-color:#101b37;padding:24px 24px;">
              <p style="margin:0;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">Cash Book</p>
              <p style="margin:8px 0 0;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:10px;font-weight:500;color:#676f7e;text-transform:uppercase;letter-spacing:2px;">Smart Digital Ledger</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="body-cell" align="center" style="padding:32px 28px 28px;">

              <p style="margin:0 0 4px;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#1a2475;text-transform:uppercase;letter-spacing:1.5px;">Login Verification</p>
              <p style="margin:0 0 12px;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#131720;letter-spacing:-0.3px;">Your One-Time Code</p>
              <p style="margin:0 0 28px;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#676f7e;">
                Use this code to sign in to Cash Book. It expires in&nbsp;<strong style="color:#131720;font-weight:700;">2 minutes</strong>.
              </p>

              <!-- OTP Digits — all 4 in one table row, never wraps -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="${digitTd}">${otp[0]}</td>
                  <td class="digit-gap" style="width:8px;"></td>
                  <td style="${digitTd}">${otp[1]}</td>
                  <td class="digit-gap" style="width:8px;"></td>
                  <td style="${digitTd}">${otp[2]}</td>
                  <td class="digit-gap" style="width:8px;"></td>
                  <td style="${digitTd}">${otp[3]}</td>
                </tr>
              </table>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="notice-cell" style="background-color:#f0f0f5;border-left:3px solid #1a2475;border-radius:6px;padding:11px 13px;text-align:left;">
                    <p style="margin:0;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:#676f7e;">
                      <strong style="color:#131720;font-weight:700;">Security Notice:</strong> Cash Book will never call or message you to ask for this code. Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:1px;background-color:#dcdfe4;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-cell" align="center" style="padding:18px 28px;">
              <p style="margin:0 0 3px;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:11px;color:#676f7e;line-height:1.5;">
                If you did not request this code, you can safely ignore this email.
              </p>
              <p style="margin:0;font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:11px;font-weight:500;color:#a4adca;">
                &copy; 2026 Cash Book Ledger Systems. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] OTP email sent successfully to ${email}`);
        return true;
    } catch (err) {
        console.error(`[SMTP] Failed to send OTP email to ${email}:`, err.message);
        console.log(`\n==========================================`);
        console.log(`[SMTP FAIL FALLBACK] OTP for ${email} is: ${otp}`);
        console.log(`==========================================\n`);
        return true;
    }
};

const sendContactMessageEmail = async (name, senderEmail, message) => {
    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!hasSmtpConfig) {
        console.log(`\n==========================================`);
        console.log(`[DEVELOPMENT] SMTP not configured. Contact Message from ${name} (${senderEmail}): ${message}`);
        console.log(`==========================================\n`);
        return true;
    }

    try {
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

        const transporterConfig = {
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: smtpPass
            },
            tls: { rejectUnauthorized: false }
        };

        const transporter = nodemailer.createTransport(transporterConfig);

        const mailOptions = {
            from: `"Cash Book Support System" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to the admin's inbox
            replyTo: senderEmail,
            subject: `New Contact Form Submission from ${name}`,
            text: `You have received a new message from the Cash Book Contact Form.\n\nName: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${senderEmail}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; margin-left: 0;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Contact email from ${senderEmail} sent successfully`);
        return true;
    } catch (err) {
        console.error(`[SMTP] Failed to send contact email:`, err.message);
        throw new Error("Failed to send email");
    }
};

const sendInviteEmail = async (email, inviteeName, inviterName, cashbookName, permissions) => {
    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!hasSmtpConfig) {
        console.log(`\n==========================================`);
        console.log(`[DEVELOPMENT] SMTP not configured. Invitation sent to ${email} for Cashbook: ${cashbookName}`);
        console.log(`==========================================\n`);
        return true;
    }

    try {
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

        const transporterConfig = {
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: smtpPass
            },
            tls: { rejectUnauthorized: false }
        };

        const transporter = nodemailer.createTransport(transporterConfig);

        const mailOptions = {
            from: `"Cash Book Invitations" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `You have been invited to join a Cash Book`,
            html: `
                <div style="font-family: Arial, sans-serif; max-w-600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2b3674;">Cash Book Invitation</h2>
                    <p>Hello ${inviteeName || ''},</p>
                    <p><strong>${inviterName || 'A user'}</strong> has invited you to collaborate on the Cash Book: <strong>${cashbookName}</strong>.</p>
                    <p>You have been assigned <strong>${permissions}</strong> access.</p>
                    <br/>
                    <a href="http://localhost:5173/dashboard/invitations" style="background-color: #5a75f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Accept Invitation</a>
                    <br/><br/>
                    <p>Thanks,<br/>The Cash Book Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Invitation email to ${email} sent successfully`);
        return true;
    } catch (err) {
        console.error(`[SMTP] Failed to send invitation email:`, err.message);
        throw new Error("Failed to send email");
    }
};
export default { sendOtpEmail, sendContactMessageEmail, sendInviteEmail };
