import dotenv from 'dotenv';
dotenv.config();
import app from '..';
import { connectDB } from './db';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);

        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
