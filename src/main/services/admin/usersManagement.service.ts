import * as admin from "@main/repository/admin.repository";
import { IUser } from "@shared/models/interfaces/user.interface";

export async function getAllUsersInfo(): Promise<Array<IUser>> {
    let users: Array<IUser> | null = await admin.getAllUsersInfo();
    if (users !== null)
        return users;
    else
        return new Array<IUser>();
}