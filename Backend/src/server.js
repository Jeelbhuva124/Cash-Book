import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import initializeFirebase from './config/firebase.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  // Initialize Firebase Admin SDK
  const firebaseStatus = initializeFirebase();
  console.log(`Firebase: ${firebaseStatus}`);

  app.listen(PORT, () => {
    console.log(`Cash-Book Server is running on port ${PORT}`);
  });
};

// Cashbook Server entry
startServer();
