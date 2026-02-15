const { db } = require('../database');

const UserModel = {
    create: (user) => {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(user.name, user.email, user.password);
        return { id: info.lastInsertRowid, ...user };
    },

    findByEmail: (email) => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
        return stmt.get(id);
    }
};

module.exports = UserModel;
