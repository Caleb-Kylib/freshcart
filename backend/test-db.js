const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing connection to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
