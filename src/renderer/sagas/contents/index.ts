import TimelineSaga from "./timeline";
import SearchSaga from "./search";

const getSaga = function (state: TheMoodyBlues.Store.State, identify: string) {
  const {agent, timelines} = state;
  const timeline = timelines.get(identify)!;

  switch (timeline.preference.component) {
    case "Timeline":
      return new TimelineSaga(agent, timeline);
    case "Search":
      return new SearchSaga(agent, timeline);
    default:
      throw new Error(identify);
  }
};

export default getSaga;
