import {expect} from "chai";
import {prepareState, reconfigure} from "@actions/miscellany";
import {reload, reloadFocusedScreen, mountScreen, unmountScreen, searchTweets} from "@actions/miscellany";
import {displayUserTimeline, displayConversation} from "@actions/miscellany";
import {focusTweet, focusLatestTweet, focusUnreadTweet, alarm} from "@actions/miscellany";
import {faker} from "@faker-js/faker";
import {builders} from "@test/helper";

describe("@renderer/actions/miscellany", () => {
  describe(prepareState.toString(), () => {
    it("as usual", () => {
      expect(prepareState()).to.deep.equal({
        type: "prepareState",
        payload: undefined,
      });
    });
  });
  describe(reconfigure.toString(), () => {
    it("as usual", () => {
      expect(reconfigure()).to.deep.equal({
        type: "reconfigure",
        payload: undefined,
      });
    });
  });

  describe(reload.toString(), () => {
    it("as usual", () => {
      const identity = faker.datatype.uuid();

      expect(reload(identity, true)).to.deep.equal({
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

      expect(reload(identity, true, true)).to.deep.equal({
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
      expect(reloadFocusedScreen(true)).to.deep.equal({
        type: "reloadFocusedScreen",
        payload: undefined,
        meta: {
          force: true,
          silently: false,
        },
      });
    });
    it("when force is false", () => {
      expect(reloadFocusedScreen(false)).to.deep.equal({
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

      expect(mountScreen(identity)).to.deep.equal({
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

      expect(unmountScreen(identity)).to.deep.equal({
        type: "unmountScreen",
        payload: {identity},
      });
    });
  });
  describe(searchTweets.toString(), () => {
    it("as usual", () => {
      expect(searchTweets("くえりー")).to.deep.equal({
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

      expect(displayUserTimeline(name)).to.deep.equal({
        type: "displayUserTimeline",
        payload: {name},
      });
    });
  });
  describe(displayConversation.toString(), () => {
    it("as usual", () => {
      const tweet = builders.buildTweet();

      expect(displayConversation(tweet)).to.deep.equal({
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

      expect(displayConversation(tweet, {yourself: true})).to.deep.equal({
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

      expect(focusTweet(tweet)).to.deep.equal({
        type: "focusTweet",
        payload: {tweet},
      });
    });
  });
  describe(focusLatestTweet.toString(), () => {
    it("as usual", () => {
      expect(focusLatestTweet()).to.deep.equal({
        type: "focusLatestTweet",
        payload: undefined,
      });
    });
  });
  describe(focusUnreadTweet.toString(), () => {
    it("as usual", () => {
      expect(focusUnreadTweet()).to.deep.equal({
        type: "focusUnreadTweet",
        payload: undefined,
      });
    });
  });
  describe(alarm.toString(), () => {
    it("when message is string", () => {
      expect(alarm("えらー")).to.deep.equal({
        type: "alarm",
        payload: {message: "えらー"},
      });
    });
    it("when message is error", () => {
      const error = new Error("えらー");
      expect(alarm("えらー")).to.deep.equal({
        type: "alarm",
        payload: {message: "えらー"},
      });
    });
  });
});
