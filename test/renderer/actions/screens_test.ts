import reducer, {updateTweets, mark, setupSearch, changeMode, prepareScreen, closeScreen, updateScreenStatus} from "@actions/screens";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";

describe("@renderer/actions/screens", () => {
  describe(updateTweets.toString(), () => {
    it("when first tweet", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
      const tweet = builders.twitter.buildTweet({id_str: "1"});

      expect(reducer(state, updateTweets({identifier: screen.identifier, tweets: [tweet]}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {tweets: [tweet]}),
        },
      });
    });
  });

  describe(mark.toString(), () => {
    it("as usual", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);
      const tweet = builders.twitter.buildTweet({id_str: "1"});

      expect(reducer(state, mark({identifier: screen.identifier, lastReadID: "1"}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {lastReadID: "1"}),
        },
      });
    });
  });

  describe(setupSearch.toString(), () => {
    it("as usual", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, setupSearch({identifier: screen.identifier, query: "くえりー"}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {
            options: {
              query: "くえりー",
            },
          }),
        },
      });
    });

    it("when trim query", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, setupSearch({identifier: screen.identifier, query: " く え り ー "}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {
            options: {
              query: "く え り ー",
            },
          }),
        },
      });
    });
    it("when query is empty", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, setupSearch({identifier: screen.identifier, query: ""}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {
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
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, changeMode({identifier: screen.identifier, mode: "media"}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {
            mode: "media",
          }),
        },
      });
    });
  });
  describe(prepareScreen.toString(), () => {
    it("as usual", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.getInitialState();
      const expected = adapters.screens.addMany(state, [screen]);

      expect(reducer(state, prepareScreen(screen.identifier))).toEqual(expected);
    });
  });
  describe(closeScreen.toString(), () => {
    it("as usual", () => {
      const screen1 = builders.state.buildScreen();
      const screen2 = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen1, screen2]);

      expect(reducer(state, closeScreen(screen2.identifier))).toEqual({
        ids: [screen1.identifier],
        entities: {
          [screen1.identifier]: screen1,
        },
      });
    });
  });
  describe(updateScreenStatus.toString(), () => {
    it("as usual", () => {
      const screen = builders.state.buildScreen();
      const state = adapters.screens.addMany(adapters.screens.getInitialState(), [screen]);

      expect(reducer(state, updateScreenStatus({identifier: screen.identifier, status: "loading"}))).toEqual({
        ids: [screen.identifier],
        entities: {
          [screen.identifier]: Object.assign({}, screen, {status: {status: "loading"}}),
        },
      });
    });
  });
});
