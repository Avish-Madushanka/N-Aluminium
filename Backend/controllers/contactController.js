const Contact = require('../models/Contact');
const { sendContactReplyEmail } = require('../utils/emailService');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, location, expertise, message } = req.body;

        const validationErrors = {};
        if (!name || name.trim() === '') validationErrors.name = 'Name is required';
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) validationErrors.email = 'Valid email is required';
        if (!expertise) validationErrors.expertise = 'Expertise area is required';
        if (!message || message.trim() === '') validationErrors.message = 'Message is required';

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const contact = new Contact({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : '',
            location: location ? location.trim() : '',
            expertise,
            message: message.trim(),
            status: 'pending'
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                expertise: contact.expertise,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        console.error('Submit contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error('Get all contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact messages'
        });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        if (contact.status === 'pending') {
            contact.status = 'read';
            await contact.save();
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Get contact by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact message'
        });
    }
};

exports.updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        if (!['pending', 'read', 'responded'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        contact.status = status;
        if (adminNotes !== undefined) {
            contact.adminNotes = adminNotes;
        }
        if (status === 'responded') {
            contact.respondedAt = new Date();
        }

        await contact.save();

        res.status(200).json({
            success: true,
            message: `Contact message marked as ${status}`,
            data: contact
        });
    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status'
        });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact message'
        });
    }
};

exports.getContactStats = async (req, res) => {
    try {
        const total = await Contact.countDocuments();
        const pending = await Contact.countDocuments({ status: 'pending' });
        const read = await Contact.countDocuments({ status: 'read' });
        const responded = await Contact.countDocuments({ status: 'responded' });

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                read,
                responded
            }
        });
    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact statistics'
        });
    }
};

exports.sendReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply, subject, adminNotes } = req.body;

        if (!reply || reply.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Reply message is required'
            });
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        if (adminNotes !== undefined) {
            contact.adminNotes = adminNotes;
        }
        contact.status = 'responded';
        contact.respondedAt = new Date();
        await contact.save();

        await sendContactReplyEmail(contact.email, contact.name, subject, reply);

        res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            data: contact
        });
    } catch (error) {
        console.error('Send reply error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send reply: ' + error.message
        });
    }
};