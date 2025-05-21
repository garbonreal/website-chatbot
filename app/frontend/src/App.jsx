import React from "react";
import "./App.css";
import Chatbot from "./components/nestyChat/NestyChat";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <div>
      <Chatbot />
    </div>
  );
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} />
  )
);