import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';

const db = new Database(process.env.DB_PATH ?? 'database/encuestas.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(readFileSync(new URL('../../database/schema.sql', import.meta.url), 'utf8'));

export default db;