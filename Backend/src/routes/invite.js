import express from 'express';
import emailService from '../Service/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email, inviteeName, inviterName, cashbookName, permissions } = req.body;

        if (!email || !cashbookName || !permissions) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        await emailService.sendInviteEmail(email, inviteeName, inviterName, cashbookName, permissions);
        
        res.status(200).json({ success: true, message: 'Invitation email sent successfully' });
    } catch (error) {
        console.error('Invite Route Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send invitation email' });
    }
});

export default router;
