import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import sinon from "sinon";
import * as fs from "fs";

use(chaiAsPromised);
use(chaiSubset);

const [incarnate, degrade, degradeDate] = rewires("main/twitter/agent", ["incarnate", "degrade", "degradeDate"]);
const [parseElements] = rewires("/renderer/libraries/twitter", ["parseElements"]);

describe("retrieveTimeline", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimeline(null)).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("search", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      {
        statuses: [
          {
            id: 1,
          },
        ],
      },
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.search("くえりー")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveTimelineOfUser", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimelineOfUser("gian")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveMentions", () => {
  it("success", () => {
    const callback = sinon.stub();
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveMentions(null)).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("retrieveConversation", () => {});

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
    callback.yields(
      null,
      [
        {
          id: 1,
        },
      ],
      null
    );

    const agent = incarnate({get: callback});

    return expect(agent.retrieveTimelineOfList("news")).to.eventually.deep.equal([{id: 1}]);
  });
});

describe("degrade", () => {
  function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path));
  }

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
      const actual = degrade(loadJSON(`./test/main/twitter/v2/${key}.json`))[0];

      expect(loadJSON(`./test/main/twitter/v1/${key}.json`)).to.containSubset(actual);

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
