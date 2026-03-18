const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const checkDB = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const productCount = await mongoose.connection.collection('products').countDocuments();
        console.log('Total Products:', productCount);

        const products = await mongoose.connection.collection('products').find().limit(5).toArray();
        console.log('Sample Products:', JSON.stringify(products, null, 2));

        const userCount = await mongoose.connection.collection('users').countDocuments();
        console.log('Total Users:', userCount);

        const admins = await mongoose.connection.collection('users').find({ role: 'admin' }).toArray();
        console.log('Admins:', JSON.stringify(admins.map(a => ({ email: a.email, role: a.role })), null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkDB();
