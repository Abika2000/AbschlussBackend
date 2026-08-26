import mysql, { type OkPacket, type RowDataPacket } from 'mysql2';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if(existsSync(".env"))
{
  loadEnvFile();
}

export const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'wibi',
  password: process.env.DB_PASSWORD || 'WibiTest106',
  database: process.env.DB_NAME || 'BackendDb',
  port: Number(process.env.DB_PORT || 3306)
});

db.connect((err: Error | null) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    process.exit(1);
  }
  console.log(`Connected to MySQL database: ${process.env.DB_NAME || 'BackendDB'}`);
});