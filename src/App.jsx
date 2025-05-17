import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from './Scene';

export default function App() {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 1.5, 3], fov: 50 }}
    >
      {/* ambient + directional light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {/* your model + click logic */}
      <Scene />
      {/* orbit/pan/zoom controls */}
      <OrbitControls />
    </Canvas>
  );
}
