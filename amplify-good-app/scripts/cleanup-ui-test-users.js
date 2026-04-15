/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Removes Auth users created for manual / automated UI signup tests.
 *
 * Deletes by email (Supabase Auth admin API). Public rows (profiles, musicians,
 * nonprofits) cascade from auth via FKs where configured.
 *
 * Usage:
 *   pnpm cleanup:ui-test
 *   node scripts/cleanup-ui-test-users.js
 *   UI_TEST_EMAILS="a@x.com,b@y.com" node scripts/cleanup-ui-test-users.js
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (.env.local)
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

const projectRoot = process.cwd()
loadEnvFile(path.join(projectRoot, '.env.local'))
loadEnvFile(path.join(projectRoot, '.env'))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use a real public-mail domain; Supabase rejects reserved domains like @example.com.
const DEFAULT_EMAILS = [
  'uitest.ag.musician@gmail.com',
  'uitest.ag.nonprofit@gmail.com',
  'uitest.ag.community@gmail.com',
]

function parseEmails() {
  const fromEnv = process.env.UI_TEST_EMAILS
  if (fromEnv && fromEnv.trim()) {
    return fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  }
  return DEFAULT_EMAILS.map((e) => e.toLowerCase())
}

async function main() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check .env.local.'
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const targets = parseEmails()
  const want = new Set(targets)

  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (error) throw error

  const toDelete = data.users.filter(
    (u) => u.email && want.has(u.email.toLowerCase())
  )

  if (toDelete.length === 0) {
    console.log('No matching UI test users found. Nothing to delete.')
    return
  }

  for (const user of toDelete) {
    const { error: delErr } = await supabase.auth.admin.deleteUser(user.id)
    if (delErr) {
      console.error(`Failed to delete ${user.email} (${user.id}):`, delErr.message)
      throw delErr
    }
    console.log(`Deleted auth user ${user.email}`)
  }

  console.log(`Done. Removed ${toDelete.length} user(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
