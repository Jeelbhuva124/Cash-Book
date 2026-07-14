import { Server } from 'socket.io';
import { geminiService } from './geminiService.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket Client Connected: ${socket.id}`);

    socket.on('sendMessage', async ({ prompt, messageId }) => {
      console.log(`Received prompt from client ${socket.id} (Msg: ${messageId}):`, prompt);

      if (!prompt) {
        socket.emit('responseError', { messageId, error: 'Prompt is required' });
        return;
      }

      try {
        await geminiService.generateStream(
          prompt,
          (chunk) => { socket.emit('responseChunk', { messageId, chunk }); },
          () => { socket.emit('responseEnd', { messageId }); },
          (error) => {
            console.error(`Gemini stream error for client ${socket.id}:`, error);
            socket.emit('responseError', { messageId, error: error.message || 'Error occurred while streaming' });
          }
        );
      } catch (error) {
        console.error(`Socket processing error for client ${socket.id}:`, error);
        socket.emit('responseError', { messageId, error: error.message || 'Error during prompt processing' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};
