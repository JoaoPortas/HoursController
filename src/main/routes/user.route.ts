import { ipcMain } from 'electron'
import { UserRegist } from '@shared/models/auth.model';
import { authenticateUser, checkUsername, createUser, getAllUsers, getUserById, something, updateUserDataByUserID, updateUserPasswordByUserID } from '@main/repository/user.repository';
import { IUser } from '@shared/models/interfaces/user.interface';
import { IUserAuth } from '@shared/models/interfaces/userAuth.interface';
import { User } from '@shared/models/user.model';

/*
export const createUser = ipcMain.handle('/users/sendUser', async (_event, newUser: UserRegist): Promise<UserRegist> => {
    const result = await something(newUser)
    return result
})*/

export function registUsersRoutes(routeName: string) {
    ipcMain.handle(routeName + '/create', async (_event, newUser: UserRegist): Promise<UserRegist | null> => {
        const result = await createUser(newUser)
        return result
    })

    ipcMain.handle(routeName + '/getAll', async (_event): Promise<Array<IUser> | null> => {
        const result: Array<IUser> | null = await getAllUsers()
        return result
    })

    ipcMain.handle(routeName + '/updateUser', async (_event, newUser: UserRegist): Promise<UserRegist> => {
        const result = await something(newUser)
        return result
    })

    ipcMain.handle(routeName + '/checkUsername', async (_event, username: string): Promise<boolean> => {
        const result = await checkUsername(username)
        return result
    })

    ipcMain.handle(routeName + '/authenticateUser', async (_event, userAuth: IUserAuth): Promise<User | null> => {
        const result = await authenticateUser(userAuth)
        return result
    })

    ipcMain.handle(routeName + '/getUserByID', async (_event, userID: number): Promise<IUser | null> => {
        const result = await getUserById(userID)
        return result
    })

    ipcMain.handle(routeName + '/updateUserDataByUserID', async (_event, userID: number, userData: IUser): Promise<IUser | null> => {
        const result = await updateUserDataByUserID(userID, userData)
        return result
    })

    ipcMain.handle(routeName + '/updateUserPasswordByUserID', async (_event, userID: number, newPassword: string): Promise<boolean> => {
        const result = await updateUserPasswordByUserID(userID, newPassword)
        return result
    })
}


