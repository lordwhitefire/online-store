import { PrismaClient } from "@prisma/client"

const DATABASE_URL = "postgresql://neondb_owner:npg_Dk6mi1hpOfgU@ep-spring-silence-atbqg4nt.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
