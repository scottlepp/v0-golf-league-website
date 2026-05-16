import { neon } from '@neondatabase/serverless'

const connectionString =
  process.env.PDP_GOLF_DATABASE_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('PDP_GOLF_DATABASE_URL (or DATABASE_URL) is not set')
}

const sql = neon(connectionString)

export default sql
