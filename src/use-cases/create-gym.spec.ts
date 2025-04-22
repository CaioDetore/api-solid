import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { GymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: GymUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GymUseCase(gymsRepository)
  })

  it('should be able to get user profile', async () => {
    const { gym } = await sut.execute({
      phone: null,
      description: null,
      title: 'JavaScript Gym',
      latitude: -20.6384656,
      longitude: -51.1445595
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})