import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";

export class UserExtraHoursViewModel {
    nip: string
    category: string
    position: string
    name: string
    userHours: IBaseExtraHoursRegist[]

    constructor(nip: string, category: string, position: string, name: string, userHours: IBaseExtraHoursRegist[]) {
        this.nip = nip
        this.category = category
        this.position = position
        this.name = name
        this.userHours = userHours
    }
}
