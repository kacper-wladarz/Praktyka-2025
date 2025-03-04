import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL nie jest zdefiniowany');
}

const db = drizzle(process.env.DATABASE_URL);
