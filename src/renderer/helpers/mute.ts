import * as twitter from '../others/twitter';

const ElectronStore = require('electron-store');
const mutes: string[] = new ElectronStore().get('mutes')||[];

export default function mute(tweets: twitter.Tweet[]): twitter.Tweet[] {
  return tweets.filter((tweet) => {
    if (!mutes.every(mute => tweet.full_text.toLowerCase().indexOf(mute) < 0)) return false;
    if (!mutes.every(mute => tweet.entities.urls.every(entity => entity.display_url.indexOf(mute) < 0))) return false;

    return true;
  });
}
