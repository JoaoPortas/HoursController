import { IBaseExtraHoursRegist } from "./interfaces/hoursRegist.interface";

export class BaseExtraHoursRegist implements IBaseExtraHoursRegist {
    date: string;
    userID: number;
    morningStartTime: string | null;
    morningEndTime: string | null;
    afternoonStartTime: string | null;
    afternoonEndTime: string | null;
    dayTypeID: number;

    constructor(date: string, userID: number, morningStartTime: string | null,
        morningEndTime: string | null, afternoonStartTime: string | null, afternoonEndTime: string | null,
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
