import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import initializeFirebase from './config/firebase.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  // Initialize Firebase Admin SDK
  const firebaseStatus = initializeFirebase();
  console.log(`Firebase: ${firebaseStatus}`);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  app.set('io', io);

  server.listen(PORT, () => {
    console.log(`Cash-Book Server is running on port ${PORT}`);
  });
};

// Cashbook Server entry
startServer();
