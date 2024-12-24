import { UserExtraHoursResume } from './userExtraHoursResume.model';

export class UserInfoExtraHoursResume {
    userID: number;
    number: string;
    category: string;
    position: string;
    name: string;
    userExtraHoursResume: UserExtraHoursResume

    constructor(userID: number, number: string, category: string, position: string, name: string, userExtraHoursResume: UserExtraHoursResume) {
        this.userID = userID
        this.number = number;
        this.category = category;
        this.position = position;
        this.name = name;
        this.userExtraHoursResume = userExtraHoursResume
    }
}
