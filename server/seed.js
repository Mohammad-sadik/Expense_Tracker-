const { db, initDb } = require('./src/database');
const bcrypt = require('bcrypt');

const seedData = async () => {
    const email = 'sadikmd2k01@gmail.com';
    const password = 'password123'; // Default password if user needs creation
    const name = 'Sadik Demo';

    console.log(`Checking for user: ${email}...`);

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
        console.log('User not found. Creating new user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
        user = { id: info.lastInsertRowid };
        console.log(`User created with ID: ${user.id}. Password: ${password}`);
    } else {
        console.log(`User found with ID: ${user.id}`);
    }

    const transactions = [
        { title: 'Grocery Store', amount: 54.20, category: 'Food', date: '2024-01-05', notes: 'Weekly supermarket shopping' },
        { title: 'Uber Ride', amount: 18.75, category: 'Transport', date: '2024-01-06', notes: 'Ride to office' },
        { title: 'Netflix Subscription', amount: 15.99, category: 'Lifestyle', date: '2024-01-07', notes: 'Monthly plan' },
        { title: 'Electricity Bill', amount: 120.00, category: 'Financial', date: '2024-01-08', notes: 'January bill' },
        { title: 'Restaurant Dinner', amount: 72.40, category: 'Food', date: '2024-01-10', notes: 'Dinner with friends' },
        { title: 'Gym Membership', amount: 45.00, category: 'Health', date: '2024-01-11', notes: 'Monthly membership' },
        { title: 'Bus Ticket', amount: 3.50, category: 'Transport', date: '2024-01-12', notes: 'Public transport' },
        { title: 'Amazon Purchase', amount: 89.99, category: 'Shopping', date: '2024-01-14', notes: 'Headphones' },
        { title: 'Water Bill', amount: 35.00, category: 'Financial', date: '2024-01-15', notes: 'Monthly water bill' },
        { title: 'Movie Tickets', amount: 28.00, category: 'Lifestyle', date: '2024-01-16', notes: 'Cinema night' },
        { title: 'Lunch', amount: 12.50, category: 'Food', date: '2024-01-18', notes: 'Office lunch' },
        { title: 'Taxi Ride', amount: 22.30, category: 'Transport', date: '2024-01-20', notes: 'Airport taxi' },
        { title: 'Internet Bill', amount: 60.00, category: 'Financial', date: '2024-01-22', notes: 'Monthly broadband' },
        { title: 'Clothing Store', amount: 150.75, category: 'Shopping', date: '2024-01-23', notes: 'Winter jacket' },
        { title: 'Pharmacy', amount: 25.40, category: 'Health', date: '2024-01-25', notes: 'Medicines' },
        { title: 'Coffee', amount: 5.20, category: 'Food', date: '2024-02-01', notes: 'Morning coffee' },
        { title: 'Fuel', amount: 95.00, category: 'Transport', date: '2024-02-02', notes: 'Car fuel refill' },
        { title: 'Spotify Subscription', amount: 9.99, category: 'Lifestyle', date: '2024-02-03', notes: 'Monthly music plan' },
        { title: 'Gas Bill', amount: 80.00, category: 'Financial', date: '2024-02-05', notes: 'Gas charges' },
        { title: 'Bookstore', amount: 45.60, category: 'Shopping', date: '2024-02-06', notes: 'Programming book' },
        { title: 'Doctor Visit', amount: 110.00, category: 'Health', date: '2024-02-08', notes: 'General checkup' },
        { title: 'Pizza Order', amount: 26.80, category: 'Food', date: '2024-02-10', notes: 'Weekend order' },
        { title: 'Train Ticket', amount: 40.00, category: 'Transport', date: '2024-02-11', notes: 'Business trip' },
        { title: 'Concert Ticket', amount: 120.00, category: 'Lifestyle', date: '2024-02-13', notes: 'Live concert' },
        { title: 'Online Course', amount: 199.00, category: 'Growth', date: '2024-02-15', notes: 'React course' },
        { title: 'Office Supplies', amount: 34.50, category: 'Work', date: '2024-02-17', notes: 'Stationery' },
        { title: 'Salad Bar', amount: 14.30, category: 'Food', date: '2024-02-18', notes: 'Healthy lunch' },
        { title: 'Parking Fee', amount: 8.00, category: 'Transport', date: '2024-02-19', notes: 'City parking' },
        { title: 'Yoga Class', amount: 30.00, category: 'Health', date: '2024-02-20', notes: 'Weekend yoga' },
        { title: 'Laptop Repair', amount: 250.00, category: 'Other', date: '2024-02-22', notes: 'Screen replacement' }
    ];

    const insertStmt = db.prepare(`
        INSERT INTO transactions (user_id, title, amount, category, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((txs) => {
        for (const t of txs) {
            insertStmt.run(user.id, t.title, t.amount, t.category, t.date, t.notes);
        }
    });

    try {
        insertMany(transactions);
        console.log(`Successfully inserted ${transactions.length} transactions for ${email}`);
    } catch (err) {
        console.error('Error inserting transactions:', err);
        throw err; // Re-throw for API error handling
    }
};

if (require.main === module) {
    seedData();
}

module.exports = { seedData };
