const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database/encuestas.db');
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

const db = new Database(dbPath);
console.log('Conectado exitosamente a la base de datos SQLite.');

// Verificar si las tablas ya fueron creadas antes de ejecutar schema.sql
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

module.exports = db;
