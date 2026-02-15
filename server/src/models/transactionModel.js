const { query } = require('../database');

const TransactionModel = {
    create: async (transaction) => {
        const text = `
            INSERT INTO transactions (user_id, title, amount, category, date, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            transaction.user_id,
            transaction.title,
            transaction.amount,
            transaction.category,
            transaction.date,
            transaction.notes
        ];
        const res = await query(text, values);
        return res.rows[0];
    },

    update: async (id, userId, updates) => {
        const text = `
            UPDATE transactions
            SET title = $1, amount = $2, category = $3, date = $4, notes = $5
            WHERE id = $6 AND user_id = $7
        `;
        const values = [
            updates.title,
            updates.amount,
            updates.category,
            updates.date,
            updates.notes,
            id,
            userId
        ];
        const res = await query(text, values);
        return res.rowCount > 0;
    },

    delete: async (id, userId) => {
        const text = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2';
        const res = await query(text, [id, userId]);
        return res.rowCount > 0;
    },

    findById: async (id, userId) => {
        const text = 'SELECT * FROM transactions WHERE id = $1 AND user_id = $2';
        const res = await query(text, [id, userId]);
        return res.rows[0];
    },

    findAll: async ({ userId, page = 1, limit = 10, search, category, minAmount, maxAmount, startDate, endDate }) => {
        let sql = 'SELECT * FROM transactions WHERE user_id = $1';
        const params = [userId];
        let paramIndex = 2; // Start from $2

        if (search) {
            sql += ` AND (title ILIKE $${paramIndex} OR notes ILIKE $${paramIndex + 1})`;
            params.push(`%${search}%`, `%${search}%`);
            paramIndex += 2;
        }

        if (category) {
            sql += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        if (minAmount) {
            sql += ` AND amount >= $${paramIndex}`;
            params.push(minAmount);
            paramIndex++;
        }

        if (maxAmount) {
            sql += ` AND amount <= $${paramIndex}`;
            params.push(maxAmount);
            paramIndex++;
        }

        if (startDate) {
            sql += ` AND date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            sql += ` AND date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        // Count total for pagination (separate query)
        // We need to reconstruct the WHERE clause for count, but without pagination
        const countSql = `SELECT COUNT(*) as count ${sql.substring(sql.indexOf('FROM'))}`;
        const countRes = await query(countSql, params);
        const total = parseInt(countRes.rows[0].count);

        // Add ordering and pagination
        sql += ` ORDER BY date DESC, id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, (page - 1) * limit);

        const res = await query(sql, params);

        return { data: res.rows, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    getDashboardData: async (userId) => {
        // Total expenses
        const totalRes = await query('SELECT SUM(amount) as total FROM transactions WHERE user_id = $1', [userId]);
        const total = parseFloat(totalRes.rows[0].total || 0);

        // Category breakdown
        const categoryRes = await query(`
            SELECT category, SUM(amount) as total
            FROM transactions
            WHERE user_id = $1
            GROUP BY category
        `, [userId]);

        // Explicitly convert total to float because Postgres SUM returns string for decimals
        const breakdown = categoryRes.rows.map(row => ({
            category: row.category,
            total: parseFloat(row.total)
        }));

        // Recent transactions
        const recentRes = await query(`
            SELECT * FROM transactions
            WHERE user_id = $1
            ORDER BY date DESC, id DESC
            LIMIT 5
        `, [userId]);

        return { total, breakdown, recent: recentRes.rows };
    }
};

module.exports = TransactionModel;
