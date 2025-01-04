import React, { useEffect, useRef, useState } from "react";

function JellyAnimationTemp() {
  const canvasRef = useRef(null);
  const [selectedJelly, setSelectedJelly] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정
    canvas.width = 800;
    canvas.height = 500;

    // 제한된 공간 정의
    const areaWidth = 800;
    const areaHeight = 400;
    const areaX = (canvas.width - areaWidth) / 2;
    const areaY = (canvas.height - areaHeight) / 2;

    const jellyArray = [];
    const numJellies = 4;

    const random = (min, max) => Math.random() * (max - min) + min;

    // 젤리 객체 생성
    class Jelly {
      constructor(x, y, radius, color, text, longtext) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.longtext = longtext;
        this.dx = random(-1, 1); // X 방향 속도
        this.dy = random(-1, 1); // Y 방향 속도
        this.elasticity = random(0.8, 1.2); // 탄성 효과
        this.offset = 0; // 젤리의 진동 효과
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 부드럽고 둥근 젤리 모양
        ctx.beginPath();
        for (let i = 0; i <= Math.PI * 2; i += Math.PI / 20) {
          const offset =
            this.radius + Math.sin(this.offset + i * 3) * this.radius * 0.1; // 탄성 변형
          const x = Math.cos(i) * offset;
          const y = Math.sin(i) * offset;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        // 반투명 젤리 색상
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8; // 투명도
        ctx.fill();

        // 하이라이트 효과
        ctx.beginPath();
        ctx.arc(
          -this.radius * 0.3,
          -this.radius * 0.3,
          this.radius * 0.5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();

        // 텍스트 그리기
        ctx.fillStyle = "black";
        ctx.globalAlpha = 1.0; // 텍스트는 불투명
        ctx.font = `${this.radius / 2.5}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, 0, 0); // 젤리의 중심에 텍스트 배치

        ctx.restore();
      }
      update() {
        this.x += this.dx;
        this.y += this.dy;
        this.offset += 0.1;

        // 제한된 공간 내에서 충돌 처리
        if (
          this.x + this.radius > areaX + areaWidth ||
          this.x - this.radius < areaX
        ) {
          this.dx = -this.dx * this.elasticity;
        }
        if (
          this.y + this.radius > areaY + areaHeight ||
          this.y - this.radius < areaY
        ) {
          this.dy = -this.dy * this.elasticity;
        }

        this.draw();
      }

      isClicked(mouseX, mouseY) {
        const dist = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return dist <= this.radius;
      }
    }

    // 젤리 초기화
    const colors = [
      "rgba(0, 255, 0, 0.8)",
      "rgba(255, 165, 0, 0.8)",
      "rgba(255, 0, 0, 0.8)",
      "rgba(0, 0, 255, 0.8)",
    ];
    const texts = ["젤", "리", "아", "이"];
    const longtexts = [
      "검색포털",
      "에이전트",
      "멀티모달",
      "글로벌 AI 허브, AI 포털 서비스",
    ];
    for (let i = 0; i < numJellies; i++) {
      const radius = random(50, 80);
      const x = random(areaX + radius, areaX + areaWidth - radius);
      const y = random(areaY + radius, areaY + areaHeight - radius);
      const color = colors[i];
      const text = texts[i];
      const longtext = longtexts[i];
      jellyArray.push(new Jelly(x, y, radius, color, text, longtext));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!selectedJelly) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(areaX, areaY, areaWidth, areaHeight);

        jellyArray.forEach((jelly) => jelly.update());
      } else {
        ctx.fillStyle = selectedJelly.color;
        ctx.fillRect(areaX, areaY, areaWidth, areaHeight);

        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          selectedJelly.longtext,
          canvas.width / 2,
          canvas.height / 2
        );
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (const jelly of jellyArray) {
        if (jelly.isClicked(mouseX, mouseY)) {
          setSelectedJelly(jelly);
          setTimeout(() => setSelectedJelly(null), 2000);
          break;
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [selectedJelly]);

  return (
    <>
      <div>
        젤리의 형태가 변형되는 젤리아이 애니메이션입니다. 젤리를 누르면 배너가
        뜹니다.
      </div>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </>
  );
}

export default JellyAnimationTemp;
