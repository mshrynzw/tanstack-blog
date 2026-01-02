import { drizzle } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema.ts'
import { prisma } from '../db.ts'

export const db = drizzle(process.env.DATABASE_URL!, { schema })

export { prisma }

export async function getClient() {
  const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL
  if (!connectionString) {
    return null
  }
  return neon(connectionString)
}
