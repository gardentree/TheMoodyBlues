import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset} from "@modules/principal";
import {reload, searchTweets} from "@modules/timelines";
import {reconfigure} from "@modules/index";
import {displayConversation} from "@modules/subcontents";
import {MiddlewareAPI} from "redux";

const {facade} = window;

export default function (store: MiddlewareAPI) {
  facade.events.onFocusLatestTweet(() => {
    store.dispatch(focusLatestTweet());
  });
  facade.events.onFocusUnreadTweet(() => {
    store.dispatch(focusUnreadTweet());
  });

  facade.events.onZoomIn(() => {
    store.dispatch(zoomIn());
  });
  facade.events.onZoomOut(() => {
    store.dispatch(zoomOut());
  });
  facade.events.onZoomReset(() => {
    store.dispatch(zoomReset());
  });
  facade.events.onReload(() => {
    store.dispatch(reload(false, null));
  });
  facade.events.onForceReload(() => {
    store.dispatch(reload(true, null));
  });

  facade.events.onOpenTweetInBrowser((tweet: Twitter.Tweet) => {
    facade.actions.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  facade.events.onShowConversationForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(displayConversation(tweet));
  });
  facade.events.onShowChainForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(displayConversation(tweet, {yourself: true}));
  });

  facade.events.onSearch((keyword: string) => {
    store.dispatch(searchTweets(keyword));
  });
  facade.events.onCopyTweetInJSON((tweet: Twitter.Tweet) => {
    facade.actions.copy(JSON.stringify(tweet, null, "  "));
  });

  facade.events.onRefreshPreferences(() => {
    store.dispatch(reconfigure());
  });
}
