const { db } = require('../database');

const TransactionModel = {
    create: (transaction) => {
        const stmt = db.prepare(`
      INSERT INTO transactions (user_id, title, amount, category, date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const info = stmt.run(
            transaction.user_id,
            transaction.title,
            transaction.amount,
            transaction.category,
            transaction.date,
            transaction.notes
        );
        return { id: info.lastInsertRowid, ...transaction };
    },

    update: (id, userId, updates) => {
        const stmt = db.prepare(`
      UPDATE transactions
      SET title = ?, amount = ?, category = ?, date = ?, notes = ?
      WHERE id = ? AND user_id = ?
    `);
        const info = stmt.run(
            updates.title,
            updates.amount,
            updates.category,
            updates.date,
            updates.notes,
            id,
            userId
        );
        return info.changes > 0;
    },

    delete: (id, userId) => {
        const stmt = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?');
        const info = stmt.run(id, userId);
        return info.changes > 0;
    },

    findById: (id, userId) => {
        const stmt = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?');
        return stmt.get(id, userId);
    },

    findAll: ({ userId, page, limit, search, category, minAmount, maxAmount, startDate, endDate }) => {
        let sql = 'SELECT * FROM transactions WHERE user_id = ?';
        const params = [userId];

        if (search) {
            sql += ' AND (title LIKE ? OR notes LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (minAmount) {
            sql += ' AND amount >= ?';
            params.push(minAmount);
        }

        if (maxAmount) {
            sql += ' AND amount <= ?';
            params.push(maxAmount);
        }

        if (startDate) {
            sql += ' AND date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND date <= ?';
            params.push(endDate);
        }

        // Count total required for pagination
        const countStmt = db.prepare(sql.replace('SELECT *', 'SELECT COUNT(*) as count'));
        const totalResult = countStmt.get(...params);
        const total = totalResult.count;

        // Add ordering and pagination
        sql += ' ORDER BY date DESC, id DESC LIMIT ? OFFSET ?';
        params.push(limit, (page - 1) * limit);

        const stmt = db.prepare(sql);
        const data = stmt.all(...params);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    getDashboardData: (userId) => {
        // Total expenses
        const totalStmt = db.prepare('SELECT SUM(amount) as total FROM transactions WHERE user_id = ?');
        const total = totalStmt.get(userId).total || 0;

        // Category breakdown
        const categoryStmt = db.prepare(`
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = ?
      GROUP BY category
    `);
        const breakdown = categoryStmt.all(userId);

        // Recent transactions
        const recentStmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ?
      ORDER BY date DESC, id DESC
      LIMIT 5
    `);
        const recent = recentStmt.all(userId);

        return { total, breakdown, recent };
    }
};

module.exports = TransactionModel;
