import {createActions, handleActions} from "redux-actions";

export const {branch, clip} = createActions({
  BRANCH: (root: TMB.ScreenID, branch: TMB.ScreenID) => ({root, branch}),
  CLIP: (root: TMB.ScreenID, branch: TMB.ScreenID) => ({root, branch}),
});

export default handleActions<TMB.Lineage, {root: TMB.ScreenID; branch: TMB.ScreenID}>(
  {
    [branch.toString()]: (state, action) => {
      const {root, branch} = action.payload;
      const tree: TMB.Lineage = new Map(state);

      const branches = (tree.get(root) || []).concat();

      branches.push(branch);
      tree.set(root, branches);

      return tree;
    },
    [clip.toString()]: (state, action) => {
      const {root} = action.payload;
      const tree: TMB.Lineage = new Map(state);
      const branches = tree.get(root)!.concat();

      branches.pop();
      tree.set(root, branches);

      return tree;
    },
  },
  new Map()
);
