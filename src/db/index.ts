// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema.ts'

export function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set!')
  }

  const sql = neon(connectionString)
  return drizzle(sql, { schema })
}

export async function getClient() {
  const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL
  if (!connectionString) {
    return null
  }
  return neon(connectionString)
}
