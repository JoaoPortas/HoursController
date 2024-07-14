import { ipcMain } from "electron";

export function registHoursRoutes(routeName: string) {
    ipcMain.handle(routeName + '/create', async (_event): Promise<null> => {
        return null
    })
}
