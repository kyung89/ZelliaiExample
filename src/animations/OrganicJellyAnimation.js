import { useEffect, useRef } from "react";

function OrganicJellyAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800; // 화면 너비
    canvas.height = 300; // 화면 높이

    // 제한된 영역 정의
    const areaWidth = 800;
    const areaHeight = 300;
    const areaX = (canvas.width - areaWidth) / 2;
    const areaY = (canvas.height - areaHeight) / 2;

    const jellyArray = [];
    const numJellies = 4;

    // 초기 고정 위치
    const fixedPositions = [
      { x: 200, y: 150 },
      { x: 400, y: 150 },
      { x: 200, y: 250 },
      { x: 500, y: 250 },
    ];

    // 랜덤 숫자 생성 함수
    const random = (min, max) => Math.random() * (max - min) + min;

    // 유기체 젤리 클래스
    class Jelly {
      constructor(x, y, radius, color, text) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.dx = random(-1, 1.5);
        this.dy = random(-1, 1.5);
        this.offsets = Array.from({ length: 50 }, () => random(-10, 10)); // 유기체 파형 오프셋
        this.angle = random(0, Math.PI * 2);
        this.angleSpeed = random(0.001, 0.005);
        this.isMerging = false; // 융합 상태
        this.mergeProgress = 0; // 융합 진행도
      }

      draw() {
        const points = 20; // 외곽선을 그릴 점의 개수
        const step = (Math.PI * 2) / points;
        const positions = [];

        // 점 위치 계산
        for (let i = 0; i < points; i++) {
          const theta = step * i + this.angle;
          const offset =
            Math.sin(theta + this.angle) *
            this.offsets[i % this.offsets.length] *
            (1 - this.mergeProgress); // 융합 시 파형 감소
          const x = this.x + (this.radius + offset) * Math.cos(theta);
          const y = this.y + (this.radius + offset) * Math.sin(theta);
          positions.push({ x, y });
        }

        // 외곽선을 부드럽게 그리기 (Bezier Curve)
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        for (let i = 0; i < positions.length; i++) {
          const current = positions[i];
          const next = positions[(i + 1) % positions.length];
          const control = {
            x: (current.x + next.x) / 2,
            y: (current.y + next.y) / 2,
          };
          ctx.quadraticCurveTo(current.x, current.y, control.x, control.y);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // 텍스트 그리기
        ctx.font = `${this.radius / 3}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x, this.y);
      }

      update() {
        if (this.isMerging) {
          // 융합 진행 중
          this.mergeProgress += 0.05;
          if (this.mergeProgress >= 1) {
            this.isMerging = false;
            this.mergeProgress = 0;
          }
        } else {
          // 일반 이동
          this.x += this.dx;
          this.y += this.dy;

          // 벽 충돌 처리 (화면 영역 경계)
          if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.dx *= -1; // X 방향 반전
          }
          if (
            this.y - this.radius < 0 ||
            this.y + this.radius > canvas.height
          ) {
            this.dy *= -1; // Y 방향 반전
          }
        }

        // 유기체 각도 업데이트
        this.angle += this.angleSpeed;
        this.draw();
      }
    }

    // 젤리 배열 초기화
    const colors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(255, 206, 86, 0.6)",
    ];
    const texts = ["젤", "리", "아", "이"];

    fixedPositions.forEach((pos, i) => {
      const radius = random(35, 45); // 고정 크기
      const color = colors[i % colors.length];
      const text = texts[i % texts.length];
      jellyArray.push(new Jelly(pos.x, pos.y, radius, color, text));
    });

    // 충돌 감지 및 반발 처리
    const detectCollision = (jelly1, jelly2) => {
      const dx = jelly1.x - jelly2.x;
      const dy = jelly1.y - jelly2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < jelly1.radius + jelly2.radius && !jelly1.isMerging) {
        jelly1.isMerging = true;
        jelly2.isMerging = true;

        setTimeout(() => {
          // 속도 반전
          const angle = Math.atan2(dy, dx);
          const speed1 = Math.sqrt(jelly1.dx ** 2 + jelly1.dy ** 2);
          const speed2 = Math.sqrt(jelly2.dx ** 2 + jelly2.dy ** 2);

          jelly1.dx = speed2 * Math.cos(angle);
          jelly1.dy = speed2 * Math.sin(angle);
          jelly2.dx = speed1 * Math.cos(angle + Math.PI);
          jelly2.dy = speed1 * Math.sin(angle + Math.PI);

          jelly1.isMerging = false;
          jelly2.isMerging = false;
        }, 500); // 0.5초 동안 융합 상태 유지
      }
    };

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 제한된 영역 그리기
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.strokeRect(areaX, areaY, areaWidth, areaHeight);

      // 젤리 업데이트 및 충돌 처리
      jellyArray.forEach((jelly, index) => {
        jelly.update();

        for (let j = index + 1; j < jellyArray.length; j++) {
          detectCollision(jelly, jellyArray[j]);
        }
      });

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
}

export default OrganicJellyAnimation;
