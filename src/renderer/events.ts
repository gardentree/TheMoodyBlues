import {MiddlewareAPI} from "redux";
import * as actions from "@actions";
import {extractOriginalFrom} from "@libraries/tools";

const {facade} = window;

export function setup(store: MiddlewareAPI) {
  facade.events.onChangeMode((identifier, mode) => {
    store.dispatch(actions.changeMode({identifier, mode}));
  });
  facade.events.onCopyTweetInJSON((tweet: Twitter.Tweet) => {
    facade.actions.copy(JSON.stringify(tweet, null, "  "));
  });
  facade.events.onDialog((context: TMB.Dialog) => {
    store.dispatch(actions.openDialog(context));
  });
  facade.events.onFocusTweet((tweet: Twitter.Tweet) => {
    store.dispatch(actions.focusTweet(tweet));
  });
  facade.events.onFocusLatestTweet(() => {
    store.dispatch(actions.focusLatestTweet());
  });
  facade.events.onFocusUnreadTweet(() => {
    store.dispatch(actions.focusUnreadTweet());
  });
  facade.events.onForceReload(() => {
    store.dispatch(actions.reloadFocusedScreen(true));
  });
  facade.events.onOpenTweetInBrowser((tweet: Twitter.Tweet) => {
    const {user, id_str} = extractOriginalFrom(tweet);
    facade.actions.openExternal(`https://twitter.com/${user.screen_name}/status/${id_str}`);
  });
  facade.events.onRefreshPreferences(() => {
    store.dispatch(actions.reconfigure());
  });
  facade.events.onReload(() => {
    store.dispatch(actions.reloadFocusedScreen(false));
  });
  facade.events.onSearch((keyword: string) => {
    store.dispatch(actions.searchTweets(keyword));
  });
  facade.events.onShowChainForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(actions.displayConversation(extractOriginalFrom(tweet), {yourself: true}));
  });
  facade.events.onShowConversationForTweet((tweet: Twitter.Tweet) => {
    store.dispatch(actions.displayConversation(extractOriginalFrom(tweet)));
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
