import {BrowserWindow, Menu, ipcMain} from "electron";
import {Actions as FacadeActions} from "@shared/facade";

export function setup() {
  ipcMain.on(FacadeActions.SHOW_MODE_MENU, (event, {identity, mode}) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)!;

    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: `${mode == "tweet" ? "✔" : "　"}ツイート`,
        click() {
          mainWindow.webContents.send(FacadeActions.CHANGE_MODE, {identity: identity, mode: "tweet"});
        },
      },
      {
        label: `${mode == "media" ? "✔" : "　"}メディア`,
        click() {
          mainWindow.webContents.send(FacadeActions.CHANGE_MODE, {identity: identity, mode: "media"});
        },
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    menu.popup({window: mainWindow});
  });
}
