import * as React from "react";
import {createRoot} from "react-dom/client";
import Preferences from "./components/Preferences";

createRoot(document.getElementById("container")!).render(<Preferences />);
