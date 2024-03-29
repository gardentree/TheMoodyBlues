"use strict";

import {app, BrowserWindow, Menu} from "electron";
import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from "electron-devtools-installer";
import * as pathname from "path";
import logger from "@libraries/logger";
import {setup} from "./processing";
import {Actions as FacadeActions} from "@shared/facade";
import {environment} from "@shared/tools";
import windowKeeper from "electron-window-state";

logger.info(`start: ${process.env.NODE_ENV}`);

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then((name) => logger.info(name))
    .catch((error) => logger.error(error));

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

  if (environment.isDevelopment()) {
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

  return window;
}

// create main BrowserWindow when electron is ready
app.whenReady().then(() => {
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
            mainWindow!.webContents.send(FacadeActions.DIALOG, {type: "preferences"});
          },
        },
        {role: "quit"},
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

  if (environment.isDevelopment()) {
    template.push({
      label: "Tool",
      submenu: [
        {
          label: "Open DevTools",
          accelerator: "F12",
          click() {
            mainWindow!.webContents.openDevTools();
          },
        },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

function load(target: BrowserWindow, path: string) {
  if (environment.isDevelopment()) {
    target.loadURL(`http://localhost:8080/${path}`);
  } else {
    target.loadURL(`file://${__dirname}/${path}`);
  }
}
