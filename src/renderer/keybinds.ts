import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset} from "@modules/principal";
import {reload, searchTweets, refreshPreferences} from "@modules/timelines";
import {displayConversation} from "@modules/subcontents";

const {facade} = window;

export default function (store: any) {
  facade.ipc.observe("focus_latest_tweet", (event: Event, ...values: any[]) => {
    store.dispatch(focusLatestTweet());
  });
  facade.ipc.observe("focus_unread_tweet", (event: Event, ...values: any[]) => {
    store.dispatch(focusUnreadTweet());
  });

  facade.ipc.observe("zoom_in", (event: Event, ...values: any[]) => {
    store.dispatch(zoomIn());
  });
  facade.ipc.observe("zoom_out", (event: Event, ...values: any[]) => {
    store.dispatch(zoomOut());
  });
  facade.ipc.observe("zoom_reset", (event: Event, ...values: any[]) => {
    store.dispatch(zoomReset());
  });
  facade.ipc.observe("reload", (event: Event, ...values: any[]) => {
    store.dispatch(reload(false, null));
  });
  facade.ipc.observe("force_reload", (event: Event, ...values: any[]) => {
    store.dispatch(reload(true, null));
  });

  facade.ipc.observe("open_tweet_in_browser", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    const {tweet} = context;

    facade.extra.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  facade.ipc.observe("show_conversation_for_tweet", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(displayConversation(context.tweet));
  });
  facade.ipc.observe("show_chain_for_tweet", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(displayConversation(context.tweet, {yourself: true}));
  });

  facade.ipc.observe("search", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(searchTweets(context.keyword));
  });
  facade.ipc.observe("copy_tweet_in_json", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    facade.extra.copy(JSON.stringify(context.tweet, null, "  "));
  });

  facade.ipc.observe("refresh_preferences", (event: Event, ...values: any[]) => {
    store.dispatch(refreshPreferences());
  });
}
