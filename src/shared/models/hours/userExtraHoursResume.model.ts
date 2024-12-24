export class UserExtraHoursResume {
    userID: number
    hoursFor25: number = 0;
    hoursFor37Dot5: number = 0;
    hoursFor50: number = 0;
    hoursFor75: number = 0;
    hoursFor50HolyDays: number = 0;
    hoursFor100HolyDays: number = 0;

    constructor(userID, hoursFor25, hoursFor37Dot5, hoursFor50, hoursFor75, hoursFor50HolyDays, hoursFor100HolyDays) {
        this.userID = userID
        this.hoursFor25 = hoursFor25
        this.hoursFor37Dot5 = hoursFor37Dot5
        this.hoursFor50 = hoursFor50
        this.hoursFor75 = hoursFor75
        this.hoursFor50HolyDays = hoursFor50HolyDays
        this.hoursFor100HolyDays = hoursFor100HolyDays
    }
}
