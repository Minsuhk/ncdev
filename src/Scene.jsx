// Scene.jsx
import React, { Suspense, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import './Scene.css'

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
      //Clickable head
      names: new Set(['Object_25', 'Object_33', 'Object_30', 'Object_28', 
                      'Object_39', 'Object_36', 'Object_26']),
      audio: new Audio('/sounds/cat.mp3')
    },
    {
      //Clickable boat
      names: new Set(['Object_547', 'Object_553', 'Object_550', 'Object_6', 
                      'Object_9', 'Object_544', 'Object_541', 'Object_10', 
                      'Object_548', 'Object_547', 'Object_551', 'Object_554', 
                      'Object_542', 'Object_7', 'Object_301']),
      audio: new Audio('/sounds/cat.mp3')
    },
        {
      //Clickable clock_tower
      names: new Set(['Object_12']),
      audio: new Audio('/sounds/cat.mp3')
    },
  ]), []);

  // 2a) Combine all interactive names into one set for hover checks
  const hoverNames = useMemo(() => {
    const all = new Set();
    audioGroups.forEach(g => g.names.forEach(n => all.add(n)));
    return all;
  }, [audioGroups]);

  // 3) Click handler — now logs object number
  const handleClick = e => {
    e.stopPropagation();
    const fullName = e.object.name;                // e.g. "Object_25"
    const match    = fullName.match(/\d+/);         // extract digits
    const number   = match ? match[0] : 'N/A';
    console.log(`Clicked object number: ${number}`);

    for (let group of audioGroups) {
      if (group.names.has(fullName)) {
        group.audio.currentTime = 0;
        group.audio.play().catch(() => {});
        return;
      }
    }
  };

  // 4) Hover handlers toggle cursor class
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