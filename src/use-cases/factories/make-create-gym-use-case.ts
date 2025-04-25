import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new GymUseCase(gymsRepository)

  return useCase
}