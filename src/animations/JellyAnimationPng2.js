import React, { useEffect, useRef, useState } from "react";

function JellyAnimationPng() {
  const canvasRef = useRef(null);
  //const [selectedJelly, setSelectedJelly] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정 (지정된 크기)
    canvas.width = 1000; // 캔버스 너비
    canvas.height = 200; // 캔버스 높이

    // 이미지 배열과 속성 설정
    const images = [
      { src: "/image/젤리아이_상단_젤.png", x: 50, y: 50, dx: 2, dy: 2 },
      { src: "/image/젤리아이_상단_리.png", x: 150, y: 50, dx: -2, dy: 1.5 },
      { src: "/image/젤리아이_상단_아.png", x: 500, y: 50, dx: 1, dy: -2 },
      { src: "/image/젤리아이_상단_이.png", x: 800, y: 50, dx: -1.5, dy: 1 },
    ];

    // 이미지 로드
    images.forEach((imgObj) => {
      const img = new Image();
      img.src = imgObj.src;
      img.onload = () => {
        imgObj.image = img; // 로드된 이미지를 객체에 저장
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      images.forEach((imgObj) => {
        if (imgObj.image) {
          // 이미지 그리기
          ctx.drawImage(imgObj.image, imgObj.x, imgObj.y, 100, 100);

          // 이미지 이동
          imgObj.x += imgObj.dx;
          imgObj.y += imgObj.dy;

          // 캔버스 경계 충돌 처리
          if (imgObj.x + 100 > canvas.width || imgObj.x < 0) {
            imgObj.dx = -imgObj.dx;
          }
          if (imgObj.y + 100 > canvas.height || imgObj.y < 0) {
            imgObj.dy = -imgObj.dy;
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          //border: "1px solid black",
          display: "block", // 캔버스를 블록 요소로 설정
          margin: "50px auto", // 화면 중앙 정렬
        }}
      />
    </>
  );
}

export default JellyAnimationPng;
