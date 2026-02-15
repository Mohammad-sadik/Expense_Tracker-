const { query } = require('../database');

const UserModel = {
    create: async (user) => {
        const text = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at';
        const values = [user.name, user.email, user.password];
        const res = await query(text, values);
        return res.rows[0];
    },

    findByEmail: async (email) => {
        const text = 'SELECT * FROM users WHERE email = $1';
        const res = await query(text, [email]);
        return res.rows[0];
    },

    findById: async (id) => {
        const text = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
        const res = await query(text, [id]);
        return res.rows[0];
    }
};

module.exports = UserModel;
