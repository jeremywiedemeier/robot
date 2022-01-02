import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App";
import WebSocketProvider from "./WebSocket";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </Provider>,
  document.getElementById("root")
);
