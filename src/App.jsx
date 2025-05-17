import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import Scene from './Scene';

// kick off model preload
useGLTF.preload('/models/submerged_era/scene.gltf');

export default function App() {
  const bgMusic = useRef(null);
  const [started, setStarted] = useState(false);

  // create the Audio object once
  useEffect(() => {
    bgMusic.current = new Audio('/sounds/Beautiful_Cherry_Blossom.mp3');
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.25;
  }, []);

  // this *must* run as part of a click handler
  const handleStartMusic = () => {
    if (!started && bgMusic.current) {
      bgMusic.current.play()
        .then(() => setStarted(true))
        .catch(err => console.warn('Playback prevented:', err));
    }
  };

  return (
    // full-screen wrapper catches your first click
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
      onClick={handleStartMusic}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0.02, 0.52, 0.17], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <group position={[-0.06, 0, 0.02]}>
          <Scene />
        </group>
        <OrbitControls
          onChange={(e) => {
            const { x, y, z } = e.target.object.position;
            console.log('Camera position:', x.toFixed(2), y.toFixed(2), z.toFixed(2));
          }}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}
