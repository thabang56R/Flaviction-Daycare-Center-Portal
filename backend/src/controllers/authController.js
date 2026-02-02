// backend/src/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ────────────────────────────────────────────────
// Register new user (public – only parents allowed)
// ────────────────────────────────────────────────
export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  // Force role to 'parent' for public registration
  const role = 'parent';

  try {
    // Check if user already exists (email or username)
    let existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase().trim() }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        msg: 'User with this email or username already exists' 
      });
    }

    const user = new User({
      username,
      email: email.toLowerCase().trim(),
      password,
      name: name?.trim() || username,
      role
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      userId: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      msg: 'Registration successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// ────────────────────────────────────────────────
// Create staff account (teacher or admin) – admin only
// ────────────────────────────────────────────────
export const createStaff = async (req, res) => {
  const { username, email, password, role, name } = req.body;

  // Only admins can create staff
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin privileges required' });
  }

  // Validate role
  if (!['teacher', 'admin'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role – must be teacher or admin' });
  }

  try {
    let existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase().trim() }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        msg: 'User with this email or username already exists' 
      });
    }

    const user = new User({
      username,
      email: email.toLowerCase().trim(),
      password,
      name: name?.trim() || username,
      role
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      userId: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      msg: `${role.charAt(0).toUpperCase() + role.slice(1)} account created`,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Staff creation error:', err);
    res.status(500).json({ msg: 'Server error while creating staff account' });
  }
};

// ────────────────────────────────────────────────
// Login user
// ────────────────────────────────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      userId: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};