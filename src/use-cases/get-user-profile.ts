import { UsersRepository } from "@/repositories/user-repository";
import { User } from "generated/prisma";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileCaseRequest {
  userId: string
}

interface GetUserProfileCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) { }

  async execute({ userId }: GetUserProfileCaseRequest): Promise<GetUserProfileCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}