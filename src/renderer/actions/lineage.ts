import {createActions, handleActions, Action} from "redux-actions";
import adapters from "@libraries/adapter";

export const {branch, clip} = createActions({
  BRANCH: (root: TMB.ScreenID, branch: TMB.ScreenID) => ({root, branch}),
  CLIP: (root: TMB.ScreenID, branch: TMB.ScreenID) => ({root, branch}),
}) as {
  branch(root: TMB.ScreenID, branch: TMB.ScreenID): Action<unknown>;
  clip(root: TMB.ScreenID, branch: TMB.ScreenID): Action<unknown>;
};

export default handleActions<TMB.Lineage, {root: TMB.ScreenID; branch: TMB.ScreenID}>(
  {
    [branch.toString()]: (state, action) => {
      const {root, branch} = action.payload;
      const tree: TMB.LineageTree | undefined = adapters.lineage.getSelectors().selectById(state, root);

      if (tree) {
        const newBranches = tree.branches.concat();
        newBranches.push(branch);

        return adapters.lineage.setOne(state, {root: root, branches: newBranches});
      } else {
        return adapters.lineage.addOne(state, {root: root, branches: [branch]});
      }
    },
    [clip.toString()]: (state, action) => {
      const {root} = action.payload;
      const tree: TMB.LineageTree = adapters.lineage.getSelectors().selectById(state, root)!;

      return adapters.lineage.setOne(state, {
        root,
        branches: tree.branches.slice(0, -1),
      });
    },
  },
  adapters.lineage.getInitialState()
);
