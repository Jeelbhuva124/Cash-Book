import express from 'express';
import { 
    sendInvitation, 
    getInvitations, 
    updateInvite, 
    deleteInvite,
    acceptInviteDirect
} from '../controllers/invitationController.js';

const router = express.Router();

// GET all invitations
router.get('/select', getInvitations);

// GET direct mobile accept invitation from email link
router.get('/accept-direct', acceptInviteDirect);

// POST new invitation
router.post('/insert', sendInvitation);

// PUT update invitation status or permissions
router.put('/update', updateInvite);

// DELETE remove/cancel invitation
router.delete('/delete', deleteInvite);

export default router;
