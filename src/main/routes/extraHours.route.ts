import { createExtraHoursRegist, getUserAllExtraHours, getUserAllExtraHoursByYearAndMonth, getUserExtraHoursByDate, updateExtraHoursRegist } from "@main/repository/extraHours.repository";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { ipcMain } from "electron";

export function registHoursRoutes(routeName: string) {
    ipcMain.handle(routeName + '/create', async (_event, newExtraHours: IBaseExtraHoursRegist): Promise<IBaseExtraHoursRegist | null> => {
        const result = await createExtraHoursRegist(newExtraHours)
        return result
    })

    ipcMain.handle(routeName + '/update', async (_event, newExtraHours: IBaseExtraHoursRegist): Promise<IBaseExtraHoursRegist | null> => {
        const result = await updateExtraHoursRegist(newExtraHours)
        return result
    })

    ipcMain.handle(routeName + '/getUserAllExtraHours', async (_event, userID: number): Promise<UserExtraHoursViewModel | null> => {
        const result = await getUserAllExtraHours(userID)
        return result
    })

    ipcMain.handle(routeName + '/getUserAllExtraHoursByYearAndMonth', async (_event, userID: number, year: string, month: string): Promise<UserExtraHoursViewModel | null> => {
        const result = await getUserAllExtraHoursByYearAndMonth(userID, year, month)
        return result
    })

    ipcMain.handle(routeName + '/getUserExtraHoursByDate', async (_event, userID: number, date: string): Promise<IBaseExtraHoursRegist | null> => {
        const result = await getUserExtraHoursByDate(userID, date)
        return result
    })
}
