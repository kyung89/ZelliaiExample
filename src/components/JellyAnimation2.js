import React, { useEffect, useRef } from "react";

function JellyAnimation2() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const jellyArray = [];
    const numJellies = 4;

    // 랜덤 숫자 생성 함수
    const random = (min, max) => Math.random() * (max - min) + min;

    // 젤리 객체 생성
    class Jelly {
      constructor(x, y, radius, color, text) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.text = text; // 젤리 위에 표시할 텍스트
        this.dx = random(-3, 3); // X 방향 속도
        this.dy = random(-3, 3); // Y 방향 속도
      }

      draw() {
        // 젤리 그리기
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // 텍스트 그리기
        ctx.fillStyle = "black"; // 텍스트 색상
        ctx.font = `${this.radius / 2}px Arial`; // 텍스트 크기 및 폰트
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x, this.y);
      }

      update() {
        // 위치 업데이트
        this.x += this.dx;
        this.y += this.dy;

        // 벽에 부딪히면 방향 반전
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.draw();
      }
    }

    // 젤리 초기화
    const colors = ["green", "yellow", "red", "blue"]; // 초록, 노랑, 분홍, 파랑
    const texts = ["젤", "리", "아", "이"];
    for (let i = 0; i < numJellies; i++) {
      const radius = random(30, 50);
      const x = random(radius, canvas.width - radius);
      const y = random(radius, canvas.height - radius);
      const color = colors[i];
      const text = texts[i]; // 각 젤리에 표시할 텍스트

      jellyArray.push(new Jelly(x, y, radius, color, text));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      jellyArray.forEach((jelly) => jelly.update());
      requestAnimationFrame(animate);
    };

    animate();

    // 창 크기 조정 처리
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

export default JellyAnimation2;
