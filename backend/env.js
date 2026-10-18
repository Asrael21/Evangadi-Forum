import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Process environment (Railway / Docker injected vars) takes precedence
// 2. Load from root .env if present
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// 3. Load from backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });
// 4. Default fallback to current working directory
dotenv.config();
