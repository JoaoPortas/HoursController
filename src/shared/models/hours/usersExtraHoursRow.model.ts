import { IUsersExtraHoursRow } from "./interfaces/usersExtraHoursRow.interface";

export class UserExtraHoursRow implements IUsersExtraHoursRow {
    date: string;
    userId: number;
    number: string;
    category: string;
    position: string;
    name: string;
    morningStartTime: string | null;
    morningEndTime: string | null;
    afternoonStartTime: string | null;
    afternoonEndTime: string | null;
    dayTypeID: number;
    extraHours: number;

    constructor(date: string, userID: number, number: string, category: string, position: string, name: string, morningStartTime: string | null,
        morningEndTime: string | null, afternoonStartTime: string | null, afternoonEndTime: string | null, dayTypeID: number, extraHours: number
    ) {
        this.date = date;
        this.userId = userID;
        this.number = number;
        this.category = category;
        this.position = position;
        this.name = name;
        this.morningStartTime = morningStartTime;
        this.morningEndTime = morningEndTime;
        this.afternoonStartTime = afternoonStartTime;
        this.afternoonEndTime = afternoonEndTime;
        this.dayTypeID = dayTypeID;
        this.extraHours = extraHours;
    }
}
