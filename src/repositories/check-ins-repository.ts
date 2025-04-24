import { CheckIn, Prisma } from "generated/prisma";

export interface CheckInRepository {
  save(checkIn: CheckIn): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}