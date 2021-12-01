import {call} from "@preload/twitter_authentication";

const agent = call();
if (!agent) {
  throw "error";
}

agent
  .get("tweets/search/recent", {
    query: "TheMoodyBlues lang:ja",
  })
  .then((tweets) => {
    console.log(tweets);
  });
