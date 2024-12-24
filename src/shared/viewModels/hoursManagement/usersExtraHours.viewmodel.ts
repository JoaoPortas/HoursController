import { UserExtraHoursViewModel } from "./userExtraHours.viewmodel"

export class UsersExtraHoursViewModel {
    users: UserExtraHoursViewModel[]

    constructor(users: UserExtraHoursViewModel[]) {
        this.users = users
    }
}
