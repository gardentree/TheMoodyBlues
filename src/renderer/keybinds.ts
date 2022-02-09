import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset} from "@modules/principal";
import {reload, searchTweets, refreshPreferences} from "@modules/timelines";
import {displayConversation} from "@modules/subcontents";
import * as library from "@libraries/timeline";
import {MiddlewareAPI} from "redux";

const {facade} = window;

export default function (store: MiddlewareAPI) {
  facade.ipc.onFocusLatestTweet(() => {
    store.dispatch(focusLatestTweet());
  });
  facade.ipc.onFocusUnreadTweet(() => {
    store.dispatch(focusUnreadTweet());
  });

  facade.ipc.onZoomIn(() => {
    store.dispatch(zoomIn());
  });
  facade.ipc.onZoomOut(() => {
    store.dispatch(zoomOut());
  });
  facade.ipc.onZoomReset(() => {
    store.dispatch(zoomReset());
  });
  facade.ipc.onReload(() => {
    store.dispatch(reload(false, null));
  });
  facade.ipc.onForceReload(() => {
    store.dispatch(reload(true, null));
  });

  facade.ipc.onOpenTweetInBrowser((tweet: Twitter.Tweet) => {
    facade.extra.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  facade.ipc.onShowConversationForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(displayConversation(tweet));
  });
  facade.ipc.onShowChainForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(displayConversation(tweet, {yourself: true}));
  });

  facade.ipc.onSearch((keyword: string) => {
    store.dispatch(searchTweets(keyword));
  });
  facade.ipc.onCopyTweetInJSON((tweet: Twitter.Tweet) => {
    facade.extra.copy(JSON.stringify(tweet, null, "  "));
  });

  facade.ipc.onRefreshPreferences(() => {
    (async () => {
      const preferences = await library.refreshPreferences(store.getState().timelines);

      store.dispatch(refreshPreferences(preferences));
    })();
  });
}
