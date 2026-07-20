import express from 'express';
import { 
    sendInvitation, 
    getInvitations, 
    updateInvite, 
    deleteInvite 
} from '../controllers/invitationController.js';

const router = express.Router();

// GET all invitations
router.get('/', getInvitations);

// POST new invitation
router.post('/', sendInvitation);

// PUT update invitation status or permissions
router.put('/', updateInvite);

// DELETE remove/cancel invitation
router.delete('/', deleteInvite);

export default router;
