const {TheMoodyBlues} = window;

export function getAccessKey(): string {
  return TheMoodyBlues.storage.getAccessKey();
}
export function setAccessKey(value: string) {
  TheMoodyBlues.storage.setAccessKey(value);
}

export function getAccessSecret(): string {
  return TheMoodyBlues.storage.getAccessSecret();
}
export function setAccessSecret(value: string) {
  TheMoodyBlues.storage.setAccessSecret(value);
}

export function getMuteKeywords(): string[] {
  return TheMoodyBlues.storage.getMuteKeywords();
}
export function setMuteKeywords(keywords: string[]) {
  TheMoodyBlues.storage.setMuteKeywords(keywords);
}

export function getTweets(name: string) {
  return TheMoodyBlues.storage.getTweets(name);
}
export function setTweets(name: string, tweets: TweetType[]) {
  TheMoodyBlues.storage.setTweets(name, tweets);
}
