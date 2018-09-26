import {ipcRenderer} from "electron";
import * as contents from "../modules/contents";
import * as style from "../modules/style";

export default function(store: any) {
  ipcRenderer.on("zoom_in", (event: string, arugments: any) => {
    store.dispatch(style.zoomIn());
  });
  ipcRenderer.on("zoom_out", (event: string, arugments: any) => {
    store.dispatch(style.zoomOut());
  });
  ipcRenderer.on("zoom_reset", (event: string, arugments: any) => {
    store.dispatch(style.zoomReset());
  });
  ipcRenderer.on("reload", (event: string, arugments: any) => {
    store.dispatch(contents.reload(false, null));
  });
  ipcRenderer.on("force_reload", (event: string, arugments: any) => {
    store.dispatch(contents.reload(true, null));
  });
}
