import * as fs from "fs";
import {faker} from "@faker-js/faker";
import {incarnate} from "@source/main/processing/twitter";
import {retry} from "@source/main/processing/twitter/utility";
import {degrade, degradeDate} from "@source/main/processing/twitter/degrader";
import {parseElements} from "@source/renderer/libraries/twitter";
import {builders, recursiveObjectContaining, fail} from "@test/helper";

function loadJSON(path: string) {
  return JSON.parse(fs.readFileSync(`./test/main/processing/${path}`).toString());
}

function fake(elements: Partial<Twitter2.Tweet>[]): RecursivePartial<Twitter2.Response> {
  const data: Partial<Twitter2.Tweet>[] = [];
  const users: Partial<Twitter2.User>[] = [];

  function duel(specified: string | undefined, generated: () => string): string {
    return specified !== undefined ? specified : generated();
  }
  function fakeNumberString() {
    return faker.datatype.number().toString();
  }
  function fakeDateString() {
    return faker.date.past().toString();
  }

  for (const element of elements) {
    const author_id = duel(element.author_id, () => {
      return faker.datatype.number().toString();
    });

    data.push({
      id: duel(element.id, fakeNumberString),
      text: duel(element.text, faker.random.words),
      conversation_id: duel(element.conversation_id, fakeNumberString),
      created_at: duel(element.created_at, fakeDateString),
      author_id,
    });

    users.push({
      id: author_id,
    });
  }

  return {
    data: data,
    includes: {
      users: users,
    },
    meta: {
      result_count: data.length,
    },
  };
}

describe("retrieveTimeline", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockReturnValue(Promise.resolve([{id: 1}]));

    const agent = incarnate({get: callback}, {get: fail});

    return expect(agent.retrieveTimeline(null)).resolves.toEqual([{id: 1}]);
  });
});

describe("search", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockReturnValue(
      Promise.resolve({
        statuses: [
          {
            id: 1,
          },
        ],
      })
    );

    const agent = incarnate({get: callback}, {get: fail});

    return expect(agent.search("くえりー", null)).resolves.toEqual([{id: 1}]);
  });
});

describe("retrieveTimelineOfUser", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockReturnValue(
      Promise.resolve([
        {
          id: 1,
        },
      ])
    );

    const agent = incarnate({get: callback}, {get: fail});

    return expect(agent.retrieveTimelineOfUser("gian")).resolves.toEqual([{id: 1}]);
  });
});

describe("retrieveMentions", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockReturnValue(
      Promise.resolve([
        {
          id: 1,
        },
      ])
    );

    const agent = incarnate({get: callback}, {get: fail});

    return expect(agent.retrieveMentions(null)).resolves.toEqual([{id: 1}]);
  });
});

describe("retrieveConversation", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockImplementation((endpoint: string) => {
      switch (endpoint) {
        case "tweets/1":
          return Promise.resolve({
            data: {
              conversation_id: "2",
            },
          });
        case "tweets/search/recent":
          return Promise.resolve(Object.assign(loadJSON("./v2/tweet.json"), {meta: {result_count: 1}}));
      }
      return Promise.reject(endpoint);
    });

    const agent = incarnate({get: fail}, {get: callback});
    const tweet = builders.twitter.buildTweet({id_str: "1"});

    return expect(agent.retrieveConversation(tweet)).resolves.toHaveLength(2);
  });

  it("when conversation is empty", () => {
    const callback = jest.fn();
    callback.mockImplementation((endpoint: string) => {
      switch (endpoint) {
        case "tweets/1":
          return Promise.resolve({
            data: {
              conversation_id: "2",
            },
          });
        case "tweets/search/recent":
          return Promise.resolve({meta: {result_count: 0}});
      }
      return Promise.reject(endpoint);
    });

    const agent = incarnate({get: fail}, {get: callback});
    const tweet = builders.twitter.buildTweet({id_str: "1"});

    return expect(agent.retrieveConversation(tweet)).resolves.toHaveLength(1);
  });

  it("when result does not include source tweet and replied tweet", () => {
    const callback = jest.fn();

    const source2 = loadJSON("./v2/reply.json");
    const source1 = degrade(source2)[0];

    const replied2 = fake([
      {
        id: "1296887091901718529",
      },
    ]);
    const replied1 = degrade(replied2 as Twitter2.Response);

    const results2 = fake([
      {
        conversation_id: "1296887091901718529",
      },
      {
        conversation_id: "1296887091901718529",
      },
    ]);
    const results1 = degrade(results2 as Twitter2.Response);

    callback.mockImplementation((endpoint: string) => {
      switch (endpoint) {
        case `tweets/${source2.data.id}`:
          return Promise.resolve(source2);
        case "tweets/search/recent":
          return Promise.resolve(results2);
        case `tweets/${source2.data.referenced_tweets[0].id}`:
          return Promise.resolve(replied2);
      }
      return Promise.reject(endpoint);
    });

    const agent = incarnate({get: fail}, {get: callback});

    return expect(agent.retrieveConversation(source1)).resolves.toEqual(([] as Twitter.Tweet[]).concat(replied1, source1, results1.reverse()));
  });

  it("when cannot find original", () => {
    const callback = jest.fn();
    callback.mockImplementation((endpoint: string) => {
      switch (endpoint) {
        case "tweets/1":
          return Promise.resolve({errors: [{title: "Not Found Error"}]});
      }
      return Promise.reject(endpoint);
    });

    const agent = incarnate({get: fail}, {get: callback});
    const tweet = builders.twitter.buildTweet({id_str: "1"});

    return expect(agent.retrieveConversation(tweet)).rejects.toThrowError(JSON.stringify([{title: "Not Found Error"}]));
  });

  it("when replied tweets is deleted", () => {
    const callback = jest.fn();
    callback.mockImplementation((endpoint: string) => {
      switch (endpoint) {
        case "tweets/1296887316556980230":
          return Promise.resolve(
            Object.assign(loadJSON("./v2/reply.json"), {
              errors: [
                {
                  value: "1503557906574503936",
                  detail: "Could not find tweet with referenced_tweets.id: [1503557906574503936].",
                  title: "Not Found Error",
                  resource_type: "tweet",
                  parameter: "referenced_tweets.id",
                  resource_id: "1503557906574503936",
                  type: "https://api.twitter.com/2/problems/resource-not-found",
                },
              ],
            })
          );
        case "tweets/search/recent":
          return Promise.resolve(
            Object.assign(loadJSON("./v2/reply.json"), {
              meta: {
                result_count: 1,
              },
              errors: [
                {
                  value: "1503557906574503936",
                  detail: "Could not find tweet with referenced_tweets.id: [1503557906574503936].",
                  title: "Not Found Error",
                  resource_type: "tweet",
                  parameter: "referenced_tweets.id",
                  resource_id: "1503557906574503936",
                  type: "https://api.twitter.com/2/problems/resource-not-found",
                },
              ],
            })
          );
      }
      return Promise.reject(endpoint);
    });

    const agent = incarnate({get: fail}, {get: callback});

    const criterion = builders.twitter.buildTweet({id_str: "1296887316556980230"});
    return expect(agent.retrieveConversation(criterion)).resolves.toEqual(degrade(loadJSON("./v2/reply.json")));
  });

  it("when replied tweets is private account", () => {
    const callback = jest.fn();
    callback.mockImplementation((endpoint: string) => {
      switch (endpoint) {
        case "tweets/1296887316556980230":
          return Promise.resolve(
            Object.assign(loadJSON("./v2/reply.json"), {
              errors: [
                {
                  value: "1503557906574503936",
                  detail: "Sorry, you are not authorized to see the Tweet with  referenced_tweets.id: [1503557906574503936].",
                  title: "Authorization Error",
                  resource_type: "tweet",
                  parameter: "referenced_tweets.id",
                  resource_id: "1503557906574503936",
                  type: "https://api.twitter.com/2/problems/not-authorized-for-resource",
                },
              ],
            })
          );
        case "tweets/search/recent":
          return Promise.resolve(
            Object.assign(loadJSON("./v2/reply.json"), {
              meta: {
                result_count: 1,
              },
              errors: [
                {
                  value: "1503557906574503936",
                  detail: "Sorry, you are not authorized to see the Tweet with referenced_tweets.id: [1503557906574503936].",
                  title: "Authorization Error",
                  resource_type: "tweet",
                  parameter: "referenced_tweets.id",
                  resource_id: "1503557906574503936",
                  type: "https://api.twitter.com/2/problems/not-authorized-for-resource",
                },
              ],
            })
          );
      }
      return Promise.reject(endpoint);
    });

    const agent = incarnate({get: fail}, {get: callback});

    const criterion = builders.twitter.buildTweet({id_str: "1296887316556980230"});
    return expect(agent.retrieveConversation(criterion)).resolves.toEqual(degrade(loadJSON("./v2/reply.json")));
  });
});

describe("lists", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockImplementation((endpoint, option, callback) => {
      callback(
        null,
        [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ],
        null
      );
    });

    const agent = incarnate({get: callback}, {get: fail});

    return expect(agent.lists()).resolves.toEqual([{id: 2}, {id: 1}]);
  });
});

describe("retrieveTimelineOfList", () => {
  it("success", () => {
    const callback = jest.fn();
    callback.mockReturnValue(
      Promise.resolve([
        {
          id: 1,
        },
      ])
    );

    const agent = incarnate({get: callback}, {get: fail});

    return expect(agent.retrieveTimelineOfList("news", null)).resolves.toEqual([{id: 1}]);
  });
});

describe("degrade", () => {
  const tests = Object.entries({
    tweet: "Tweet",
    reply: "Tweet reply",
    extended: "Extended Tweet",
    media: "Tweet with media",
    retweet: "Retweet",
    quote: "Quote Tweet",
  });
  for (const [key, subject] of tests) {
    it(subject, () => {
      const actual = degrade(loadJSON(`./v2/${key}.json`))[0];

      expect(loadJSON(`./v1/${key}.json`)).toEqual(recursiveObjectContaining(actual));

      parseElements(actual, false);
    });
  }
});

describe("degradeDate", () => {
  it("degrade", () => {
    expect(degradeDate("2021-01-01T00:00:00.000Z")).toBe("Fri Jan 01 00:00:00 +0000 2021");
    expect(degradeDate("2021-01-01T01:00:00.000Z")).toBe("Fri Jan 01 01:00:00 +0000 2021");
  });
});

describe("retry", () => {
  it("when success", () => {
    const processing = () => {
      return Promise.resolve([]);
    };

    return expect(retry(processing, 3)).resolves.toEqual([]);
  });
  it("when retry", () => {
    const processing = jest.fn();
    processing.mockReturnValueOnce(
      Promise.reject({
        code: "ENOTFOUND",
      })
    );
    processing.mockReturnValueOnce(Promise.resolve([]));

    return expect(retry(processing, 3)).resolves.toEqual([]);
  });
  it("when retries are exceeded", () => {
    const processing = jest.fn();
    processing.mockReturnValue(
      Promise.reject({
        code: "ENOTFOUND",
      })
    );

    return expect(retry(processing, 1)).rejects.toEqual({
      code: "ENOTFOUND",
    });
  });
  it("when other than ENOTFOUND", () => {
    const processing = jest.fn();
    processing.mockReturnValue(
      Promise.reject({
        code: "others",
      })
    );

    return expect(retry(processing, 3)).rejects.toThrow();
  });
});
