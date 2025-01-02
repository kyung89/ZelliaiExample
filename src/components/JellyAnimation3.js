import React, { useEffect, useRef, useState } from "react";

function JellyAnimation3() {
  const canvasRef = useRef(null);
  const [selectedJelly, setSelectedJelly] = useState(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 캔버스 크기 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 제한된 공간 정의
    const areaWidth = 800; // 제한된 공간 너비
    const areaHeight = 600; // 제한된 공간 높이
    const areaX = (canvas.width - areaWidth) / 2; // 중앙 정렬
    const areaY = (canvas.height - areaHeight) / 2;

    const jellyArray = [];
    const numJellies = 4;

    // 랜덤 숫자 생성 함수
    const random = (min, max) => Math.random() * (max - min) + min;

    // 젤리 객체 생성
    class Jelly {
      constructor(x, y, radius, color, text, longtext) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.text = text; // 젤리 위에 표시할 텍스트
        this.dx = random(-3, 3); // X 방향 속도
        this.dy = random(-3, 3); // Y 방향 속도
        this.longtext = longtext;
      }

      draw() {
        // 젤리 그리기
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // 텍스트 그리기
        ctx.fillStyle = "black";
        ctx.font = `${this.radius / 2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x, this.y);
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // 제한된 공간 내에서 충돌 처리
        if (
          this.x + this.radius > areaX + areaWidth ||
          this.x - this.radius < areaX
        ) {
          this.dx = -this.dx;
        }
        if (
          this.y + this.radius > areaY + areaHeight ||
          this.y - this.radius < areaY
        ) {
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
    const colors = ["green", "orange", "red", "blue"]; // 초록, 노랑, 분홍, 파랑
    const texts = ["젤", "리", "아", "이"];
    const longtexts = [
      "검색포털",
      "에이전트",
      "멀티모달",
      "글로벌 AI 허브, AI 포털 서비스",
    ];
    for (let i = 0; i < numJellies; i++) {
      const radius = random(30, 50);
      const x = random(areaX + radius, areaX + areaWidth - radius);
      const y = random(areaY + radius, areaY + areaHeight - radius);
      const color = colors[i];
      const text = texts[i];
      const longtext = longtexts[i];
      jellyArray.push(new Jelly(x, y, radius, color, text, longtext));
    }

    // 애니메이션 루프
    const animate = () => {
      if (!selectedJelly) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 제한된 공간 그리기
        ctx.strokeStyle = "black";
        ctx.strokeRect(areaX, areaY, areaWidth, areaHeight);

        // 젤리 업데이트
        jellyArray.forEach((jelly) => jelly.update());
      } else {
        // 선택된 젤리의 색으로 제한된 공간 채우기
        ctx.fillStyle = selectedJelly.color;
        ctx.fillRect(areaX, areaY, areaWidth, areaHeight);

        // 중앙 텍스트 표시
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

    // 젤리 클릭 이벤트 처리
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (const jelly of jellyArray) {
        if (jelly.isClicked(mouseX, mouseY)) {
          setSelectedJelly(jelly);
          setShowText(true);

          // 2초 후 상태 초기화
          setTimeout(() => {
            setSelectedJelly(null);
            setShowText(false);
          }, 2000);
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

export default JellyAnimation3;
