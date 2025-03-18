const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS)
app.use(express.static('public'));

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost', // MySQL server host
    user: 'root',      // MySQL username
    password: 'password@1994', // MySQL password
    database: 'query_form', // Database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, query } = req.body;

    // Insert the form data into the database
    const sql = 'INSERT INTO queries (name, email, query) VALUES (?, ?, ?)';
    const values = [name, email, query];

    pool.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            // Send an error response to the frontend
            return res.status(500).send('Error submitting the form. Please try again.');
        }

        console.log('Form data saved to database:', results);
        // Send a success response to the frontend
        res.send('Form submitted successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});