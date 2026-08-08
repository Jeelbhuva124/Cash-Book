import mongoose from 'mongoose';
import emailService from '../Service/emailService.js';
import Invitation from '../models/invitation.js';
import User from '../models/user.js';

// Send Invitation
export const sendInvitation = async (req, res) => {
    try {
        console.log('POST /api/invitation body received:', req.body);
        const { email, invite_name, inviter_email, inviter_id, cashbook_name, permissions } = req.body;

        if (!email || !cashbook_name || !permissions) {
            const missing = [];
            if (!email) missing.push('email');
            if (!cashbook_name) missing.push('cashbook_name');
            if (!permissions) missing.push('permissions');
            console.warn('Validation failed. Missing fields:', missing, 'Received:', { email, cashbook_name, permissions });
            return res.status(400).json({ 
                success: false, 
                message: `Missing required fields: ${missing.join(', ')}`,
                received: req.body
            });
        }

        // Save invitation document to database (status defaults to 'Pending')
        const newInvite = new Invitation({
            email,
            invite_name,
            inviter_email,
            inviter_id,
            cashbook_name,
            permissions,
            status: 'Pending'
        });
        await newInvite.save();

        // Dynamically lookup inviter name from DB to send in the email template
        let inviterName = 'A Cash Book user';
        if (inviter_id) {
            try {
                const inviterUser = await User.findById(inviter_id);
                if (inviterUser && inviterUser.username) {
                    inviterName = inviterUser.username;
                }
            } catch (err) {
                console.warn('Could not retrieve inviter details for email template:', err.message);
            }
        }

        // Dispatch invite email
        await emailService.sendInviteEmail(email, invite_name, inviterName, cashbook_name, permissions, newInvite.id);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Invitation email sent and saved as Pending',
            data: newInvite 
        });
    } catch (error) {
        console.error('Invitation Controller Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send invitation' });
    }
};

// Get all invitations (optionally filter by email, inviter_email or inviter_id)
export const getInvitations = async (req, res) => {
    try {
        const { email, inviter_email, inviter_id } = req.query;
        let query = {};

        if (email) {
            query.email = email.toLowerCase();
        }
        if (inviter_email) {
            query.inviter_email = inviter_email.toLowerCase();
        }
        if (inviter_id) {
            query.inviter_id = inviter_id;
        }

        const invitations = await Invitation.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: invitations });
    } catch (error) {
        console.error('Get Invitations Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch invitations' });
    }
};

// Update Invitation (Status or Permissions) via Request Body ID
export const updateInvite = async (req, res) => {
    try {
        const { id, status, permissions } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Invitation ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Invitation ID format' });
        }

        let updateFields = {};

        if (status !== undefined) {
            if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status value' });
            }
            updateFields.status = status;
        }

        if (permissions !== undefined) {
            updateFields.permissions = permissions;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update provided' });
        }

        const updatedInvite = await Invitation.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedInvite) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        // Send email notification to inviter's Gmail when invitation is accepted
        if (status === 'Accepted') {
            const inviterEmail = updatedInvite.inviter_email;
            const acceptorEmail = updatedInvite.email;
            const acceptorName = updatedInvite.invite_name || acceptorEmail;
            const cashbookName = updatedInvite.cashbook_name;
            const perms = updatedInvite.permissions;

            if (inviterEmail) {
                try {
                    await emailService.sendInviteAcceptedEmail(inviterEmail, acceptorEmail, acceptorName, cashbookName, perms);
                } catch (emailErr) {
                    console.error('Failed to send acceptance email to inviter Gmail:', emailErr);
                }
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Invitation updated successfully', 
            data: updatedInvite 
        });
    } catch (error) {
        console.error('Update Invitation Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update invitation' });
    }
};

// Delete/Cancel Invitation via Request Body ID
export const deleteInvite = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Invitation ID is required in body' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Invitation ID format' });
        }

        const deletedInvite = await Invitation.findByIdAndDelete(id);

        if (!deletedInvite) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Invitation deleted/cancelled successfully',
            data: deletedInvite
        });
    } catch (error) {
        console.error('Delete Invitation Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete invitation' });
    }
};

// Direct Accept via Mobile Email Button Click
export const acceptInviteDirect = async (req, res) => {
    try {
        const inviteId = req.query.accept_id || req.query.id;
        if (!inviteId || !mongoose.Types.ObjectId.isValid(inviteId)) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invalid Invitation</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; text-align: center; padding: 40px 20px; }
                        .card { background: #121827; border: 1px solid #1e293b; padding: 32px 24px; border-radius: 16px; max-width: 420px; margin: 40px auto; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2 style="color: #ef4444;">Invalid Invitation Link</h2>
                        <p style="color: #94a3b8; font-size: 14px;">The invitation link is invalid or expired.</p>
                    </div>
                </body>
                </html>
            `);
        }

        const updatedInvite = await Invitation.findByIdAndUpdate(
            inviteId,
            { status: 'Accepted' },
            { new: true }
        );

        if (!updatedInvite) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invitation Not Found</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; text-align: center; padding: 40px 20px; }
                        .card { background: #121827; border: 1px solid #1e293b; padding: 32px 24px; border-radius: 16px; max-width: 420px; margin: 40px auto; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2 style="color: #ef4444;">Invitation Not Found</h2>
                        <p style="color: #94a3b8; font-size: 14px;">This invitation may have already been removed.</p>
                    </div>
                </body>
                </html>
            `);
        }

        // Send acceptance email notification to inviter's Gmail
        if (updatedInvite.inviter_email) {
            try {
                await emailService.sendInviteAcceptedEmail(
                    updatedInvite.inviter_email,
                    updatedInvite.email,
                    updatedInvite.invite_name || updatedInvite.email,
                    updatedInvite.cashbook_name,
                    updatedInvite.permissions
                );
            } catch (e) {
                console.error("Failed to send acceptance notification email:", e);
            }
        }

        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invitation Accepted</title>
                <style>
                    body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; text-align: center; padding: 40px 20px; }
                    .card { background: #121827; border: 1px solid #1e293b; padding: 36px 24px; border-radius: 20px; max-width: 420px; margin: 40px auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
                    .icon { width: 56px; height: 56px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 50%; color: #10b981; font-size: 28px; line-height: 56px; margin: 0 auto 16px; }
                    h2 { color: #10b981; margin: 0 0 8px; font-size: 22px; font-weight: 700; }
                    p { color: #94a3b8; font-size: 14px; margin: 0 0 24px; line-height: 1.5; }
                    .details { background: #0b0f19; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left; }
                    .details-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
                    .details-row:last-child { margin-bottom: 0; }
                    .label { color: #64748b; }
                    .val { color: #f1f5f9; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="icon">✓</div>
                    <h2>Invitation Accepted</h2>
                    <p>You have successfully accepted the invitation to collaborate on <strong>"${updatedInvite.cashbook_name}"</strong>.</p>
                    <div class="details">
                        <div class="details-row"><span class="label">Cashbook:</span><span class="val">${updatedInvite.cashbook_name}</span></div>
                        <div class="details-row"><span class="label">Permission:</span><span class="val">${updatedInvite.permissions}</span></div>
                        <div class="details-row"><span class="label">Shared By:</span><span class="val">${updatedInvite.inviter_email}</span></div>
                    </div>
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">It will now appear in your Cash Book Inbox.</p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Accept Invite Direct Error:", error);
        return res.status(500).send("Failed to accept invitation");
    }
};
