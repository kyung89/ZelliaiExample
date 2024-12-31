import { Physics, useBox } from "@react-three/cannon";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

function Jelly({ position }) {
  const ref = useRef(null);

  // 물리 엔진 적용
  const [physicsRef] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 1],
    velocity: [
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
    ],
  }));

  // 젤리 회전 애니메이션 추가
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <RoundedBox
      ref={physicsRef} // 물리 엔진과 연결
      args={[1, 1, 1]} // 너비, 높이, 깊이
      radius={0.2} // 모서리 둥글기
      smoothness={4} // 모서리 품질
      castShadow
    >
      <meshPhysicalMaterial
        ref={ref}
        color="orange"
        roughness={0.2} // 표면 거칠기
        transmission={0.7} // 투명도
        thickness={0.5} // 두께
        clearcoat={0.6} // 반짝이는 표면
        clearcoatRoughness={0.1}
      />
    </RoundedBox>
  );
}

function Scene() {
  const positions = [
    [0, 1, 0],
    [1, -2, 1],
    [-1, 0, -2],
    [2, 1, -1],
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} castShadow />
      {positions.map((position, index) => (
        <Jelly key={index} position={position} />
      ))}
      {/* 바닥 */}
      <mesh receiveShadow position={[0, -5, 0]}>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </>
  );
}

export default function App() {
  return (
    <Canvas shadows style={{ height: "100vh" }}>
      <OrbitControls />
      <Physics
        gravity={[0, 0, 0]}
        defaultContactMaterial={{ restitution: 0.8 }}
      >
        <Scene />
      </Physics>
    </Canvas>
  );
}
