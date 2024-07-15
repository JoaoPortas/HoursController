export interface IBaseExtraHoursRegist {
    date: Date,
    userID: number,
    morningStartTime?: string,
    morningEndTime?: string,
    afternoonStartTime?: string,
    afternoonEndTime?: string,
    dayTypeID: number
}

export interface IExtraHoursRegist {
    extraHoursID: number
}