// key-generator.js
const fs = require('fs');

// File to store the current key and timestamp
const KEY_FILE = './currentKey.json';

// Generate a random alphanumeric key
function generateKey(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// Check if key exists and is older than 12 hours
function getKey() {
    if (fs.existsSync(KEY_FILE)) {
        const data = JSON.parse(fs.readFileSync(KEY_FILE));
        const now = Date.now();
        if (now - data.timestamp < 12 * 60 * 60 * 1000) { // 12 hours
            return data.key; // still valid
        }
    }

    // Generate new key
    const newKey = generateKey(12);
    const newData = {
        key: newKey,
        timestamp: Date.now()
    };
    fs.writeFileSync(KEY_FILE, JSON.stringify(newData, null, 2));
    return newKey;
}

// Simple HTTP server to return current key
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/key', (req, res) => {
    res.send(getKey());
});

app.listen(PORT, () => console.log(`Key server running on port ${PORT}`));
