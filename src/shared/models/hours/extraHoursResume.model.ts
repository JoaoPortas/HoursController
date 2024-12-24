import { IExtraHoursResume } from "./interfaces/extraHoursResume.interface";

export class ExtraHoursResume implements IExtraHoursResume {
    extraHoursID: number
    userID: number
    dayTypeID: number
    date: string
    month: string
    year: string
    extraHours: number

    constructor(extraHoursID, userID, dayTypeID, date, month, year, extraHours) {
        this.extraHoursID = extraHoursID
        this.userID = userID
        this.dayTypeID = dayTypeID
        this.date = date
        this.month = month
        this.year = year
        this.extraHours = extraHours
    }
}
