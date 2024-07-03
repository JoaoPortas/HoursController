import { app, BrowserWindow } from 'electron'

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 200
    })

    //win.loadFile('./public/index.html')
    win.loadURL('http://localhost:3000')
}

app.whenReady().then(() => {
    createWindow()
})