import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://Kavishkhanna:kavishkhanna12@cluster0.mhogpcx.mongodb.net/eating-disorder?retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
