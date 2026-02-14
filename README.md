# Personal Expense Tracker 💰

Hi there! 👋

This is a personal expense tracking application I built to help manage finances better. It allows you to track your income and expenses, visualize where your money is going, and keep a history of all your transactions.

## What is this?

It's a full-stack web application (MERN stack logic, but using SQLite for simplicity) where you can:
- **Sign up and Login** securely.
- **Track Income & Expenses**: See exactly how much is coming in and going out.
- **Dashboard Overview**: Get a quick snapshot of your total balance, income, and expenses with nice charts (well, summary cards for now!).
- **Transaction History**: View a list of all your past transactions. I added a cool "View More" feature so the list doesn't get cluttered.
- **Filter & Search**: Easily find that one coffee you bought last month by category, date, or amount.
- **Indian Currency Support**: Everything is displayed in ₹ (INR) because that's what I needed!

## Tech Stack

I used some pretty standard and reliable tech for this:
- **Frontend**: React (Vite) - for a fast and snappy UI.
- **Backend**: Node.js & Express - simple and effective api.
- **Database**: SQLite - keeping it lightweight and easy to run locally without setting up a heavy database server.
- **Styling**: Just plain CSS! I wanted to keep it custom and clean without relying on big frameworks.

## How to Run It

If you want to run this on your machine, here is what you need to do:

1.  **Clone the repo** (obviously!).
2.  **Setup the Server**:
    ```bash
    cd server
    npm install
    node server.js
    ```
    The server runs on port `5000`. You might need to change the JWT_SECRET in `.env` if you want to be super secure, but the default works for testing.

3.  **Setup the Client**:
    Open a new terminal:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    The frontend usually runs on port `5173`.

4.  **Open your browser** and go to the link shown in the client terminal (usually `http://localhost:5173`).

## Features I'm Proud Of

- **The Dashboard**: I really like how the Income (Green) and Expense (Red) cards turned out. It gives you immediate feedback on your financial health.
- **The "Add New" Modal**: Instead of a boring separate page, I made a smooth popup for adding transactions. It feels much quicker to use.
- **Responsive Design**: It looks decent on mobile too, which was important for checking expenses on the go.

Feel free to look around the code! I tried to keep it clean and organized. Let me know if you have any suggestions.

Cheers! 🚀
