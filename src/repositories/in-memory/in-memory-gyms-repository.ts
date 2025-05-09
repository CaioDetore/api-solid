import { getDistanceBetweenCoordinates } from '../../utils/get-distance-beetween-cordinates'
import { Gym, Prisma } from '../.././../generated/prisma'
import { FindManyNearbyParams, GymsRepository } from '../gym-repository'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      title: data.title,
      checkIn: data.checkIn,
      description: data.description ?? null,
      phone: data.phone ?? null,
      created_at: new Date()
    }

    this.items.push(gym)

    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }


  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find(item => item.id === id)

    if (!gym) { return null }

    return gym
  }
}