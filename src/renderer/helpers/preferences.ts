const ElectronStore = require("electron-store");
const store = new ElectronStore();

export function getMuteKeywords(): string[] {
  return store.get("mute.keywords") || [];
}
export function setMuteKeywords(keywords: string[]) {
  store.set("mute.keywords", keywords);
}
