import React, { useEffect, useRef, useState } from "react";

function JellyAnimation4() {
  const canvasRef = useRef(null);
  const [selectedJelly, setSelectedJelly] = useState(null);

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

    // 젤리(GIF) 객체 생성
    class Jelly {
      constructor(x, y, size, src, text, longtext) {
        this.x = x;
        this.y = y;
        this.size = size; // GIF 크기
        this.src = src; // GIF 경로
        this.text = text;
        this.longtext = longtext;
        this.dx = random(-2, 2); // X 방향 속도
        this.dy = random(-2, 2); // Y 방향 속도
        this.angle = random(0, Math.PI * 2); // 구불구불 움직임 각도

        // 이미지 로드
        this.image = new Image();
        this.image.src = this.src;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 구불구불 움직이는 효과
        const waveX = Math.sin(this.angle) * 10;
        const waveY = Math.cos(this.angle) * 10;

        // GIF 이미지 그리기
        ctx.drawImage(
          this.image,
          waveX - this.size / 2,
          waveY - this.size / 2,
          this.size,
          this.size
        );

        // 텍스트 그리기
        ctx.fillStyle = "black";
        ctx.font = `${this.size / 5}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, waveX, waveY);

        ctx.restore();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;
        this.angle += 0.05; // 각도 변화로 구불구불 애니메이션 생성

        // 제한된 공간 내에서 충돌 처리
        if (this.x + this.size > areaX + areaWidth || this.x < areaX) {
          this.dx = -this.dx;
        }
        if (this.y + this.size > areaY + areaHeight || this.y < areaY) {
          this.dy = -this.dy;
        }

        this.draw();
      }

      isClicked(mouseX, mouseY) {
        const dist = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return dist <= this.size / 2;
      }
    }

    // 젤리(GIF) 초기화
    const gifPaths = [
      "/image/젤리아이_상단_젤.png",
      "/image/젤리아이_상단_리.png",
      "/image/젤리아이_상단_아.png",
      "/image/젤리아이_상단_이.png",
    ];
    const texts = ["젤", "리", "아", "이"];
    const longtexts = [
      "검색포털",
      "에이전트",
      "멀티모달",
      "글로벌 AI 허브, AI 포털 서비스",
    ];
    for (let i = 0; i < numJellies; i++) {
      const size = random(80, 120);
      const x = random(areaX + size, areaX + areaWidth - size);
      const y = random(areaY + size, areaY + areaHeight - size);
      const src = gifPaths[i];
      const text = texts[i];
      const longtext = longtexts[i];
      jellyArray.push(new Jelly(x, y, size, src, text, longtext));
    }

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!selectedJelly) {
        // 제한된 공간 그리기
        ctx.strokeStyle = "black";
        ctx.strokeRect(areaX, areaY, areaWidth, areaHeight);

        // 젤리(GIF) 업데이트
        jellyArray.forEach((jelly) => jelly.update());
      } else {
        // 선택된 젤리의 색으로 제한된 공간 채우기
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(areaX, areaY, areaWidth, areaHeight);

        // 중앙 텍스트 표시
        ctx.fillStyle = "white";
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

          // 2초 후 상태 초기화
          setTimeout(() => {
            setSelectedJelly(null);
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

export default JellyAnimation4;
