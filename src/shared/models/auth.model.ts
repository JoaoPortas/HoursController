import { IUserRegist } from "./interfaces/userRegist.mode";

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
