import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import JellyAnimationBasic from "./animations/JellyAnimationBasic";
import JellyAnimationPng from "./animations/JellyAnimationPng";
import JellyAnimationTemp from "./animations/JellyAnimationTemp";
import OrganicBallAnimation from "./animations/OrganicBallAnimation";
import OrganicJellyAnimation from "./animations/OrganicJellyAnimation";
import "./App.css";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const ShowPage = lazy(() => import("./pages/ShowPage"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex justify-center items-center mt-80">
            <div className="spinner"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="ja_basic" element={<JellyAnimationBasic />} />
            <Route path="ja_temp" element={<JellyAnimationTemp />} />
            <Route path="ja_png" element={<JellyAnimationPng />} />
            <Route path="oja" element={<OrganicJellyAnimation />} />
            <Route path="oba" element={<OrganicBallAnimation />} />
          </Route>
          <Route path="/show" element={<ShowPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
