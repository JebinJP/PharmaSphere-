const { createUser } = require('../models/userModel');
const db = require('../config/db');

const createAdmin = async () => {
    try {
        console.log("Attempting to create admin user...");
        const user = await createUser('admin', 'admin', 'ADMIN');
        console.log("Admin user created successfully:", user);
    } catch (error) {
        if (error.code === '23505') { // Unique violation code for Postgres
            console.log("User 'admin' already exists. Updating password...");

            // Force update the password
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('admin', 10);
            await db.query('UPDATE users SET password = $1, role = $2 WHERE username = $3', [hashedPassword, 'ADMIN', 'admin']);
            console.log("Updated existing 'admin' user with new password 'admin'.");
        } else {
            console.error("Error creating admin user:", error);
        }
    } finally {
        process.exit();
    }
};

createAdmin();
