/* eslint-disable @typescript-eslint/no-require-imports */
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

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check .env.local.'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const DEMO_USERS = [
  {
    id: 'a0000001-0000-0000-0000-000000000001',
    email: 'music@gmail.com',
    password: 'password123',
    role: 'musician',
    displayName: 'Los Topo Chicos',
  },
  {
    id: 'a0000002-0000-0000-0000-000000000002',
    email: 'npo@gmail.com',
    password: 'password123',
    role: 'nonprofit',
    displayName: 'Austin Food Bank',
  },
  {
    id: 'a0000003-0000-0000-0000-000000000003',
    email: 'fan@gmail.com',
    password: 'password123',
    role: 'community',
    displayName: 'Rachel Torres',
  },
  {
    id: 'a0000004-0000-0000-0000-000000000004',
    email: 'event@gmail.com',
    password: 'password123',
    role: 'community',
    displayName: 'David Chen',
  },
  {
    id: 'a0000005-0000-0000-0000-000000000005',
    email: 'maria@gmail.com',
    password: 'password123',
    role: 'community',
    displayName: 'Maria Gonzalez',
  },
  {
    id: 'a0000006-0000-0000-0000-000000000006',
    email: 'eastside@gmail.com',
    password: 'password123',
    role: 'community',
    displayName: 'East Side Brewing Co.',
  },
  {
    id: 'a0000007-0000-0000-0000-000000000007',
    email: 'startup@gmail.com',
    password: 'password123',
    role: 'community',
    displayName: 'Startup ATX Collective',
  },
]

async function main() {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (error) throw error

  const usersById = new Map(data.users.map((user) => [user.id, user]))
  const usersByEmail = new Map(
    data.users
      .filter((user) => user.email)
      .map((user) => [user.email.toLowerCase(), user])
  )

  for (const demoUser of DEMO_USERS) {
    const byId = usersById.get(demoUser.id)
    const byEmail = usersByEmail.get(demoUser.email.toLowerCase())

    if (byEmail && byEmail.id !== demoUser.id) {
      throw new Error(
        `Email ${demoUser.email} already belongs to user ${byEmail.id}; refusing to overwrite.`
      )
    }

    if (!byId) {
      const { data: created, error: createError } =
        await supabase.auth.admin.createUser({
          id: demoUser.id,
          email: demoUser.email,
          password: demoUser.password,
          email_confirm: true,
          user_metadata: {
            role: demoUser.role,
            display_name: demoUser.displayName,
          },
        })

      if (createError) throw createError
      console.log(`Created auth user ${created.user.email}`)
      continue
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      demoUser.id,
      {
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
        user_metadata: {
          role: demoUser.role,
          display_name: demoUser.displayName,
        },
      }
    )

    if (updateError) throw updateError
    console.log(`Updated auth user ${demoUser.email}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
