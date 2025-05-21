import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { router } from "./App";
import "./index.css";
import Theme from "./assets/Theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <Theme>
        <RouterProvider router={router} />
    </Theme>
  </RecoilRoot>,
);


