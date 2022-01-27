const {facade} = window;

export function getAccessKey(): string {
  return facade.storage.getAccessKey();
}
export function setAccessKey(value: string) {
  facade.storage.setAccessKey(value);
}

export function getAccessSecret(): string {
  return facade.storage.getAccessSecret();
}
export function setAccessSecret(value: string) {
  facade.storage.setAccessSecret(value);
}

export function getMuteKeywords(): string[] {
  return facade.storage.getMuteKeywords();
}
export function setMuteKeywords(keywords: string[]) {
  facade.storage.setMuteKeywords(keywords);
}

export function getTweets(name: string) {
  return facade.storage.getTweets(name);
}
export function setTweets(name: string, tweets: Twitter.Tweet[]) {
  facade.storage.setTweets(name, tweets);
}
