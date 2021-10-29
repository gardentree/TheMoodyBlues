import {ipcRenderer, IpcRendererEvent, shell, clipboard} from "electron";
import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset} from "@modules/principal";
import {reload, searchTweets, refreshPreferences} from "@modules/timelines";
import {displayConversation} from "@modules/subcontents";

export default function (store: any) {
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

  ipcRenderer.on("open_tweet_in_browser", (event: IpcRendererEvent, context: TheMoodyBlues.TweetMenu) => {
    const {tweet} = context;

    shell.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  ipcRenderer.on("show_conversation_for_tweet", (event: IpcRendererEvent, context: TheMoodyBlues.TweetMenu) => {
    const origin = context.tweet.retweeted_status === undefined ? context.tweet : context.tweet.retweeted_status!;

    store.dispatch(displayConversation(origin));
  });

  ipcRenderer.on("search", (event: IpcRendererEvent, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(searchTweets(context.keyword));
  });
  ipcRenderer.on("copy_tweet_in_json", (event: IpcRendererEvent, context: TheMoodyBlues.TweetMenu) => {
    clipboard.writeText(JSON.stringify(context.tweet, null, "  "));
  });

  ipcRenderer.on("refresh_preferences", (event: IpcRendererEvent, arugments: any) => {
    store.dispatch(refreshPreferences());
  });
}
