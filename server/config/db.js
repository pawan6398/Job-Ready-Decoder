import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let isMemoryStore = false;

// Local JSON backup store for seamless local execution if MongoDB daemon is not active
const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const loadStore = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading store file, initializing fresh store:', e.message);
  }
  return { users: [], jobDescriptions: [], resumes: [], analyses: [] };
};

export const saveStore = (data) => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving store file:', e.message);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job_ready_decoder';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    isMemoryStore = false;
  } catch (error) {
    console.warn(`[Database] MongoDB not reachable at ${uri} (${error.message}).`);
    console.log(`[Database] >>> Activating Persistent Local File Fallback Store at: ${STORE_PATH}`);
    console.log(`[Database] >>> All features (Auth, Uploads, Analysis, 30-Day Plan) will persist cleanly!`);
    isMemoryStore = true;
  }
};
