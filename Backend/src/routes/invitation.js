import express from 'express';
import { 
    sendInvitation, 
    getInvitations, 
    updateInvite, 
    deleteInvite 
} from '../controllers/invitationController.js';

const router = express.Router();

// GET all invitations
router.get('/select', getInvitations);

// POST new invitation
router.post('/insert', sendInvitation);

// PUT update invitation status or permissions
router.put('/update', updateInvite);

// DELETE remove/cancel invitation
router.delete('/delete', deleteInvite);

export default router;
