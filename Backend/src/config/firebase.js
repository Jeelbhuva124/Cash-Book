import { initializeApp, cert, getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

const initializeFirebase = () => {
  if (getApps().length > 0) {
    return '🟢 Already initialized';
  }

  let serviceAccount = null;
  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-Auth.json');

  try {
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    }

    if (serviceAccount) {
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        serviceAccount.private_key = serviceAccount.private_key.replace(/\r/g, '');
        serviceAccount.private_key = serviceAccount.private_key.trim();
      }

      initializeApp({
        credential: cert(serviceAccount)
      });
      return '🟢 Initialized successfully';
    } else {
      return '📦 Database-Only Mode (firebase-Auth.json not found)';
    }
  } catch (error) {
    return `🔴 Initialization Failed: ${error.message}`;
  }
};

export default initializeFirebase;
