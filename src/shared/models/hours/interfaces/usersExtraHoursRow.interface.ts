export interface IUsersExtraHoursRow {
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
    dayType: number;
    extraHours: number;
}
