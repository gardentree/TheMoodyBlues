import Principal from "@source/renderer/components/Principal";
import {act, screen, waitFor} from "@testing-library/react";
import * as actions from "@actions";
import adapters from "@source/renderer/libraries/adapter";
import {builders} from "@test/helper";
import {renderWithProviders} from "@test/provider";
import {createStore} from "@source/renderer/store";

jest.mock("react-transition-group", () => {
  const original = jest.requireActual("react-transition-group");

  return {...original, TransitionGroup: jest.fn((props) => props.children)};
});

describe("window saga", () => {
  //FIXME sagaの起動をリセットする方法が分からないので生成を1回にして一旦ごまかす
  const store = createStore();

  test("focusTweet", async () => {
    const {facade} = window;
    const backstage = builders.preference.buildBackstage();
    const tweet = builders.twitter.buildTweet({full_text: "tweet"});
    facade.storage.setBackstages(adapters.backstages.addMany(adapters.backstages.getInitialState(), [backstage]));
    facade.storage.setTweets(backstage.identifier, [tweet]);

    act(() => store.dispatch(actions.prepareState()));

    renderWithProviders(<Principal />, {store});
    await waitFor(() => screen.getByText(tweet.full_text));

    const spyAlert = jest.spyOn(window, "alert");
    act(() => store.dispatch(actions.focusTweet(tweet)));

    expect(spyAlert).not.toBeCalled();
  });
  test("focusLatestTweet", async () => {
    const {facade} = window;
    const backstage = builders.preference.buildBackstage();
    const tweet = builders.twitter.buildTweet({full_text: "tweet"});
    facade.storage.setBackstages(adapters.backstages.addMany(adapters.backstages.getInitialState(), [backstage]));
    facade.storage.setTweets(backstage.identifier, [tweet]);

    act(() => store.dispatch(actions.prepareState()));

    renderWithProviders(<Principal />, {store});
    await waitFor(() => screen.getByText(tweet.full_text));

    const spyAlert = jest.spyOn(window, "alert");
    act(() => store.dispatch(actions.focusLatestTweet()));

    expect(spyAlert).not.toBeCalled();
  });
  test("focusUnreadTweet", async () => {
    const {facade} = window;
    const backstage = builders.preference.buildBackstage();
    const tweet = builders.twitter.buildTweet({full_text: "tweet"});
    facade.storage.setBackstages(adapters.backstages.addMany(adapters.backstages.getInitialState(), [backstage]));
    facade.storage.setTweets(backstage.identifier, [builders.twitter.buildTweet({full_text: "tweet"})]);

    act(() => store.dispatch(actions.prepareState()));

    renderWithProviders(<Principal />, {store});
    await waitFor(() => screen.getByText(tweet.full_text));

    const spyAlert = jest.spyOn(window, "alert");
    act(() => store.dispatch(actions.focusUnreadTweet()));

    expect(spyAlert).not.toBeCalled();
  });
});
