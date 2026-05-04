import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { defineConfig, env } from 'prisma/config'
import path from 'node:path'

const rootEnvPath = path.resolve(__dirname, '../../.env')

dotenv.config({ path: rootEnvPath })
dotenvExpand.expand(dotenv.config())

console.log(process.env.DATABASE_URL)
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
