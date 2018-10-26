import TimelineSaga from "./timeline";
import SearchSaga from "./search";
import MentionsSaga from "./mentions";

const getSaga = function(state: any, name: string) {
  const {account, home} = state;

  switch (name) {
    case "Timeline":
      return new TimelineSaga(account, home.contents["Timeline"]);
    case "Search":
      return new SearchSaga(account, home.contents["Search"]);
    case "Mentions":
      return new MentionsSaga(account, home.contents["Mentions"]);
    default:
      throw new Error(name);
  }
};

export default getSaga;
