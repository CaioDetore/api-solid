import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repositories";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}
export async function registerUseCase({ email, name, password }: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exist.')
  }

  const prismaUserRepository = new PrismaUsersRepository()

  prismaUserRepository.create({
    name,
    email,
    password_hash
  })
}