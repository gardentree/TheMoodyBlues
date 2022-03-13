export function selectFocusedScreenID(state: TMB.State): TMB.ScreenID {
  const {
    principal: {focused},
  } = state;

  return focused;
}
