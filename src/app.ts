import fastify from 'fastify'
import { PrismaClient } from 'generated/prisma'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    email: 'caiodetore@gmail.com',
    name: 'Caio'
  }
})