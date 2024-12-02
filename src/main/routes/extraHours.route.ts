import { createExtraHoursRegist, getAllUsersExtraHoursByYearAndMonth, getReportMetadata, getUserAllExtraHours, getUserAllExtraHoursByYearAndMonth, getUserAllExtraHoursResumeByYear, getUserAllExtraHoursResumeByYearAndMonth, getUserExtraHoursByDate, getUserTotalHoursExcludingMonthByYear, updateExtraHoursRegist, updateReportMetada } from "@main/repository/extraHours.repository";
import { getAllUsersMonthlyExtraHoursReport, getUserAnnualExtraHoursReport, getUserMonthlyExtraHoursReport } from "@main/services/extraHoursCalculator.service";
import { IExtraHoursResume } from "@shared/models/hours/interfaces/extraHoursResume.interface";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { ReportSettings } from "@shared/models/hours/reportSettings.model";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { ipcMain } from "electron";
import { saveAs } from "file-saver";
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
    });

    ipcMain.handle(routeName + '/getUserTotalHoursExcludingMonthByYear', async (_event, userID: number, year: string, excludedMonth: string): Promise<number | null> => {
        const result = await getUserTotalHoursExcludingMonthByYear(userID, year, excludedMonth)
        return result
    });

    //Gives the report of extra hours considerating every hour until the month received.
    ipcMain.handle(routeName + '/getUserMonthlyExtraHoursReport', async (_event, userID: number, year: string, month: string): Promise<any> => {
        const result = await getUserMonthlyExtraHoursReport(userID, year, month);
        return result
    });

    //Gives the report of extra hours considerating every hour until the month received for all users with extra hours in the indicated year and month.
    ipcMain.handle(routeName + '/getAllUsersMonthlyExtraHoursReport', async (_event, year: string, month: string): Promise<any> => {
        const result = await getAllUsersMonthlyExtraHoursReport(year, month);
        return result
    });

    ipcMain.handle(routeName + '/exportDocument', async (_event, generatedDocument: Uint8Array): Promise<any> => {
        const blob = new Blob([generatedDocument], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        saveAs(blob, `Horas_Suplementares_${123456}.docx`);
    });

    ipcMain.handle(routeName + '/getReportMetadata', async (_event): Promise<ReportSettings | null> => {
        const result = await getReportMetadata()
        return result
    });

    ipcMain.handle(routeName + '/updateReportMetadata', async (_event, newReportMetada: ReportSettings): Promise<ReportSettings | null> => {
        const result = await updateReportMetada(newReportMetada)
        return result
    });

    ipcMain.handle(routeName + '/getUserAnnualExtraHoursReport', async (_event, userID: number, year: string): Promise<any> => {
        const result = await getUserAnnualExtraHoursReport(userID, year);
        return result
    });
}
