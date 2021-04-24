const path = require('path')
const { app, BrowserWindow } = require('electron')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

function createMainWindow() {
    const windowOptions = {
        width: 1280,
        minWidth: 1280 / 3,
        height: 720,
        minHeight: 720 / 2,
        show: false,
        center: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: app.name,
    }
    return createWindow(MAIN_WINDOW_ID, windowOptions)
}

function createSplashWindow() {
    const windowOptions = {
        width: 400,
        height: 200,
        resizable: false,
        autoHideMenuBar: true,
        frame: false,
        show: true,
        center: true,
        title: app.name,
    }

    const window = defineWindow('splash', windowOptions)

    if (IS_DEVELOPMENT) {
        window.loadURL('http://localhost:3000/splash.html').then()
    } else {
        window.loadURL(`file://${path.join(__dirname, '/splash.html')}`).then()
    }

    return window
}

process.on('uncaughtException', (err) => {
    console.error(err)
    closeAllWindows()
})

app.requestSingleInstanceLock()

app.on('second-instance', () => {
    const window = getWindow(MAIN_WINDOW_ID)
    if (window) {
        if (window.isMinimized()) {
            window.restore()
        }
        window.focus()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    const window = getWindow(MAIN_WINDOW_ID)
    if (window === null) {
        createMainWindow()
    }
})

app.on('ready', () => {
    const splashWindow = createSplashWindow()
    const mainWindow = createMainWindow()

    mainWindow.once('ready-to-show', () => {
        splashWindow.close()
        mainWindow.show()
    })
})
