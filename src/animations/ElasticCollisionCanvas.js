import React, { useEffect, useRef } from "react";

const ElasticCollisionCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // Ball class
    class Ball {
      constructor(x, y, radius, dx, dy, mass, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.mass = mass;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
          this.dx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
          this.dy *= -1;
        }
      }
    }

    // Check collision between two balls
    const isColliding = (ball1, ball2) => {
      const dx = ball1.x - ball2.x;
      const dy = ball1.y - ball2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < ball1.radius + ball2.radius;
    };

    // Resolve collision using elastic collision equations
    const resolveCollision = (ball1, ball2) => {
      const dx = ball2.x - ball1.x;
      const dy = ball2.y - ball1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normal vector
      const normalX = dx / distance;
      const normalY = dy / distance;

      // Tangent vector
      const tangentX = -normalY;
      const tangentY = normalX;

      // Dot product of velocity and normal/tangent
      const dpNormal1 = ball1.dx * normalX + ball1.dy * normalY;
      const dpNormal2 = ball2.dx * normalX + ball2.dy * normalY;

      const dpTangent1 = ball1.dx * tangentX + ball1.dy * tangentY;
      const dpTangent2 = ball2.dx * tangentX + ball2.dy * tangentY;

      // Elastic collision response (normal components exchange velocities)
      const m1 = ball1.mass;
      const m2 = ball2.mass;

      const newNormal1 =
        (dpNormal1 * (m1 - m2) + 2 * m2 * dpNormal2) / (m1 + m2);
      const newNormal2 =
        (dpNormal2 * (m2 - m1) + 2 * m1 * dpNormal1) / (m1 + m2);

      ball1.dx = tangentX * dpTangent1 + normalX * newNormal1;
      ball1.dy = tangentY * dpTangent1 + normalY * newNormal1;
      ball2.dx = tangentX * dpTangent2 + normalX * newNormal2;
      ball2.dy = tangentY * dpTangent2 + normalY * newNormal2;
    };

    // Create balls
    const balls = [];
    for (let i = 0; i < 5; i++) {
      const radius = Math.random() * 20 + 10;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 4;
      const dy = (Math.random() - 0.5) * 4;
      const mass = radius; // Mass is proportional to radius
      const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`;
      balls.push(new Ball(x, y, radius, dx, dy, mass, color));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw balls
      for (let ball of balls) {
        ball.update();
        ball.draw();
      }

      // Check for collisions
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          if (isColliding(balls[i], balls[j])) {
            resolveCollision(balls[i], balls[j]);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black", display: "block", margin: "auto" }}
    />
  );
};

export default ElasticCollisionCanvas;
