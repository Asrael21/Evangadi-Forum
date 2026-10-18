import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnv = path.resolve(__dirname, '../.env');
const backendEnv = path.resolve(__dirname, '.env');

// Suppress repetitive noisy dotenvx banner logs
const options = { quiet: true };

if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv, ...options });
}
if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv, ...options });
}
dotenv.config(options);
