import React, { useEffect, useState } from "react";
import JellyAnimationPng2 from "../animations/JellyAnimationPng2";

export default function ShowPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500); // 3초 후에 실행
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center mt-80">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          <div>
            <img
              className="w-fit mx-auto"
              src="/image/헤더2.png"
              alt="header"
            />
          </div>
          <div>
            <JellyAnimationPng2 />
          </div>
          <div>
            <img
              className="w-fit mx-auto"
              src="/image/아래2.png"
              alt="header"
            />
          </div>
        </div>
      )}
    </>
  );
}
