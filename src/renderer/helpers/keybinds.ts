import {ipcRenderer, IpcRendererEvent} from "electron";
import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset, reload} from "../modules/home";

export default function(store: any) {
  ipcRenderer.on("focus_latest_tweet", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(focusLatestTweet());
  });
  ipcRenderer.on("focus_unread_tweet", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(focusUnreadTweet());
  });

  ipcRenderer.on("zoom_in", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(zoomIn());
  });
  ipcRenderer.on("zoom_out", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(zoomOut());
  });
  ipcRenderer.on("zoom_reset", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(zoomReset());
  });
  ipcRenderer.on("reload", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(reload(false, null));
  });
  ipcRenderer.on("force_reload", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(reload(true, null));
  });
}
