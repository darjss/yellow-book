import { PrismaClient } from "@prisma/client"
import { withAccelerate } from '@prisma/extension-accelerate'
import * as path from 'path'
import dotenv from 'dotenv'

// Load environment variables as early as possible so Prisma sees DATABASE_URL
const envFilePath = process.env.DOTENV_CONFIG_PATH || path.resolve(process.cwd(), 'apps/api/.env')
dotenv.config({ path: envFilePath })

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma