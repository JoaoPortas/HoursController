export interface IBaseExtraHoursRegist {
    date: string,
    userID: number,
    morningStartTime: string | null,
    morningEndTime?: string | null,
    afternoonStartTime?: string | null,
    afternoonEndTime?: string | null,
    dayTypeID: number
}

export interface IExtraHoursRegist {
    extraHoursID: number
}
