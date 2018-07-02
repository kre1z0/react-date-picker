import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import Root from "./Root";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root"),
  );
};

render(Root);

if (module.hot) {
  module.hot.accept("./Root", () => render(Root));
}
