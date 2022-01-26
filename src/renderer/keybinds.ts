import {focusLatestTweet, focusUnreadTweet, zoomIn, zoomOut, zoomReset} from "@modules/principal";
import {reload, searchTweets, refreshPreferences} from "@modules/timelines";
import {displayConversation} from "@modules/subcontents";

const {TheMoodyBlues} = window;

export default function (store: any) {
  TheMoodyBlues.ipc.observe("focus_latest_tweet", (event: Event, ...values: any[]) => {
    store.dispatch(focusLatestTweet());
  });
  TheMoodyBlues.ipc.observe("focus_unread_tweet", (event: Event, ...values: any[]) => {
    store.dispatch(focusUnreadTweet());
  });

  TheMoodyBlues.ipc.observe("zoom_in", (event: Event, ...values: any[]) => {
    store.dispatch(zoomIn());
  });
  TheMoodyBlues.ipc.observe("zoom_out", (event: Event, ...values: any[]) => {
    store.dispatch(zoomOut());
  });
  TheMoodyBlues.ipc.observe("zoom_reset", (event: Event, ...values: any[]) => {
    store.dispatch(zoomReset());
  });
  TheMoodyBlues.ipc.observe("reload", (event: Event, ...values: any[]) => {
    store.dispatch(reload(false, null));
  });
  TheMoodyBlues.ipc.observe("force_reload", (event: Event, ...values: any[]) => {
    store.dispatch(reload(true, null));
  });

  TheMoodyBlues.ipc.observe("open_tweet_in_browser", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    const {tweet} = context;

    TheMoodyBlues.extra.openExternal(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  });
  TheMoodyBlues.ipc.observe("show_conversation_for_tweet", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(displayConversation(context.tweet));
  });
  TheMoodyBlues.ipc.observe("show_chain_for_tweet", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(displayConversation(context.tweet, {yourself: true}));
  });

  TheMoodyBlues.ipc.observe("search", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    store.dispatch(searchTweets(context.keyword));
  });
  TheMoodyBlues.ipc.observe("copy_tweet_in_json", (event: Event, context: TheMoodyBlues.TweetMenu) => {
    TheMoodyBlues.extra.copy(JSON.stringify(context.tweet, null, "  "));
  });

  TheMoodyBlues.ipc.observe("refresh_preferences", (event: Event, ...values: any[]) => {
    store.dispatch(refreshPreferences());
  });
}
