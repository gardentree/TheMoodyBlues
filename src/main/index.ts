"use strict";

import {app, BrowserWindow, Menu, ipcMain} from "electron";
import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from "electron-devtools-installer";
import * as pathname from "path";
import logger from "electron-log";
import {setup} from "./twitter";
import {Actions as FacadeActions} from "@shared/facade";
import {setup as setupEvents} from "./events";

const isDevelopment = process.env.NODE_ENV !== "production";

logger.info(`start: ${process.env.NODE_ENV}`);

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then((name) => logger.info(name))
    .catch((error) => logger.error(error));

  const windowKeeper = require("electron-window-state");
  const windowState = windowKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  const window = new BrowserWindow({
    webPreferences: {
      preload: pathname.join(__dirname, "preload.js"),
      spellcheck: false,
    },
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
  setup(window.webContents);

  load(window, "index.html");

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

  setupEvents();

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
            mainWindow!.webContents.send(FacadeActions.FOCUS_LATEST_TWEET, {});
          },
        },
        {
          label: "Focus Unread Tweet",
          accelerator: "9",
          click() {
            mainWindow!.webContents.send(FacadeActions.FOCUS_UNREAD_TWEET, {});
          },
        },
        {
          label: "Reload",
          accelerator: "Command+r",
          click() {
            mainWindow!.webContents.send(FacadeActions.RELOAD, {});
          },
        },
        {
          label: "Force Reload",
          accelerator: "Shift+Command+r",
          click() {
            mainWindow!.webContents.send(FacadeActions.FORCE_RELOAD, {});
          },
        },
        {
          label: "Zoom In",
          accelerator: "Command+Plus",
          click() {
            mainWindow!.webContents.send(FacadeActions.ZOOM_IN, {});
          },
        },
        {
          label: "Zoom Out",
          accelerator: "Command+-",
          click() {
            mainWindow!.webContents.send(FacadeActions.ZOOM_OUT, {});
          },
        },
        {
          label: "Zoom Reset",
          accelerator: "Command+0",
          click() {
            mainWindow!.webContents.send(FacadeActions.ZOOM_RESET, {});
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
    webPreferences: {
      preload: pathname.join(__dirname, "preload.js"),

      spellcheck: false,
    },
    title: "Preferences",
    titleBarStyle: "hidden",
    width: 640,
    height: 480,
  });

  load(preferences, "preferences.html");
  if (isDevelopment) {
    preferences.webContents.openDevTools();
  }

  preferences.on("closed", () => {
    mainWindow!.webContents.send(FacadeActions.REFRESH_PREFERENCES, {});

    preferences = null;
  });
}

function load(target: BrowserWindow, path: string) {
  if (isDevelopment) {
    target.loadURL(`http://localhost:8080/${path}`);
  } else {
    target.loadURL(`file://${__dirname}/${path}`);
  }
}

ipcMain.on(FacadeActions.OPEN_TWEET_MENU, (event, context: TMB.TweetMenu) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender)!;

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "ブラウザで開く",
      click() {
        mainWindow.webContents.send(FacadeActions.OPEN_TWEET_IN_BROWSER, context);
      },
    },
    {
      label: "会話を表示",
      click() {
        mainWindow.webContents.send(FacadeActions.SHOW_CONVERSATION_FOR_TWEET, context);
      },
    },
    {
      label: "つながりを表示",
      click() {
        mainWindow.webContents.send(FacadeActions.SHOW_CHAIN_FOR_TWEET, context);
      },
    },
  ];

  if (context.keyword.length > 0) {
    template.push({
      label: `"${context.keyword}"を検索`,
      click() {
        mainWindow.webContents.send(FacadeActions.SEARCH, context);
      },
    });
  }

  if (isDevelopment) {
    template.push({
      label: "JSON形式でコピー",
      click() {
        mainWindow.webContents.send(FacadeActions.COPY_TWEET_IN_JSON, context);
      },
    });
  }

  const menu = Menu.buildFromTemplate(template);
  menu.popup({window: mainWindow});
});
