import Action from "../others/action";

const SELECT_CONTENT = "SELECT_CONTENT";

const initialState = {
  name: null,
};
export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case SELECT_CONTENT:
      return {
        name: action.payload.name,
      };
    default:
      return state;
  }
}

export const select = (name: string) => ({
  type: SELECT_CONTENT,
  payload: {name: name},
  meta: null,
  error: false,
});
