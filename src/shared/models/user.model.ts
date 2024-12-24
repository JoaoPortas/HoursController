import { IBaseUser, IUser } from "./interfaces/user.interface"

export class User implements IUser {
    userId: number
    username: string
    number: string
    name: string
    category: string
    position: string

    constructor(userId: number, username: string, number: string, name: string, category: string, position: string) {
        this.userId = userId
        this.username = username
        this.number = number
        this.name = name
        this.category = category
        this.position = position
    }
}


export class BaseUser implements IBaseUser {
    userId: number
    username: string

    constructor(userId: number, username: string) {
        this.userId = userId
        this.username = username
    }
}
