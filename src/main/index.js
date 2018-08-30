'use strict'

import { app, BrowserWindow,Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'production'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({title: "The Moody Blues"})

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

  window.on('close', () => {
    window.webContents.send('closed',null);
  })
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
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
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
      label: 'Timeline',
      submenu: [
        {
          label: 'reload',
          accelerator: 'Command+r',
          click() {
            mainWindow.webContents.send('reload',{});
          }
        },
        {
          label: 'zoom in',
          accelerator: 'Command+Plus',
          click() {
            mainWindow.webContents.send('zoom in',{});
          }
        },
        {
          label: 'zoom out',
          accelerator: 'Command+-',
          click() {
            mainWindow.webContents.send('zoom out',{});
          }
        },
        {
          label: 'zoom reset',
          accelerator: 'Command+0',
          click() {
            mainWindow.webContents.send('zoom reset',{});
          }
        },
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
