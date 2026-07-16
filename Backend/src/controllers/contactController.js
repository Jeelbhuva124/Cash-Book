import emailService from '../Service/emailService.js';

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Use emailService to dispatch the message to the admin inbox
        await emailService.sendContactMessageEmail(name, email, message);

        return res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Error in submitContactForm:", error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};
