import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";

export class UserExtraHoursViewModel {
    userID: number
    nip: string
    category: string
    position: string
    name: string
    userHours: IBaseExtraHoursRegist[]

    constructor(userID: number, nip: string, category: string, position: string, name: string, userHours: IBaseExtraHoursRegist[]) {
        this.userID = userID
        this.nip = nip
        this.category = category
        this.position = position
        this.name = name
        this.userHours = userHours
    }
}
