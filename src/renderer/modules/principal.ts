import {createActions, handleActions} from "redux-actions";

export const {selectTab, zoomIn, zoomOut, zoomReset, showLoading} = createActions({
  SELECT_TAB: (identity) => ({
    identity: identity,
  }),
  ZOOM_IN: () => {},
  ZOOM_OUT: () => {},
  ZOOM_RESET: () => {},
  SHOW_LOADING: (nowLoading: boolean) => ({
    nowLoading: nowLoading,
  }),
});

export default handleActions<TheMoodyBlues.Principal, {identity: TheMoodyBlues.TimelineIdentity; nowLoading: boolean}, {}>(
  {
    [selectTab.toString()]: (state, action) => ({
      ...state,
      focused: action.payload.identity,
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
      nowLoading: action.payload.nowLoading,
    }),
  },
  {
    focused: "",
    style: {
      fontSize: "12px",
    },
    nowLoading: false,
  }
);

function fontSize(style: TheMoodyBlues.PrincipalStyle, offset: number) {
  if (offset == 0) {
    return "12px";
  } else {
    const matcher = style.fontSize.match(/(\d+)px/);
    return `${Number(matcher![1]) + offset}px`;
  }
}

////////////////////
export const {focusLatestTweet, focusUnreadTweet, alarm} = createActions({
  FOCUS_LATEST_TWEET: () => null,
  FOCUS_UNREAD_TWEET: () => null,
  ALARM: (message) => ({message: message}),
});
