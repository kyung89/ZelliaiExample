import React, { useEffect, useRef } from "react";

function JellyAnimation1() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const jellyArray = [];
    const numJellies = 4;

    // 랜덤 숫자 생성
    const random = (min, max) => Math.random() * (max - min) + min;

    // 젤리 객체 생성
    class Jelly {
      constructor(x, y, width, height, radius, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.color = color;
        this.dx = random(-3, 3); // X 방향 속도
        this.dy = random(-3, 3); // Y 방향 속도
      }

      draw() {
        // 그림자
        ctx.beginPath();
        ctx.roundRect(
          this.x + 5,
          this.y + 5,
          this.width,
          this.height,
          this.radius
        );
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fill();
        ctx.closePath();

        // 본체 그라데이션
        const gradientBody = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x + this.width,
          this.y + this.height
        );
        gradientBody.addColorStop(0, "white");
        gradientBody.addColorStop(0.3, this.color);
        gradientBody.addColorStop(1, "black");

        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        ctx.fillStyle = gradientBody;
        ctx.fill();
        ctx.closePath();

        // 하이라이트 (입체 효과)
        ctx.beginPath();
        ctx.roundRect(
          this.x + this.width * 0.1,
          this.y + this.height * 0.1,
          this.width * 0.8,
          this.height * 0.3,
          this.radius * 0.3
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
        ctx.closePath();

        // 윤곽선
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.radius);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // 벽에 부딪히는 경우
        if (this.x + this.width > canvas.width || this.x < 0) {
          this.dx = -this.dx; // X 방향 반전
        }
        if (this.y + this.height > canvas.height || this.y < 0) {
          this.dy = -this.dy; // Y 방향 반전
        }

        this.draw();
      }
    }

    // 젤리 배열 초기화
    for (let i = 0; i < numJellies; i++) {
      const width = random(50, 100);
      const height = random(50, 100);
      const radius = random(10, 30);
      const x = random(radius, canvas.width - width - radius);
      const y = random(radius, canvas.height - height - radius);
      const color = `hsl(${random(0, 360)}, 70%, 60%)`;

      jellyArray.push(new Jelly(x, y, width, height, radius, color));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      jellyArray.forEach((jelly) => jelly.update());
      requestAnimationFrame(animate);
    };

    animate();

    // 윈도우 리사이즈 처리
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

export default JellyAnimation1;
