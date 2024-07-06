import { ipcMain } from 'electron'
import { UserRegist } from '../../shared/models/auth.model';
import { something } from '../repository/user.repository';

/*
export const createUser = ipcMain.handle('/users/sendUser', async (_event, newUser: UserRegist): Promise<UserRegist> => {
    const result = await something(newUser)
    return result
})*/

export function registUsersRoutes(routeName: string) {
    ipcMain.handle(routeName + '/sendUser', async (_event, newUser: UserRegist): Promise<UserRegist> => {
        const result = await something(newUser)
        return result
    })

    ipcMain.handle('/users/updateUser', async (_event, newUser: UserRegist): Promise<UserRegist> => {
        const result = await something(newUser)
        return result
    })
}


