import express from 'express';
import { 
    sendInvitation, 
    getInvitations, 
    updateInvite, 
    deleteInvite,
    acceptInviteDirect
} from '../controllers/invitationController.js';

const router = express.Router();

// Base URL endpoints (http://localhost:5001/api/invitation)
router.get('/', getInvitations);
router.post('/', sendInvitation);
router.put('/', updateInvite);
router.delete('/', deleteInvite);

// Subpath endpoints (legacy/compatibility)
router.get('/select', getInvitations);
router.get('/accept-direct', acceptInviteDirect);
router.post('/insert', sendInvitation);
router.put('/update', updateInvite);
router.delete('/delete', deleteInvite);

export default router;
