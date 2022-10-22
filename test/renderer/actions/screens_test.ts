import reducer, {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} from "@actions/screens";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe("@renderer/actions/screens", () => {
  describe(updateTweets.toString(), () => {
    it("when first tweet", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
      const tweet = builders.buildTweet({id_str: "1"});

      expect(reducer(state, updateTweets({identity: screen.identity, tweets: [tweet]}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {tweets: [tweet]}),
        },
      });
    });
  });

  describe(mark.toString(), () => {
    it("as usual", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
      const tweet = builders.buildTweet({id_str: "1"});

      expect(reducer(state, mark({identity: screen.identity, lastReadID: "1"}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {lastReadID: "1"}),
        },
      });
    });
  });

  describe(setupSearch.toString(), () => {
    it("as usual", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, setupSearch({identity: screen.identity, query: "くえりー"}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {
            options: {
              query: "くえりー",
            },
          }),
        },
      });
    });

    it("when trim query", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, setupSearch({identity: screen.identity, query: " く え り ー "}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {
            options: {
              query: "く え り ー",
            },
          }),
        },
      });
    });
    it("when query is empty", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, setupSearch({identity: screen.identity, query: ""}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {
            options: {
              query: "",
            },
          }),
        },
      });
    });
  });
  describe(changeMode.toString(), () => {
    it("as usual", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, changeMode({identity: screen.identity, mode: "media"}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {
            mode: "media",
          }),
        },
      });
    });
  });
  describe(prepareScreen.toString(), () => {
    it("as usual", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.getInitialState();
      const expected = adapters.screens.addMany(state, [screen]);

      expect(reducer(state, prepareScreen(screen.identity))).toEqual(expected);
    });
  });
  describe(closeScreen.toString(), () => {
    it("as usual", () => {
      const screen1 = builders.buildScreen();
      const screen2 = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen1, screen2]);

      expect(reducer(state, closeScreen(screen2.identity))).toEqual({
        ids: [screen1.identity],
        entities: {
          [screen1.identity]: screen1,
        },
      });
    });
  });
  describe(updateScreenStatus.toString(), () => {
    it("as usual", () => {
      const screen = builders.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, updateScreenStatus({identity: screen.identity, status: "loading"}))).toEqual({
        ids: [screen.identity],
        entities: {
          [screen.identity]: Object.assign({}, screen, {status: {status: "loading"}}),
        },
      });
    });
  });
});
