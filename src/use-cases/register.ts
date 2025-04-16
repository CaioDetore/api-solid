import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistError } from "./errors/user-already-exist-error";

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}