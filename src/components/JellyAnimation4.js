import React, { useEffect, useRef, useState } from "react";

function JellyAnimation4() {
  const canvasRef = useRef(null);
  const [selectedJelly, setSelectedJelly] = useState(null); // 선택된 젤리 정보
  const [expansion, setExpansion] = useState(0); // 색상 확장 반지름

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정
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
        ctx.fillStyle = "white";
        ctx.font = `${this.radius / 2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x, this.y);
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // 경계 충돌 처리
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.draw();
      }

      isClicked(mouseX, mouseY) {
        const dist = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return dist <= this.radius;
      }
    }

    // 젤리 초기화
    const colors = ["green", "yellow", "pink", "blue"];
    for (let i = 0; i < numJellies; i++) {
      const radius = random(30, 50);
      const x = random(radius, canvas.width - radius);
      const y = random(radius, canvas.height - radius);
      const color = colors[Math.floor(random(0, colors.length))];
      const text = `Jelly ${i + 1}`;
      jellyArray.push(new Jelly(x, y, radius, color, text));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (selectedJelly) {
        // 색상 서서히 퍼져나가기
        ctx.beginPath();
        ctx.arc(
          selectedJelly.x, // 클릭된 젤리의 X 좌표
          selectedJelly.y, // 클릭된 젤리의 Y 좌표
          expansion, // 확장 반지름
          0,
          Math.PI * 2
        );
        ctx.fillStyle = selectedJelly.color;
        ctx.fill();
        ctx.closePath();

        // 중앙 텍스트 표시
        if (expansion >= Math.max(canvas.width, canvas.height)) {
          ctx.fillStyle = "white";
          ctx.font = "50px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(selectedJelly.text, canvas.width / 2, canvas.height / 2);

          // 2초 후 초기화
          setTimeout(() => {
            setSelectedJelly(null);
            setExpansion(0);
          }, 2000);
        }
      } else {
        // 젤리 애니메이션
        jellyArray.forEach((jelly) => jelly.update());
      }

      requestAnimationFrame(animate);
    };

    animate();

    // 젤리 클릭 이벤트 처리
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (const jelly of jellyArray) {
        if (jelly.isClicked(mouseX, mouseY)) {
          setSelectedJelly(jelly);

          // 색상 확장 애니메이션 시작
          let radius = 0;
          const interval = setInterval(() => {
            radius += 20; // 확장 속도
            setExpansion(radius);

            if (radius >= Math.max(canvas.width, canvas.height)) {
              clearInterval(interval);
            }
          }, 16); // 60fps
          break;
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [selectedJelly]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

export default JellyAnimation4;
