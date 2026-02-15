const { query, pool } = require('./src/database');
const bcrypt = require('bcrypt');

const seedData = async () => {
    const email = 'sadikmd2k01@gmail.com';
    const password = 'password123'; // Default password if user needs creation
    const name = 'Sadik Demo';

    console.log(`Checking for user: ${email}...`);

    try {
        // Check for user
        const userRes = await query('SELECT * FROM users WHERE email = $1', [email]);
        let user = userRes.rows[0];

        if (!user) {
            console.log('User not found. Creating new user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const insertUserRes = await query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
                [name, email, hashedPassword]
            );
            user = { id: insertUserRes.rows[0].id };
            console.log(`User created with ID: ${user.id}. Password: ${password}`);
        } else {
            console.log(`User found with ID: ${user.id}`);
        }

        const transactions = [
            { title: 'Grocery Store', amount: 54.20, category: 'Food', date: '2024-01-05', notes: 'Weekly supermarket shopping' },
            { title: 'Uber Ride', amount: 18.75, category: 'Transport', date: '2024-01-06', notes: 'Ride to office' },
            { title: 'Netflix Subscription', amount: 15.99, category: 'Lifestyle', date: '2024-01-07', notes: 'Monthly plan' },
            { title: 'Electricity Bill', amount: 120.00, category: 'Financial', date: '2024-01-08', notes: 'January bill' },
            // ... (keeping list short for brevity, but could include all if needed, let's include a few distinct ones)
            { title: 'Restaurant Dinner', amount: 72.40, category: 'Food', date: '2024-01-10', notes: 'Dinner with friends' },
            { title: 'Gym Membership', amount: 45.00, category: 'Health', date: '2024-01-11', notes: 'Monthly membership' },
            { title: 'Bus Ticket', amount: 3.50, category: 'Transport', date: '2024-01-12', notes: 'Public transport' },
            { title: 'Amazon Purchase', amount: 89.99, category: 'Shopping', date: '2024-01-14', notes: 'Headphones' },
            { title: 'Water Bill', amount: 35.00, category: 'Financial', date: '2024-01-15', notes: 'Monthly water bill' },
            { title: 'Salary', amount: 5000.00, category: 'Income', date: '2024-01-30', notes: 'Monthly Salary' }
        ];

        // Insert transactions
        for (const t of transactions) {
            await query(
                'INSERT INTO transactions (user_id, title, amount, category, date, notes) VALUES ($1, $2, $3, $4, $5, $6)',
                [user.id, t.title, t.amount, t.category, t.date, t.notes]
            );
        }

        console.log(`Successfully inserted transactions for ${email}`);
    } catch (err) {
        console.error('Error inserting transactions:', err);
        throw err;
    } finally {
        await pool.end();
    }
};

if (require.main === module) {
    seedData();
}

module.exports = { seedData };
