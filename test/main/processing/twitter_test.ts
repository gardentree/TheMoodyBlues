import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import sinon from "sinon";
import * as fs from "fs";
import faker from "@faker-js/faker";

use(chaiSubset);
use(chaiAsPromised);

const [incarnate, degrade, degradeDate, retry] = rewires("main/processing/twitter.ts", ["incarnate", "degrade", "degradeDate", "retry"]);
const [parseElements] = rewires("/renderer/libraries/twitter", ["parseElements"]);

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(`./test/main/processing/${path}`));
}
function fake(elements) {
  const data = [];
  const users = [];

  function duel(specified, generated) {
    return specified !== undefined ? specified : generated();
  }

  for (const element of elements) {
    const author_id = duel(element.author_id, faker.datatype.number).toString();

    data.push({
      id: duel(element.id, faker.datatype.number).toString(),
      text: duel(element.text, faker.random.words),
      conversation_id: duel(element.conversation_id, faker.datatype.number).toString(),
      created_at: duel(element.created_at, faker.date.past),
      author_id,
    });

    users.push({
      id: author_id,
      username: duel(element.username, faker.internet.userName),
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
    const callback = sinon.stub();
    callback.returns(Promise.resolve([{id: 1}]));

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimeline(null)).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("search", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.returns(
      Promise.resolve({
        statuses: [
          {
            id: 1,
          },
        ],
      })
    );

    const agent = incarnate({get: callback});

    return expect(agent.search("くえりー")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveTimelineOfUser", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.returns(
      Promise.resolve([
        {
          id: 1,
        },
      ])
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimelineOfUser("gian")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveMentions", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.returns(
      Promise.resolve([
        {
          id: 1,
        },
      ])
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveMentions(null)).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveConversation", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.withArgs("tweets/1").returns(
      Promise.resolve({
        data: {
          conversation_id: "2",
        },
      })
    );
    callback.withArgs("tweets/search/recent").returns(Promise.resolve(Object.assign(loadJSON("./v2/tweet.json"), {meta: {result_count: 1}})));

    const agent = incarnate(null, {get: callback});

    return expect(agent.retrieveConversation({id_str: "1"})).to.eventually.lengthOf(2);
  });

  it("when conversation is empty", () => {
    const callback = sinon.stub();
    callback.withArgs("tweets/1").returns(
      Promise.resolve({
        data: {
          conversation_id: "2",
        },
      })
    );
    callback.withArgs("tweets/search/recent").returns(Promise.resolve({meta: {result_count: 0}}));

    const agent = incarnate(null, {get: callback});

    return expect(agent.retrieveConversation({id_str: "1"})).to.eventually.lengthOf(1);
  });

  it("when result does not include source tweet and replied tweet", () => {
    const callback = sinon.stub();

    const source2 = loadJSON("./v2/reply.json");
    const source1 = degrade(source2)[0];

    const replied2 = fake([
      {
        id: "1296887091901718529",
      },
    ]);
    const replied1 = degrade(replied2);

    const results2 = fake([
      {
        conversation_id: "1296887091901718529",
      },
      {
        conversation_id: "1296887091901718529",
      },
    ]);
    const results1 = degrade(results2);

    callback.withArgs(`tweets/${source2.data.id}`).returns(Promise.resolve(source2));
    callback.withArgs("tweets/search/recent").returns(Promise.resolve(results2));
    callback.withArgs(`tweets/${source2.data.referenced_tweets[0].id}`).returns(Promise.resolve(replied2));

    const agent = incarnate(null, {get: callback});

    return expect(agent.retrieveConversation(source1)).to.eventually.deep.equal([].concat(replied1, source1, results1.reverse()));
  });

  it("when cannot find original", () => {
    const callback = sinon.stub();
    callback.withArgs(`tweets/1`).returns(Promise.resolve({errors: [{title: "Not Found Error"}]}));

    const agent = incarnate(null, {get: callback});

    return expect(agent.retrieveConversation({id_str: "1"})).to.be.rejectedWith(JSON.stringify([{title: "Not Found Error"}]));
  });

  it("when replied tweets is deleted", () => {
    const callback = sinon.stub();
    callback.withArgs("tweets/1296887316556980230").resolves(
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
    callback.withArgs("tweets/search/recent").resolves(
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

    const agent = incarnate(null, {get: callback});

    const criterion = {id_str: "1296887316556980230"};
    return expect(agent.retrieveConversation(criterion)).to.eventually.deep.equal(degrade(loadJSON("./v2/reply.json")));
  });
});

describe("lists", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
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

    const agent = incarnate({get: callback});

    return expect(agent.lists()).to.eventually.deep.equal([{id: 2}, {id: 1}]);
  });
});

describe("retrieveTimelineOfList", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.returns(
      Promise.resolve([
        {
          id: 1,
        },
      ])
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimelineOfList("news")).to.eventually.deep.equal([{id: 1}]);
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

      expect(loadJSON(`./v1/${key}.json`)).to.containSubset(actual);

      parseElements(actual);
    });
  }
});

describe("degradeDate", () => {
  it("degrade", () => {
    expect(degradeDate("2021-01-01T00:00:00.000Z")).to.eq("Fri Jan 01 00:00:00 +0000 2021");
    expect(degradeDate("2021-01-01T01:00:00.000Z")).to.eq("Fri Jan 01 01:00:00 +0000 2021");
  });
});

describe("retry", () => {
  it("when success", () => {
    const processing = sinon.stub();
    processing.resolves([]);

    return expect(retry(processing, 3)).to.eventually.deep.equal([]);
  });
  it("when retry", () => {
    const processing = sinon.stub();
    processing.onFirstCall().rejects({
      code: "ENOTFOUND",
    });
    processing.onSecondCall().resolves([]);

    return expect(retry(processing, 3)).to.eventually.deep.equal([]);
  });
  it("when retries are exceeded", () => {
    const processing = sinon.stub();
    processing.onFirstCall().rejects({
      code: "ENOTFOUND",
    });
    processing.onSecondCall().rejects({
      code: "ENOTFOUND",
    });

    return expect(retry(processing, 1)).to.be.rejectedWith({
      code: "ENOTFOUND",
    });
  });
  it("when other than ENOTFOUND", () => {
    const processing = sinon.stub();
    processing.onFirstCall().rejects({
      code: "others",
    });

    return expect(retry(processing, 3)).to.be.rejectedWith({
      code: "others",
    });
  });
});
