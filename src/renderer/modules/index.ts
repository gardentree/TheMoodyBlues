import {createActions} from "redux-actions";

export const {initialize, reconfigure} = createActions({
  INITIALIZE: () => null,
  RECONFIGURE: () => null,
});
