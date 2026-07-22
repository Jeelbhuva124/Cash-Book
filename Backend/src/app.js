import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import contactRouter from './routes/contact.js';
import invitationRouter from './routes/invitation.js';
import cashbookRouter from './routes/cashbook.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route Mapping
app.use('/api/users', userRouter);
app.use('/api/contact', contactRouter);
app.use('/api/invitation', invitationRouter);
app.use('/api/cashbook', cashbookRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
