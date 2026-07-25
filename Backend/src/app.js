import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.js';
import contactRouter from './routes/contact.js';
import invitationRouter from './routes/invitation.js';
import cashbookRouter from './routes/cashbook.js';
import transactionRouter from './routes/transaction.js';
import categoryRouter from './routes/category.js';
import subcategoryRouter from './routes/subcategory.js';
import paymentModeRouter from './routes/paymentMode.js';
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
app.use('/api/transaction', transactionRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subcategoryRouter);
app.use('/api/payment-mode', paymentModeRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
