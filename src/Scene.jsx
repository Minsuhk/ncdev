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

  // 2) Define your click-to-sound groups
  const audioGroups = useMemo(() => ([
    {
      names: new Set(['Object_25', 'Object_71', 'Object_900']),
      audio: new Audio('/sounds/cat.mp3')
    },
    {
      names: new Set(['Object_42', 'Object_99']),
      audio: new Audio('/sounds/cat.mp3')
    },
  ]), []);

  // 2a) Combine all interactive names into one set for easy hover checks
  const hoverNames = useMemo(() => {
    const all = new Set();
    audioGroups.forEach(g => g.names.forEach(n => all.add(n)));
    return all;
  }, [audioGroups]);

  // 3) Click handler (unchanged)
  const handleClick = e => {
    e.stopPropagation();
    const name = e.object.name;
    for (let group of audioGroups) {
      if (group.names.has(name)) {
        group.audio.currentTime = 0;
        group.audio.play().catch(() => {});
        return;
      }
    }
  };

  // 4) Hover handlers toggle the CSS class
  const handlePointerOver = e => {
    e.stopPropagation();
    if (hoverNames.has(e.object.name)) {
      document.body.classList.add('custom-cursor');
    }
  };
  const handlePointerOut = e => {
    e.stopPropagation();
    if (hoverNames.has(e.object.name)) {
      document.body.classList.remove('custom-cursor');
    }
  };

  return (
    <Suspense fallback={null}>
      <group
        onPointerDown={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={scene} />
      </group>
    </Suspense>
  );
}