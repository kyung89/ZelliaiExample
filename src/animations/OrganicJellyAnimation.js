import React, { useEffect, useRef } from "react";

function OrganicJellyAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800; //window.innerWidth;
    canvas.height = 500; //window.innerHeight;

    // 제한된 영역 정의
    const areaWidth = 800; // 제한된 영역 너비
    const areaHeight = 400; // 제한된 영역 높이
    const areaX = (canvas.width - areaWidth) / 2; // 중앙 정렬
    const areaY = (canvas.height - areaHeight) / 2;

    const jellyArray = [];
    const numJellies = 4;

    // 랜덤 숫자 생성 함수
    const random = (min, max) => Math.random() * (max - min) + min;

    // 유기체 젤리 클래스
    class Jelly {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = random(-2, 2); // X 방향 속도
        this.dy = random(-2, 2); // Y 방향 속도
        this.angle = random(0, Math.PI * 2); // 구불구불한 시작 각도
        this.angleSpeed = random(0.02, 0.05); // 구불구불한 속도
        this.offset = random(5, 15); // 구불구불한 강도
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        const waveSegments = 12; // 유기체 모양 세그먼트
        for (let i = 0; i < waveSegments; i++) {
          const theta = (i / waveSegments) * Math.PI * 2;
          const wave = Math.sin(theta + this.angle) * this.offset; // 구불구불한 파형
          const x = this.x + (this.radius + wave) * Math.cos(theta);
          const y = this.y + (this.radius + wave) * Math.sin(theta);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // 제한된 영역 충돌 처리
        if (
          this.x + this.radius > areaX + areaWidth ||
          this.x - this.radius < areaX
        ) {
          this.dx = -this.dx; // X 방향 반전
        }
        if (
          this.y + this.radius > areaY + areaHeight ||
          this.y - this.radius < areaY
        ) {
          this.dy = -this.dy; // Y 방향 반전
        }

        this.angle += this.angleSpeed; // 구불구불한 움직임 업데이트

        this.draw();
      }
    }

    // 젤리 배열 초기화
    const colors = [
      "rgba(255, 99, 132, 0.6)", // 빨강
      "rgba(54, 162, 235, 0.6)", // 파랑
      "rgba(75, 192, 192, 0.6)", // 초록
      "rgba(255, 206, 86, 0.6)", // 노랑
    ];

    for (let i = 0; i < numJellies; i++) {
      const radius = random(30, 60);
      const x = random(areaX + radius, areaX + areaWidth - radius);
      const y = random(areaY + radius, areaY + areaHeight - radius);
      const color = colors[i % colors.length];

      jellyArray.push(new Jelly(x, y, radius, color));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 제한된 영역 그리기
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.strokeRect(areaX, areaY, areaWidth, areaHeight);

      jellyArray.forEach((jelly) => jelly.update());
      requestAnimationFrame(animate);
    };

    animate();

    // 화면 크기 조정 처리
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

export default OrganicJellyAnimation;
