import React from "react";
import { render } from "react-dom";
import "./index.css";
import { RecoilRoot } from "recoil";
import App from "./App";

export const SERVER_URL = "http://localhost:8989";
export const API_BASE_URL = `${SERVER_URL}/api`;

const rootElement = document.getElementById("root");

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  rootElement
);
