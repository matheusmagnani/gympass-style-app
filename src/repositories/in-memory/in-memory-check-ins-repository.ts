import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import { isSameDay } from "date-fns";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []
  
  async findByUserIdOnDate(userId: string, date: Date){  
    
    const checkInOnSameDate = this.items.find((checkIn) => {    
      const isOnSameDate = isSameDay(checkIn.created_at, new Date())      
      return checkIn.user_id === userId && isOnSameDate
    })
    
    if(!checkInOnSameDate) {
      return null
    }
    
    return checkInOnSameDate
  }
  
  async findManyByUserId(userId: string, page: number){
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }
 async  create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
        id: randomUUID(),
        user_id: data.user_id,
        gym_id: data.gym_id,
        validated_at: data.validated_at ? new Date(data.validated_at) : null,
        created_at: new Date()
              
    }
    this.items.push(checkIn)

    return checkIn
    
  }

}