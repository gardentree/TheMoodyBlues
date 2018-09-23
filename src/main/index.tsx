'use strict'

import { app, BrowserWindow,Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'production'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow|null

function createMainWindow() {
  const windowKeeper = require('electron-window-state');
  const windowState = windowKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  const window = new BrowserWindow({
    title:  "The Moody Blues",
    acceptFirstMouse: true,
    titleBarStyle: 'hidden',
    x:      windowState.x,
    y:      windowState.y,
    width:  windowState.width,
    height: windowState.height,
  })
  windowState.manage(window);

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()

  const template = [
    {
      label: app.getName(),
      submenu: [
        {role: 'about'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+r',
          click() {
            mainWindow!.webContents.send('reload',{});
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'Shift+Command+r',
          click() {
            mainWindow!.webContents.send('force_reload',{});
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'Command+Plus',
          click() {
            mainWindow!.webContents.send('zoom_in',{});
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'Command+-',
          click() {
            mainWindow!.webContents.send('zoom_out',{});
          }
        },
        {
          label: 'Zoom Reset',
          accelerator: 'Command+0',
          click() {
            mainWindow!.webContents.send('zoom_reset',{});
          }
        },
      ]
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
