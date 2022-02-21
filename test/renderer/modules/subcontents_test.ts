import {expect} from "chai";
import * as subcontents from "@actions/subcontents";
import {default as reducer} from "@actions/subcontents";

const template = {
  tweets: [],
};

describe(reducer.name, () => {
  it("updateTweetsInSubContents", () => {
    expect(reducer(template, subcontents.updateTweetsInSubContents([]))).to.deep.equal({tweets: []});
  });
});
