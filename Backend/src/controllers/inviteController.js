import emailService from '../Service/emailService.js';
import Invite from '../models/invite.js';

// Send Invitation
export const sendInvitation = async (req, res) => {
    try {
        const { email, inviteeName, inviterName, inviterEmail, inviterId, cashbookName, permissions } = req.body;

        if (!email || !cashbookName || !permissions) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Save invitation document to database (status defaults to 'Pending')
        const newInvite = new Invite({
            email,
            inviteeName,
            inviterName,
            inviterEmail,
            inviterId,
            cashbookName,
            permissions,
            status: 'Pending'
        });
        await newInvite.save();

        // Dispatch invite email
        await emailService.sendInviteEmail(email, inviteeName, inviterName, cashbookName, permissions);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Invitation email sent and saved as Pending',
            data: newInvite 
        });
    } catch (error) {
        console.error('Invite Controller Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send invitation' });
    }
};

// Get all invitations (optionally filter by email, inviterEmail or inviterId)
export const getInvitations = async (req, res) => {
    try {
        const { email, inviterEmail, inviterId } = req.query;
        let query = {};

        if (email) {
            query.email = email.toLowerCase();
        }
        if (inviterEmail) {
            query.inviterEmail = inviterEmail.toLowerCase();
        }
        if (inviterId) {
            query.inviterId = inviterId;
        }

        const invitations = await Invite.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: invitations });
    } catch (error) {
        console.error('Get Invitations Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch invitations' });
    }
};

// Update Invitation Status (Accept / Reject)
export const updateInviteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const updatedInvite = await Invite.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedInvite) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: `Invitation status updated to ${status}`, 
            data: updatedInvite 
        });
    } catch (error) {
        console.error('Update Invite Status Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update invitation status' });
    }
};

// Update Invitation Permission
export const updateInvitePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        if (!permissions) {
            return res.status(400).json({ success: false, message: 'Permissions field is required' });
        }

        const updatedInvite = await Invite.findByIdAndUpdate(
            id,
            { permissions },
            { new: true, runValidators: true }
        );

        if (!updatedInvite) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Invitation permissions updated successfully', 
            data: updatedInvite 
        });
    } catch (error) {
        console.error('Update Invite Permission Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update permissions' });
    }
};

// Delete/Cancel Invitation
export const deleteInvite = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInvite = await Invite.findByIdAndDelete(id);

        if (!deletedInvite) {
            return res.status(404).json({ success: false, message: 'Invitation not found' });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Invitation deleted/cancelled successfully',
            data: deletedInvite
        });
    } catch (error) {
        console.error('Delete Invite Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete invitation' });
    }
};
