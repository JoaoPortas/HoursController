import { createExtraHoursRegist, getAllUsersExtraHoursByYearAndMonth, getUserAllExtraHours, getUserAllExtraHoursByYearAndMonth, getUserAllExtraHoursResumeByYear, getUserAllExtraHoursResumeByYearAndMonth, getUserExtraHoursByDate, updateExtraHoursRegist } from "@main/repository/extraHours.repository";
import { IExtraHoursResume } from "@shared/models/hours/interfaces/extraHoursResume.interface";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { ipcMain } from "electron";
import * as fs from "fs";

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

    ipcMain.handle(routeName + '/getUserAllExtraHoursResumeByYearAndMonth', async (_event, userID: number, year: string, month: string): Promise<IExtraHoursResume[] | null> => {
        const result = await getUserAllExtraHoursResumeByYearAndMonth(userID, year, month)
        return result
    })

    ipcMain.handle(routeName + '/getUserAllExtraHoursResumeByYear', async (_event, userID: number, year: string): Promise<IExtraHoursResume[] | null> => {
        const result = await getUserAllExtraHoursResumeByYear(userID, year)
        return result
    })

    ipcMain.handle('read-file', async (_event, filePath) => {
        try {
          const content = await fs.readFileSync(filePath);
          return content;
        } catch (error) {
          console.error('Error reading file:', error);
          throw error;
        }
    });

    ipcMain.handle(routeName + '/getAllUsersExtraHoursByYearAndMonth', async (_event, year: string, month: string): Promise<UserExtraHoursViewModel[] | null> => {
        const result = await getAllUsersExtraHoursByYearAndMonth(year, month)
        return result
    })
}
