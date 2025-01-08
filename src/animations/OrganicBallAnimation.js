import React, { useEffect, useRef } from "react";

const OrganicBallAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    const balls = [];
    const numBalls = 6;

    const random = (min, max) => Math.random() * (max - min) + min;

    // Ball 클래스
    class Ball {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = random(-2, 2); // X축 속도
        this.dy = random(-2, 2); // Y축 속도
        this.offsets = Array.from({ length: 20 }, () => random(-5, 5)); // 각 점의 오프셋
        this.angle = random(0, Math.PI * 2); // 초기 각도
        this.angleSpeed = random(0.01, 0.03); // 각도 변화 속도
      }

      draw() {
        const points = 20; // 공 외곽선 점의 개수
        const step = (Math.PI * 2) / points;
        const positions = [];

        // 점 좌표 계산
        for (let i = 0; i < points; i++) {
          const theta = step * i + this.angle;
          const offset =
            Math.sin(theta + this.angle) *
            this.offsets[i % this.offsets.length];
          const x = this.x + (this.radius + offset) * Math.cos(theta);
          const y = this.y + (this.radius + offset) * Math.sin(theta);
          positions.push({ x, y });
        }

        // 외곽선을 Bezier Curve로 부드럽게 그리기
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        for (let i = 0; i < positions.length; i++) {
          const next = positions[(i + 1) % positions.length]; // 다음 점
          const control = positions[(i + 2) % positions.length]; // 제어 점
          const cx = (positions[i].x + next.x) / 2;
          const cy = (positions[i].y + next.y) / 2;
          ctx.quadraticCurveTo(positions[i].x, positions[i].y, cx, cy);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // 벽 충돌 처리
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        // 유기체 효과 각도 업데이트
        this.angle += this.angleSpeed;

        this.draw();
      }
    }

    // 공 배열 초기화
    for (let i = 0; i < numBalls; i++) {
      const radius = random(30, 60);
      const x = random(radius, canvas.width - radius);
      const y = random(radius, canvas.height - radius);
      const color = `rgba(${random(100, 255)}, ${random(100, 255)}, ${random(
        100,
        255
      )}, 0.8)`;
      balls.push(new Ball(x, y, radius, color));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach((ball) => ball.update());
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ display: "block", margin: "auto" }} />
  );
};

export default OrganicBallAnimation;
