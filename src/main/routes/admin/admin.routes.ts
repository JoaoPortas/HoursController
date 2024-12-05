import { resetUserPassword } from "@main/repository/admin.repository"
import { getAllUsersInfo } from "@main/services/admin/usersManagement.service"
import { IUser } from "@shared/models/interfaces/user.interface"
import { ipcMain } from "electron"

export function registAdminRoutes(routeName: string) {
    ipcMain.handle(routeName + '/getAllUsersInfo', async (_event): Promise<Array<IUser>> => {
        const result = await getAllUsersInfo()
        return result
    })

    ipcMain.handle(routeName + '/resetUserPassword', async (_event, userID: number): Promise<boolean> => {
        const result = await resetUserPassword(userID)
        return result
    })
}