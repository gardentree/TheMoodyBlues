import TimelineSaga from "./timeline";
import SearchSaga from "./search";

const getSaga = function (state: TheMoodyBlues.State, identify: string) {
  const {agent, home} = state;
  const timeline = home.timelines.get(identify)!;

  switch (timeline.meta.component) {
    case "Timeline":
      return new TimelineSaga(agent, timeline);
    case "Search":
      return new SearchSaga(agent, timeline);
    default:
      throw new Error(identify);
  }
};

export default getSaga;
