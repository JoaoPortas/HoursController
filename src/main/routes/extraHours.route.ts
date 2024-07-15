import { createExtraHoursRegist } from "@main/repository/extraHours.repository";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { ipcMain } from "electron";

export function registHoursRoutes(routeName: string) {
    ipcMain.handle(routeName + '/create', async (_event, newExtraHours: IBaseExtraHoursRegist): Promise<IBaseExtraHoursRegist | null> => {
        const result = await createExtraHoursRegist(newExtraHours)
        return result
    })
}
