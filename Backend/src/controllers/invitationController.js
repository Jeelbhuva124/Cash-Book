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
