import { Gym } from "generated/prisma";
import { GymsRepository } from "@/repositories/gym-repository";

interface GymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}
export class GymUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({
    title,
    phone,
    description,
    latitude,
    longitude
  }: GymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      phone,
      description,
      latitude,
      longitude
    })

    return {
      gym
    }
  }
}