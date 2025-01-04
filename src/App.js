import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import JellyAnimationBasic from "./animations/JellyAnimationBasic";
import JellyAnimationTemp from "./animations/JellyAnimationTemp";
import JellyAnimationPng from "./animations/JellyAnimationPng";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const ShowPage = lazy(() => import("./pages/ShowPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ja_basic" element={<JellyAnimationBasic />} />
            <Route path="ja_temp" element={<JellyAnimationTemp />} />
            <Route path="ja_png" element={<JellyAnimationPng />} />
          </Route>
          <Route path="/show" element={<ShowPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
