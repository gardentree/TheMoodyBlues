import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import sinon from "sinon";
import {incarnate} from "@source/preload/twitter_agent";
import * as fs from "fs";

use(chaiAsPromised);
use(chaiSubset);

const [degrade] = rewires("preload/twitter_agent", ["degrade"]);
const [parseElements] = rewires("libraries/twitter", ["parseElements"]);

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
      const actual = degrade(loadJSON(`./test/preload/v2/${key}.json`))[0];

      expect(loadJSON(`./test/preload/v1/${key}.json`)).to.containSubset(actual);

      parseElements(actual);
    });
  }
});