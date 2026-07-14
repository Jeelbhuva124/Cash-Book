import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route Mapping
app.use('/api/users', userRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
