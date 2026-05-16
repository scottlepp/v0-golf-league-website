import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { neon } from '@neondatabase/serverless'

const __dirname = dirname(fileURLToPath(import.meta.url))

const connectionString =
  process.env.PDP_GOLF_DATABASE_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  console.error(
    'PDP_GOLF_DATABASE_URL (or DATABASE_URL) is not set. Run with: node --env-file=.env.local scripts/seed.mjs',
  )
  process.exit(1)
}

const sql = neon(connectionString)
const seedPath = join(__dirname, 'seed.sql')
const fullSql = readFileSync(seedPath, 'utf8')

// Strip line comments, then split on semicolons.
const statements = fullSql
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

console.log(`Running ${statements.length} statements against the database...`)

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i]
  const preview = stmt.replace(/\s+/g, ' ').slice(0, 80)
  try {
    await sql.query(stmt)
    process.stdout.write(`  [${i + 1}/${statements.length}] ${preview}\n`)
  } catch (err) {
    console.error(`\nFailed on statement ${i + 1}:\n${stmt}\n\n${err.message}`)
    process.exit(1)
  }
}

console.log('\nSeed complete.')
