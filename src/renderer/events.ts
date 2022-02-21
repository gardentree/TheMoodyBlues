import {MiddlewareAPI} from "redux";
import * as actions from "@actions";

const {facade} = window;

export function setup(store: MiddlewareAPI) {
  facade.events.onChangeMode((identity, mode) => {
    store.dispatch(actions.changeMode(identity, mode));
  });
  facade.events.onCopyTweetInJSON((tweet: Twitter.Tweet) => {
    facade.actions.copy(JSON.stringify(tweet, null, "  "));
  });
  facade.events.onFocusLatestTweet(() => {
    store.dispatch(actions.focusLatestTweet());
  });
  facade.events.onFocusUnreadTweet(() => {
    store.dispatch(actions.focusUnreadTweet());
  });
  facade.events.onForceReload(() => {
    store.dispatch(actions.reload(true, null));
  });
  facade.events.onOpenTweetInBrowser((tweet: Twitter.Tweet) => {
    facade.actions.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  facade.events.onRefreshPreferences(() => {
    store.dispatch(actions.reconfigure());
  });
  facade.events.onReload(() => {
    store.dispatch(actions.reload(false, null));
  });
  facade.events.onSearch((keyword: string) => {
    store.dispatch(actions.searchTweets(keyword));
  });
  facade.events.onShowChainForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(actions.displayConversation(tweet, {yourself: true}));
  });
  facade.events.onShowConversationForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(actions.displayConversation(tweet));
  });
  facade.events.onZoomIn(() => {
    store.dispatch(actions.zoomIn());
  });
  facade.events.onZoomOut(() => {
    store.dispatch(actions.zoomOut());
  });
  facade.events.onZoomReset(() => {
    store.dispatch(actions.zoomReset());
  });
}
