// backend/src/controllers/inviteController.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Invite from '../models/Invite.js';
import User from '../models/User.js';
import Child from '../models/Child.js';

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,       // e.g. yourname@gmail.com
    pass: process.env.EMAIL_PASS        // App Password if using Gmail
  }
});

// ────────────────────────────────────────────────
// Create and send invitation (admin/teacher only)
// ────────────────────────────────────────────────
export const createInvite = async (req, res) => {
  const { email, childId } = req.body;

  if (!email || !childId) {
    return res.status(400).json({ msg: 'Email and childId are required' });
  }

  try {
    // Validate child exists
    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ msg: 'Child not found' });

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'This email is already registered' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invite record
    const invite = new Invite({
      email: email.toLowerCase().trim(),
      childId,
      token,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiry
      createdBy: req.user.userId
    });

    await invite.save();

    // Create registration link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteLink = `${frontendUrl}/signup?token=${token}&email=${encodeURIComponent(email)}&childId=${childId}`;

    // Send email
    const mailOptions = {
      from: `"Flaviction Daycare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Invitation to Join Flaviction Parent Portal',
      html: `
        <h2>Welcome to Flaviction DayCare Center!</h2>
        <p>You have been invited to create a parent account and connect to your child:</p>
        <p><strong>Child:</strong> ${child.name} (${child.classGroup || 'N/A'})</p>
        <p>Click the button below to register:</p>
        <a href="${inviteLink}" style="display: inline-block; background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Register & Link to Child
        </a>
        <p>This link expires in 7 days.</p>
        <p>If you didn't expect this invitation, please ignore this email or contact support.</p>
        <p>Best regards,<br>Flaviction DayCare Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      msg: 'Invitation sent successfully',
      inviteId: invite._id,
      email: email
    });
  } catch (err) {
    console.error('Invite creation error:', err);
    res.status(500).json({ msg: 'Server error while sending invitation' });
  }
};

// ────────────────────────────────────────────────
// Validate invite token (used during signup)
// ────────────────────────────────────────────────
export const validateInvite = async (req, res) => {
  const { token, email } = req.body;

  try {
    const invite = await Invite.findOne({
      token,
      email: email.toLowerCase().trim(),
      used: false,
      expires: { $gt: Date.now() }
    });

    if (!invite) {
      return res.status(400).json({ msg: 'Invalid, expired, or already used invitation' });
    }

    // Optional: return child info for auto-linking
    const child = await Child.findById(invite.childId).select('name classGroup photo');

    res.json({
      valid: true,
      childId: invite.childId,
      childName: child?.name,
      childClass: child?.classGroup
    });
  } catch (err) {
    console.error('Invite validation error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ────────────────────────────────────────────────
// Mark invite as used (call after successful signup)
// ────────────────────────────────────────────────
export const markInviteUsed = async (req, res) => {
  const { token, email } = req.body;

  try {
    const invite = await Invite.findOneAndUpdate(
      {
        token,
        email: email.toLowerCase().trim(),
        used: false,
        expires: { $gt: Date.now() }
      },
      { used: true },
      { new: true }
    );

    if (!invite) {
      return res.status(400).json({ msg: 'Invitation not found or already used' });
    }

    res.json({ msg: 'Invitation marked as used' });
  } catch (err) {
    console.error('Mark invite used error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export default {
  createInvite,
  validateInvite,
  markInviteUsed
};