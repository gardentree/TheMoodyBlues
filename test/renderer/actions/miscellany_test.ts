import {prepareState, reconfigure} from "@actions/miscellany";
import {reload, reloadFocusedScreen, mountScreen, unmountScreen, searchTweets} from "@actions/miscellany";
import {displayUserTimeline, displayConversation} from "@actions/miscellany";
import {focusTweet, focusLatestTweet, focusUnreadTweet, alarm} from "@actions/miscellany";
import {faker} from "@faker-js/faker";
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
    it("as usual", () => {
      expect(reconfigure()).toEqual({
        type: "reconfigure",
        payload: undefined,
      });
    });
  });

  describe(reload.toString(), () => {
    it("as usual", () => {
      const identity = faker.datatype.uuid();

      expect(reload(identity, true)).toEqual({
        type: "reload",
        payload: {
          identity,
        },
        meta: {
          force: true,
          silently: false,
        },
      });
    });
    it("when silently", () => {
      const identity = faker.datatype.uuid();

      expect(reload(identity, true, true)).toEqual({
        type: "reload",
        payload: {
          identity,
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
      const identity = faker.datatype.uuid();

      expect(mountScreen(identity)).toEqual({
        type: "mountScreen",
        payload: {
          identity,
        },
      });
    });
  });
  describe(unmountScreen.toString(), () => {
    it("as usual", () => {
      const identity = faker.datatype.uuid();

      expect(unmountScreen(identity)).toEqual({
        type: "unmountScreen",
        payload: {identity},
      });
    });
  });
  describe(searchTweets.toString(), () => {
    it("as usual", () => {
      expect(searchTweets("くえりー")).toEqual({
        type: "searchTweets",
        payload: {
          identity: "search",
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
      const tweet = builders.buildTweet();

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
      const tweet = builders.buildTweet();

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
      const tweet = builders.buildTweet();

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
