import React from "react";
import JellyAnimationPng2 from "../animations/JellyAnimationPng2";

export default function ShowPage() {
  return (
    <div>
      <div>
        <img className="w-full" src="/image/헤더.png" alt="header" />
      </div>
      <div className="w-min-full">
        <JellyAnimationPng2 />
      </div>
      <div>
        <img className="w-full" src="/image/아래.png" alt="header" />
      </div>
    </div>
  );
}
