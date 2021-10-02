"use strict";

import {app, BrowserWindow, Menu} from "electron";
import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";

require("electron-log").info(`start: ${process.env.NODE_ENV}`);

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then((name) => console.log(name))
    .catch((err) => console.log(err));

  const windowKeeper = require("electron-window-state");
  const windowState = windowKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  const window = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    title: "The Moody Blues",
    acceptFirstMouse: true,
    titleBarStyle: "hidden",
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  });
  windowState.manage(window);

  if (isDevelopment) {
    window.webContents.once("dom-ready", () => {
      window.webContents.openDevTools();
    });
  }

  load(window);

  window.on("closed", () => {
    app.quit();
  });

  window.webContents.on("did-frame-finish-load", () => {
    window.webContents.on("devtools-opened", () => {
      window.focus();
      setImmediate(() => {
        window.focus();
      });
    });
  });

  return window;
}

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();

  // prettier-ignore
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        {role: "about"},
        {
          label: "Preferences...",
          accelerator: "Command+,",
          click() {
            openPreferences();
          },
        },
        {role: 'quit'},
      ],
    },
    {
      label: "Edit",
      submenu: [
        {role: "copy"},
        {role: "paste"},
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Focus Latest Tweet",
          accelerator: "0",
          click() {
            mainWindow!.webContents.send("focus_latest_tweet", {});
          },
        },
        {
          label: "Focus Unread Tweet",
          accelerator: "9",
          click() {
            mainWindow!.webContents.send("focus_unread_tweet", {});
          },
        },
        {
          label: "Reload",
          accelerator: "Command+r",
          click() {
            mainWindow!.webContents.send("reload", {});
          },
        },
        {
          label: "Force Reload",
          accelerator: "Shift+Command+r",
          click() {
            mainWindow!.webContents.send("force_reload", {});
          },
        },
        {
          label: "Zoom In",
          accelerator: "Command+Plus",
          click() {
            mainWindow!.webContents.send("zoom_in", {});
          },
        },
        {
          label: "Zoom Out",
          accelerator: "Command+-",
          click() {
            mainWindow!.webContents.send("zoom_out", {});
          },
        },
        {
          label: "Zoom Reset",
          accelerator: "Command+0",
          click() {
            mainWindow!.webContents.send("zoom_reset", {});
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

let preferences: BrowserWindow | null;
function openPreferences() {
  if (preferences) {
    preferences.focus();
    return;
  }

  preferences = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    title: "Preferences",
    titleBarStyle: "hidden",
    width: 640,
    height: 480,
  });

  load(preferences, "?preferences");
  if (isDevelopment) {
    preferences.webContents.openDevTools();
  }

  preferences.on("closed", () => {
    preferences = null;
  });
}

function load(target: BrowserWindow, query = "") {
  if (isDevelopment) {
    target.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}${query}`);
  } else {
    target.loadURL(`file://${__dirname}/index.html${query}`);
  }
}
