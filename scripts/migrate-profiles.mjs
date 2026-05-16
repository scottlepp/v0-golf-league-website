import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { neon } from '@neondatabase/serverless'

const __dirname = dirname(fileURLToPath(import.meta.url))

const connectionString =
  process.env.PDP_GOLF_DATABASE_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  console.error('PDP_GOLF_DATABASE_URL (or DATABASE_URL) is not set.')
  process.exit(1)
}

const sql = neon(connectionString)
const fullSql = readFileSync(join(__dirname, 'migrate-profiles.sql'), 'utf8')
const statements = fullSql
  .split('\n')
  .filter((l) => !l.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)

console.log(`Running ${statements.length} profile-migration statements...`)
for (let i = 0; i < statements.length; i++) {
  try {
    await sql.query(statements[i])
    console.log(`  [${i + 1}/${statements.length}] OK`)
  } catch (err) {
    console.error(`\nFailed on statement ${i + 1}:\n${statements[i]}\n\n${err.message}`)
    process.exit(1)
  }
}
console.log('Profile migration complete.')
