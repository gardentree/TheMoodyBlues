const SELECT = "SELECT";

const initialState = null;
export default function reducer(state = initialState, action: TheMoodyBlues.ReduxAction) {
  switch (action.type) {
    case SELECT:
      return action.payload.agent;
    default:
      return state;
  }
}

export const select = (agent: TheMoodyBlues.TwitterAgent) => ({
  type: SELECT,
  payload: agent,
  meta: null,
  error: false,
});
