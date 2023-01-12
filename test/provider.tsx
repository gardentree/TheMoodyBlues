import React, {PropsWithChildren} from "react";
import {render} from "@testing-library/react";
import type {RenderOptions} from "@testing-library/react";
import type {PreloadedState} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {CacheProvider} from "@emotion/react";
import {createStyleCache} from "@source/renderer/styles";
import {createStore} from "@source/renderer/store";

const styleCache = createStyleCache();

type AppStore = ReturnType<typeof createStore>;
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<TMB.State>;
  store?: AppStore;
}
export function renderWithProviders(ui: React.ReactElement, {store = createStore(), ...renderOptions}: ExtendedRenderOptions = {}) {
  function Wrapper({children}: PropsWithChildren): JSX.Element {
    return (
      <CacheProvider value={styleCache}>
        <Provider store={store}>{children}</Provider>
      </CacheProvider>
    );
  }

  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}
