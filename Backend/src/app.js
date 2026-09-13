import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';
import contactRouter from './routes/contact.js';
import invitationRouter from './routes/invitation.js';
import cashbookRouter from './routes/cashbook.js';
import transactionRouter from './routes/transaction.js';
import categoryRouter from './routes/category.js';
import subcategoryRouter from './routes/subcategory.js';
import paymentModeRouter from './routes/paymentMode.js';
import emiSubscriptionRouter from './routes/emiSubscription.js';
import receiptRouter from './routes/receipt.js';
import errorHandler from './middlewares/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Cash-Book Backend API is live!' });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Cash-Book Backend API is live!' });
});

// Route Mapping
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/invitation', invitationRouter);
app.use('/api/cashbook', cashbookRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subcategoryRouter);
app.use('/api/payment-mode', paymentModeRouter);
app.use('/api/emi-subscription', emiSubscriptionRouter);
app.use('/api/receipts', receiptRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
