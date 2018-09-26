import Action from "../others/action";

const ZOOM_IN = "ZOOM_IN";
const ZOOM_OUT = "ZOOM_OUT";
const ZOOM_RESET = "ZOOM_RESET";

const initialState = {
  fontSize: "12px",
};
export default function reducer(state = initialState, action: Action) {
  let offset = 0;
  switch (action.type) {
    case ZOOM_IN:
      offset = 1;
      break;
    case ZOOM_OUT:
      offset = -1;
      break;
    case ZOOM_RESET:
      return {
        fontSize: "12px",
      };
    default:
      return state;
  }

  const matcher = state.fontSize.match(/(\d+)px/);
  return {fontSize: `${Number(matcher![1]) + offset}px`};
}

export const zoomIn = () => ({
  type: ZOOM_IN,
  payload: null,
  meta: null,
  error: false,
});
export const zoomOut = () => ({
  type: ZOOM_OUT,
  payload: null,
  meta: null,
  error: false,
});
export const zoomReset = () => ({
  type: ZOOM_RESET,
  payload: null,
  meta: null,
  error: false,
});
