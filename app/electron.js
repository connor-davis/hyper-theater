const path = require('path')
const { app, BrowserWindow } = require('electron')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

let window, splashWindow

function createMainWindow() {
    window = new BrowserWindow({
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
    })

    if (IS_DEVELOPMENT) {
        window.loadURL('http://localhost:3000')
    } else {
        window.loadURL(`file://${path.join(__dirname, '/index.html')}`)
    }
}

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 200,
        resizable: false,
        autoHideMenuBar: true,
        frame: false,
        show: true,
        center: true,
        title: app.name,
    })

    if (IS_DEVELOPMENT) {
        splashWindow.loadURL('http://localhost:3000/splash.html')
    } else {
        splashWindow.loadURL(`file://${path.join(__dirname, '/splash.html')}`)
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (window === null) {
        createSplashWindow()
        createMainWindow()
    }
})

app.on('ready', () => {
    createSplashWindow()
    createMainWindow()

    window.once('ready-to-show', () => {
        splashWindow.close()
        window.show()
    })
})
