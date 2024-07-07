import { IUserAuth } from "./interfaces/userAuth.interface";
import { IUserRegist } from "./interfaces/userRegist.interface";

export class UserRegist implements IUserRegist {
    username: string;
    password: string;
    number: string;
    name: string;
    category: string;
    position: string;

    constructor(username: string, password: string, number: string, name: string, category: string, position: string) {
        this.username = username
        this.password = password
        this.number = number
        this.name = name
        this.category = category
        this.position = position
    }
}

export class UserAuth implements IUserAuth {
    username: string
    password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
}
