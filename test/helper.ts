import {JSDOM} from "jsdom";
import rewire = require("rewire");

const dom = new JSDOM("<!DOCTYPE html><p>Hello world</p>");
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

global.window.TheMoodyBlues = {
  storage: {
    getAccessKey: () => {},
    setAccessKey: (value: string) => {},
    getAccessSecret: () => {},
    setAccessSecret: (value: string) => {},
    getMuteKeywords: () => {
      return [];
    },
    setMuteKeywords: (keywords: string[]) => {},
    getTweets: (name: string) => {
      return [];
    },
    setTweets: (name: string, tweets: Twitter.Tweet[]) => {},
  },
  authorize: () => {},
  keybinds: () => {},
  growl: () => {},
  openTweetMenu: () => {},
  openExternal: () => {},
  logger: () => {},
};

global.rewires = (file: string, functions: string[]) => {
  const rewirer = rewire(`../src/${file}`);

  return functions.map((name) => {
    return rewirer.__get__(name);
  });
};
