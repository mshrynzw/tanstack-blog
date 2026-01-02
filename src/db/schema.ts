import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: serial().primaryKey(),
  title: text().notNull(),
  content: text().notNull(), 
  authorId: varchar('author_id', { length: 255 }),
  authorName: varchar('author_name', { length: 255 }), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
