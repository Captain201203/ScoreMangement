import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); 


console.log("🔑 Kiểm tra JWT_SECRET tại server.ts:", process.env.JWT_SECRET ? "ĐÃ CÓ GIÁ TRỊ" : "TRỐNG (UNDEFINED)");

import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HomeWorkManager';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.error('✗ MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`✓ Server is running on http://localhost:${PORT}`);
            console.log(`✓ Health check: http://localhost:${PORT}/health`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/students`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/classes`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/admins`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/teachers`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/majors`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/accounts`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/subjects`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/semesters`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/scores`);
            

        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
