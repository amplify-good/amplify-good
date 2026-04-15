/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Creates three Auth users for UI / integration testing (confirmed email, same
 * emails as cleanup-ui-test-users.js). Use when Supabase "Confirm email" is ON
 * and browser signup cannot obtain a session.
 *
 *   pnpm seed:ui-test
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
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

const PASSWORD = 'password123'

const USERS = [
  {
    email: 'uitest.ag.musician@gmail.com',
    role: 'musician',
    displayName: 'UI Test Musician',
    musician: {
      bio: 'Seeded for UI tests.',
      genres: ['Jazz'],
      rate: 200,
      rate_type: 'hourly',
    },
  },
  {
    email: 'uitest.ag.nonprofit@gmail.com',
    role: 'nonprofit',
    displayName: 'UI Test Nonprofit',
    nonprofit: {
      bio: 'Seeded for UI tests.',
      website: 'https://uitest-nonprofit.example.org',
      cause: 'Youth Arts',
    },
  },
  {
    email: 'uitest.ag.community@gmail.com',
    role: 'community',
    displayName: 'UI Test Community',
  },
]

async function main() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check .env.local.'
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (listError) throw listError

  const byEmail = new Map(
    listData.users.filter((u) => u.email).map((u) => [u.email.toLowerCase(), u])
  )

  for (const spec of USERS) {
    const email = spec.email.toLowerCase()
    let userId

    const existing = byEmail.get(email)
    if (existing) {
      userId = existing.id
      const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
        password: PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: spec.role,
          display_name: spec.displayName,
        },
      })
      if (updErr) throw updErr
      const { error: profErr } = await supabase
        .from('profiles')
        .update({
          role: spec.role,
          display_name: spec.displayName,
          email: spec.email,
        })
        .eq('id', userId)
      if (profErr) throw profErr
      console.log(`Updated auth user ${spec.email}`)
    } else {
      const { data: created, error: createError } =
        await supabase.auth.admin.createUser({
          email: spec.email,
          password: PASSWORD,
          email_confirm: true,
          user_metadata: {
            role: spec.role,
            display_name: spec.displayName,
          },
        })
      if (createError) throw createError
      userId = created.user.id
      console.log(`Created auth user ${spec.email}`)
    }

    if (spec.role === 'musician' && spec.musician) {
      const { data: existingM, error: selErr } = await supabase
        .from('musicians')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      if (selErr) throw selErr

      if (existingM) {
        const { error: muErr } = await supabase
          .from('musicians')
          .update({
            name: spec.displayName,
            bio: spec.musician.bio,
            genres: spec.musician.genres,
            rate: spec.musician.rate,
            rate_type: spec.musician.rate_type,
            available: true,
          })
          .eq('user_id', userId)
        if (muErr) throw muErr
      } else {
        const { error: insErr } = await supabase.from('musicians').insert({
          user_id: userId,
          name: spec.displayName,
          bio: spec.musician.bio,
          genres: spec.musician.genres,
          photo_url: null,
          rate: spec.musician.rate,
          rate_type: spec.musician.rate_type,
          available: true,
        })
        if (insErr) throw insErr
      }
      console.log(`  → musicians row for ${spec.email}`)
    }

    if (spec.role === 'nonprofit' && spec.nonprofit) {
      const { data: existingN, error: nSelErr } = await supabase
        .from('nonprofits')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      if (nSelErr) throw nSelErr

      if (existingN) {
        const { error: npErr } = await supabase
          .from('nonprofits')
          .update({
            name: spec.displayName,
            bio: spec.nonprofit.bio,
            website: spec.nonprofit.website,
            contact_email: spec.email,
            cause: spec.nonprofit.cause,
            logo_url: null,
          })
          .eq('user_id', userId)
        if (npErr) throw npErr
      } else {
        const { error: npIns } = await supabase.from('nonprofits').insert({
          user_id: userId,
          name: spec.displayName,
          bio: spec.nonprofit.bio,
          website: spec.nonprofit.website,
          logo_url: null,
          contact_email: spec.email,
          cause: spec.nonprofit.cause,
        })
        if (npIns) throw npIns
      }
      console.log(`  → nonprofits row for ${spec.email}`)
    }
  }

  console.log('UI test users are ready. Password for all:', PASSWORD)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
