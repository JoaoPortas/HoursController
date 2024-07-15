import { createExtraHoursRegist, getUserExtraHours } from "@main/repository/extraHours.repository";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { ipcMain } from "electron";

export function registHoursRoutes(routeName: string) {
    ipcMain.handle(routeName + '/create', async (_event, newExtraHours: IBaseExtraHoursRegist): Promise<IBaseExtraHoursRegist | null> => {
        const result = await createExtraHoursRegist(newExtraHours)
        return result
    })

    ipcMain.handle(routeName + '/getUserExtraHours', async (_event, userID: number): Promise<UserExtraHoursViewModel | null> => {
        const result = await getUserExtraHours(userID)
        return result
    })
}
