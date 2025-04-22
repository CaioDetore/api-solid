import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { InMemoryCheckInRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { Prisma } from '../../generated/prisma'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      phone: '',
      id: 'gym-01',
      description: '',
      title: 'Javascript Gym',
      latitude: -21.9885649,
      longitude: -47.916267
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-1',
      userLatitude: -21.9885649,
      userLongitude: -47.9162678,
    })

    expect(checkIn.gym_id).toEqual('gym-01')
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.9885649,
      userLongitude: -47.9162678,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -21.9885649,
        userLongitude: -47.9162678,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.9885649,
      userLongitude: -47.9162678,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.9885649,
      userLongitude: -47.9162678,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      phone: '',
      id: 'gym-02',
      description: '',
      title: 'Javascript Gym',
      latitude: new Prisma.Decimal(-20.6384656),
      longitude: new Prisma.Decimal(-51.1445595)
    })

    await expect(async () =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-1',
        userLatitude: -21.9885649,
        userLongitude: -47.9162678,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})