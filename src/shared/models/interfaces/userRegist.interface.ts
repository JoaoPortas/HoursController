import { IBaseUserInfo } from "./userInfo.interface"

export interface IUserRegist extends IBaseUserInfo {
    username: string
    password: string
}
