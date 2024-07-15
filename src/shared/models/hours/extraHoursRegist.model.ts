import { IBaseExtraHoursRegist } from "./interfaces/hoursRegist.interface";

export class BaseExtraHoursRegist implements IBaseExtraHoursRegist {
    date: Date;
    userID: number;
    morningStartTime?: string;
    morningEndTime?: string;
    afternoonStartTime?: string;
    afternoonEndTime?: string;
    dayTypeID: number;

    constructor(date: Date, userID: number, morningStartTime: string,
        morningEndTime: string, afternoonStartTime: string, afternoonEndTime: string,
        dayTypeID: number
    ) {
        this.date = date;
        this.userID = userID;
        this.morningStartTime = morningStartTime;
        this.morningEndTime = morningEndTime;
        this.afternoonStartTime = afternoonStartTime;
        this.afternoonEndTime = afternoonEndTime;
        this.dayTypeID = dayTypeID;
    }
}