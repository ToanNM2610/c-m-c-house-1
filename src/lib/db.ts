import fs from 'fs';
import path from 'path';
import { DatabaseSchema, MenuItem, CafeEvent, CafeSettings, SpatialPlate } from '@/types';
import { initialDbData } from './seedData';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

function ensureDbExists(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDbData, null, 2), 'utf-8');
  } else {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      if (!content.trim()) {
        fs.writeFileSync(DB_PATH, JSON.stringify(initialDbData, null, 2), 'utf-8');
      }
    } catch {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDbData, null, 2), 'utf-8');
    }
  }
}

export async function getDb(): Promise<DatabaseSchema> {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw) as DatabaseSchema;
    return data;
  } catch (error) {
    console.error('Error reading db.json, returning initial seed data', error);
    return initialDbData;
  }
}

export async function writeDb(data: DatabaseSchema): Promise<DatabaseSchema> {
  ensureDbExists();
  data.lastUpdated = new Date().toISOString();

  const tempPath = `${DB_PATH}.tmp.${Date.now()}`;
  const payload = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(tempPath, payload, 'utf-8');
    try {
      fs.renameSync(tempPath, DB_PATH);
    } catch {
      fs.copyFileSync(tempPath, DB_PATH);
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // ignore tmp unlink failure
      }
    }
    return data;
  } catch (error) {
    console.error('Error writing to db.json', error);
    throw error;
  }
}
