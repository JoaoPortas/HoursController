import { ipcMain } from 'electron'
import { UserRegist } from '../../shared/models/auth.model';
import { something } from '../repository/user.repository';


export const createUser = ipcMain.handle('/users/sendUser', async (_event, newUser: UserRegist): Promise<UserRegist> => {
    const result = await something(newUser)
    return result
})
