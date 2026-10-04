import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database/encuestas.db');
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

const db = new Database(dbPath);
console.log('Conectado exitosamente a la base de datos SQLite.');

// Verificar si la tabla existe antes de intentar cargar el esquema
const tableCheck = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='encuesta'"
).get();

if (!tableCheck && fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('Esquema de base de datos cargado correctamente.');
} else {
  console.log('La base de datos ya contiene las tablas iniciales.');
}

export default db;
