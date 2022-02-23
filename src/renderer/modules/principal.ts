import {createActions, handleActions} from "redux-actions";

export const {setScreens, focusScreen, zoomIn, zoomOut, zoomReset, showLoading} = createActions({
  SET_SCREENS: (screens: TMB.ScreenID[]) => ({
    screens,
  }),
  FOCUS_SCREEN: (identity) => ({
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
    [setScreens.toString()]: (state, action) => ({
      ...state,
      screens: action.payload.screens!,
    }),
    [focusScreen.toString()]: (state, action) => ({
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
    screens: [],
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
