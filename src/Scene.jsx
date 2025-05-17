import React, { Suspense, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Scene() {
  const { scene } = useGLTF('/models/submerged_era/scene.gltf');

  // 1) Turn off raycasting on these meshes
  useEffect(() => {
    ['Object_719', 'Object_713'].forEach((name) => {
      const obj = scene.getObjectByName(name);
      if (obj) obj.raycast = () => {};
    });
  }, [scene]);

  // 2) Define your click‐to‐sound groups
  const audioGroups = useMemo(() => ([
    {
      names: new Set(['Object_25', 'Object_71', 'Object_900']),
      audio: new Audio('public/sounds/Nyan Cat! [Official].mp3')
    },
    {
      names: new Set(['Object_42', 'Object_99']),
      audio: new Audio('public/sounds/Nyan Cat! [Official].mp3')
    },
    // …add more groups as needed
  ]), []);

  // 3) Click handler looks up which group the clicked name lives in
  const handleClick = e => {
    e.stopPropagation();
    const name = e.object.name;
    console.log('Clicked on:', name);

    for (let group of audioGroups) {
      if (group.names.has(name)) {
        group.audio.currentTime = 0;
        group.audio.play()
          .catch(err => console.warn('Audio play failed:', err));
        return;   // stop after the first match
      }
    }
    console.log('No audio mapped for this object.');
  };

  return (
    <Suspense fallback={null}>
      <group onPointerDown={handleClick}>
        <primitive object={scene} />
      </group>
    </Suspense>
  );
}
