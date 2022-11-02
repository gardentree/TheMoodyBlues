import {prepareState, reconfigure} from "@actions/miscellany";
import {reload, reloadFocusedScreen, mountScreen, unmountScreen, searchTweets} from "@actions/miscellany";
import {displayUserTimeline, displayConversation} from "@actions/miscellany";
import {focusTweet, focusLatestTweet, focusUnreadTweet, alarm} from "@actions/miscellany";
import {faker} from "@faker-js/faker";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe("@renderer/actions/miscellany", () => {
  describe(prepareState.toString(), () => {
    it("as usual", () => {
      expect(prepareState()).toEqual({
        type: "prepareState",
        payload: undefined,
      });
    });
  });
  describe(reconfigure.toString(), () => {
    const backstages = adapters.preferences.addMany(adapters.preferences.getInitialState(), [builders.preference.buildScreen()]);

    it("as usual", () => {
      expect(reconfigure(backstages)).toEqual({
        type: "reconfigure",
        payload: {backstages},
      });
    });
  });

  describe(reload.toString(), () => {
    it("as usual", () => {
      const identifier = faker.datatype.uuid();

      expect(reload(identifier, true)).toEqual({
        type: "reload",
        payload: {
          identifier,
        },
        meta: {
          force: true,
          silently: false,
        },
      });
    });
    it("when silently", () => {
      const identifier = faker.datatype.uuid();

      expect(reload(identifier, true, true)).toEqual({
        type: "reload",
        payload: {
          identifier,
        },
        meta: {
          force: true,
          silently: true,
        },
      });
    });
  });
  describe(reloadFocusedScreen.toString(), () => {
    it("when force is true", () => {
      expect(reloadFocusedScreen(true)).toEqual({
        type: "reloadFocusedScreen",
        payload: undefined,
        meta: {
          force: true,
          silently: false,
        },
      });
    });
    it("when force is false", () => {
      expect(reloadFocusedScreen(false)).toEqual({
        type: "reloadFocusedScreen",
        payload: undefined,
        meta: {
          force: false,
          silently: false,
        },
      });
    });
  });
  describe(mountScreen.toString(), () => {
    it("as usual", () => {
      const identifier = faker.datatype.uuid();

      expect(mountScreen(identifier)).toEqual({
        type: "mountScreen",
        payload: {
          identifier,
        },
      });
    });
  });
  describe(unmountScreen.toString(), () => {
    it("as usual", () => {
      const identifier = faker.datatype.uuid();

      expect(unmountScreen(identifier)).toEqual({
        type: "unmountScreen",
        payload: {identifier},
      });
    });
  });
  describe(searchTweets.toString(), () => {
    it("as usual", () => {
      expect(searchTweets("くえりー")).toEqual({
        type: "searchTweets",
        payload: {
          identifier: "search",
          query: "くえりー",
        },
      });
    });
  });

  describe(displayUserTimeline.toString(), () => {
    it("as usual", () => {
      const name = faker.animal.cat();

      expect(displayUserTimeline(name)).toEqual({
        type: "displayUserTimeline",
        payload: {name},
      });
    });
  });
  describe(displayConversation.toString(), () => {
    it("as usual", () => {
      const tweet = builders.twitter.buildTweet();

      expect(displayConversation(tweet)).toEqual({
        type: "displayConversation",
        payload: {
          tweet: tweet,
        },
        meta: {
          options: undefined,
        },
      });
    });
    it("when specify options", () => {
      const tweet = builders.twitter.buildTweet();

      expect(displayConversation(tweet, {yourself: true})).toEqual({
        type: "displayConversation",
        payload: {
          tweet: tweet,
        },
        meta: {
          options: {yourself: true},
        },
      });
    });
  });

  describe(focusTweet.toString(), () => {
    it("as usual", () => {
      const tweet = builders.twitter.buildTweet();

      expect(focusTweet(tweet)).toEqual({
        type: "focusTweet",
        payload: {tweet},
      });
    });
  });
  describe(focusLatestTweet.toString(), () => {
    it("as usual", () => {
      expect(focusLatestTweet()).toEqual({
        type: "focusLatestTweet",
        payload: undefined,
      });
    });
  });
  describe(focusUnreadTweet.toString(), () => {
    it("as usual", () => {
      expect(focusUnreadTweet()).toEqual({
        type: "focusUnreadTweet",
        payload: undefined,
      });
    });
  });
  describe(alarm.toString(), () => {
    it("when message is string", () => {
      expect(alarm("えらー")).toEqual({
        type: "alarm",
        payload: {message: "えらー"},
      });
    });
    it("when message is error", () => {
      const error = new Error("えらー");
      expect(alarm("えらー")).toEqual({
        type: "alarm",
        payload: {message: "えらー"},
      });
    });
  });
});
