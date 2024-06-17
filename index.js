const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and handle URL encoded forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to fetch data securely
app.get('/api/patients/:employee_key', async (req, res) => {
    const employee_key = req.params.employee_key;
    const username = process.env.COALITION_USERNAME;
    const password = process.env.COALITION_PASSWORD;

    // Base64 encode the username and password for Basic Auth
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const patientData = data[employee_key];

        res.json(patientData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
