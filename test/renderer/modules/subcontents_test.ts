import {expect} from "chai";
import * as subcontents from "@modules/subcontents";
import {default as reducer} from "@modules/subcontents";

const template = {
  tweets: [],
};

describe(reducer.name, () => {
  it("updateTweetsInSubContents", () => {
    expect(reducer(template, subcontents.updateTweetsInSubContents([]))).to.deep.equal({tweets: []});
  });
});
