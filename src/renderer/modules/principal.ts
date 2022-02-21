import {createActions, handleActions} from "redux-actions";

export const {setup, selectTab, zoomIn, zoomOut, zoomReset, showLoading} = createActions({
  SETUP: (contents: TMB.ScreenID[]) => ({
    contents,
  }),
  SELECT_TAB: (identity) => ({
    focused: identity,
  }),
  ZOOM_IN: () => {},
  ZOOM_OUT: () => {},
  ZOOM_RESET: () => {},
  SHOW_LOADING: (nowLoading: boolean) => ({
    nowLoading: nowLoading,
  }),
});

export default handleActions<TMB.Principal, Partial<TMB.Principal>>(
  {
    [setup.toString()]: (state, action) => ({
      ...state,
      contents: action.payload.contents!,
    }),
    [selectTab.toString()]: (state, action) => ({
      ...state,
      focused: action.payload.focused!,
    }),
    [zoomIn.toString()]: (state, action) => ({
      ...state,
      style: {fontSize: fontSize(state.style, 1)},
    }),
    [zoomOut.toString()]: (state, action) => ({
      ...state,
      style: {fontSize: fontSize(state.style, -1)},
    }),
    [zoomReset.toString()]: (state, action) => ({
      ...state,
      style: {fontSize: fontSize(state.style, 0)},
    }),
    [showLoading.toString()]: (state, action) => ({
      ...state,
      nowLoading: action.payload.nowLoading!,
    }),
  },
  {
    contents: [],
    focused: "",
    style: {
      fontSize: "12px",
    },
    nowLoading: false,
  }
);

function fontSize(style: TMB.PrincipalStyle, offset: number) {
  if (offset == 0) {
    return "12px";
  } else {
    const matcher = style.fontSize.match(/(\d+)px/);
    return `${Number(matcher![1]) + offset}px`;
  }
}
