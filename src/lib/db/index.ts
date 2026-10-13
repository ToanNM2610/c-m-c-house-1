import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

export const isDbConnected = Boolean(databaseUrl);

// Neon HTTP client for serverless Next.js
export const db = isDbConnected && databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : null;

export * from "./schema";
