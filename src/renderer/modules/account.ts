import ActionType from "../types/action";

const SELECT = "SELECT";

const initialState = null;
export default function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case SELECT:
      return action.payload.account;
    default:
      return state;
  }
}

export const select = (account: any) => ({
  type: SELECT,
  payload: account,
  meta: null,
  error: false,
});
