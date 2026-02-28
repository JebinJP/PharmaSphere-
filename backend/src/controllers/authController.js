const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');

const register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await userModel.findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = await userModel.createUser(username, password, role);
        const token = generateToken(newUser.id, newUser.role);
        res.status(201).json({ user: newUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.role);
        res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

module.exports = { register, login };
