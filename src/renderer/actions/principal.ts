import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "principal",
  initialState: {
    screens: [] as TMB.ScreenID[],
    focused: "",
    style: {
      fontSize: "12px",
    },
    nowLoading: false,
    dialog: null as TMB.Dialog,
  },
  reducers: {
    setScreens: (state, action: PayloadAction<TMB.ScreenID[]>) => {
      state.screens = action.payload;
    },
    focusScreen: (state, action: PayloadAction<TMB.ScreenID>) => {
      state.focused = action.payload;
    },
    zoomIn: (state) => {
      state.style = {fontSize: fontSize(state.style, 1)};
    },
    zoomOut: (state) => {
      state.style = {fontSize: fontSize(state.style, -1)};
    },
    zoomReset: (state) => {
      state.style = {fontSize: fontSize(state.style, 0)};
    },
    showLoading: (state, action: PayloadAction<boolean>) => {
      state.nowLoading = action.payload;
    },
    openDialog: (state, action: PayloadAction<TMB.Dialog>) => {
      state.dialog = action.payload;
    },
    closeDialog: (state) => {
      state.dialog = null;
    },
  },
});

function fontSize(style: TMB.PrincipalStyle, offset: number) {
  if (offset == 0) {
    return "12px";
  } else {
    const matcher = style.fontSize.match(/(\d+)px/);
    return `${Number(matcher![1]) + offset}px`;
  }
}

export const {setScreens, focusScreen, zoomIn, zoomOut, zoomReset, showLoading, openDialog, closeDialog} = slice.actions;
export default slice.reducer;
