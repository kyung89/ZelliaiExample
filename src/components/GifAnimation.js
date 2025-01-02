import React, { useEffect, useRef } from "react";

function GifAnimationLimitedArea() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 한정된 공간 정의
    const areaWidth = 800; // 한정된 공간 너비
    const areaHeight = 600; // 한정된 공간 높이
    const areaX = (canvas.width - areaWidth) / 2; // 중앙 정렬
    const areaY = (canvas.height - areaHeight) / 2;

    const gifArray = [];
    const numGifs = 4;

    // 랜덤 숫자 생성 함수
    const random = (min, max) => Math.random() * (max - min) + min;

    // GIF 객체 생성
    class MovingGif {
      constructor(x, y, width, height, src) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.src = src; // GIF 경로
        this.dx = random(-3, 3); // X 방향 속도
        this.dy = random(-3, 3); // Y 방향 속도

        // GIF 이미지 로드
        this.image = new Image();
        this.image.src = this.src;
      }

      draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // 한정된 공간 내에서 충돌 처리
        if (this.x + this.width > areaX + areaWidth || this.x < areaX) {
          this.dx = -this.dx;
        }
        if (this.y + this.height > areaY + areaHeight || this.y < areaY) {
          this.dy = -this.dy;
        }

        this.draw();
      }
    }

    // GIF 초기화
    const gifPaths = [
      "https://media.giphy.com/media/1xVbEyob1lDBe/giphy.gif", // GIF 경로
      "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
      "https://media.giphy.com/media/l0HlUQZrue9QJf6T2/giphy.gif",
      "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
    ];

    for (let i = 0; i < numGifs; i++) {
      const width = random(100, 150); // GIF 크기
      const height = random(100, 150);
      const x = random(areaX, areaX + areaWidth - width); // 한정된 공간 내에서만 위치 설정
      const y = random(areaY, areaY + areaHeight - height);
      const src = gifPaths[i % gifPaths.length]; // GIF 경로 순환

      gifArray.push(new MovingGif(x, y, width, height, src));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 한정된 공간 그리기
      ctx.strokeStyle = "black";
      ctx.strokeRect(areaX, areaY, areaWidth, areaHeight);

      gifArray.forEach((gif) => gif.update());
      requestAnimationFrame(animate);
    };

    animate();

    // 창 크기 조정 이벤트 처리
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

export default GifAnimationLimitedArea;
