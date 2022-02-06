import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset} from "@modules/principal";
import {reload, searchTweets, refreshPreferences} from "@modules/timelines";
import {displayConversation} from "@modules/subcontents";
import * as library from "@libraries/timeline";
import {MiddlewareAPI} from "redux";

const {facade} = window;

export default function (store: MiddlewareAPI) {
  facade.ipc.observe("focus_latest_tweet", (event, ...values) => {
    store.dispatch(focusLatestTweet());
  });
  facade.ipc.observe("focus_unread_tweet", (event, ...values) => {
    store.dispatch(focusUnreadTweet());
  });

  facade.ipc.observe("zoom_in", (event, ...values) => {
    store.dispatch(zoomIn());
  });
  facade.ipc.observe("zoom_out", (event, ...values) => {
    store.dispatch(zoomOut());
  });
  facade.ipc.observe("zoom_reset", (event, ...values) => {
    store.dispatch(zoomReset());
  });
  facade.ipc.observe("reload", (event, ...values) => {
    store.dispatch(reload(false, null));
  });
  facade.ipc.observe("force_reload", (event, ...values) => {
    store.dispatch(reload(true, null));
  });

  facade.ipc.observe("open_tweet_in_browser", (event, context: TweetMenu) => {
    const {tweet} = context;

    facade.extra.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  facade.ipc.observe("show_conversation_for_tweet", (event, context: TweetMenu) => {
    store.dispatch(displayConversation(context.tweet));
  });
  facade.ipc.observe("show_chain_for_tweet", (event, context: TweetMenu) => {
    store.dispatch(displayConversation(context.tweet, {yourself: true}));
  });

  facade.ipc.observe("search", (event, context: TweetMenu) => {
    store.dispatch(searchTweets(context.keyword));
  });
  facade.ipc.observe("copy_tweet_in_json", (event, context: TweetMenu) => {
    facade.extra.copy(JSON.stringify(context.tweet, null, "  "));
  });

  facade.ipc.observe("refresh_preferences", (event, ...values) => {
    (async () => {
      const preferences = await library.refreshPreferences(store.getState().timelines);

      store.dispatch(refreshPreferences(preferences));
    })();
  });
}
