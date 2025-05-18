import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import './Scene.css';

export default function Scene() {
  const { scene } = useGLTF('/models/submerged_era/scene.gltf');
  // which group was clicked? null = no popup
  const [popupGroup, setPopupGroup] = useState(null);

  // disable water
  useEffect(() => {
    ['Object_719','Object_713'].forEach(name => {
      const o = scene.getObjectByName(name);
      if (o) o.raycast = () => {};
    });
  }, [scene]);

  // your clickable groups with titles/content
  const groups = useMemo(() => [
    {
      names: new Set(['Object_25','Object_33','Object_30','Object_28','Object_39','Object_36','Object_26']),
      title: 'Gundam Head',
      content:  'This is the Gundam’s head, submerged underwater as part of the scene.'

    },
    {
      names: new Set(['Object_547','Object_553','Object_550','Object_6','Object_9','Object_544','Object_541','Object_10','Object_548','Object_551','Object_554','Object_542','Object_7','Object_301']),
      title: 'Floating Boat',
      content: 'A small vessel that gently bobs on the water’s surface.'
    },
    {
      names: new Set(['Object_12']),
      title: 'Clock Tower',
      content: 'A tall clock tower marking the passage of time.'
    }
  ], []);

  // flat set for hover
  const hoverNames = useMemo(() => {
    const s = new Set();
    groups.forEach(g => g.names.forEach(n => s.add(n)));
    return s;
  }, [groups]);

  // helper to change canvas cursor
  function setCanvasCursor(c) {
    const cvs = document.querySelector('canvas');
    if (cvs) cvs.style.cursor = c;
  }

  // click: find which group, open popup
  function handleClick(e) {
    e.stopPropagation();
    let m = e.object;
    while (m && !hoverNames.has(m.name)) m = m.parent;
    if (!m) return;
    const g = groups.find(g => g.names.has(m.name));
    if (g) setPopupGroup(g);
  }

  // hover in/out => pointer cursor
  function handlePointerOver(e) {
    e.stopPropagation();
    if (hoverNames.has(e.object.name)) {
      setCanvasCursor("url('https://cur.cursors-4u.net/anime/ani-3/ani308.cur'), auto");
    }
  }
  function handlePointerOut(e) {
    e.stopPropagation();
    if (hoverNames.has(e.object.name)) {
      setCanvasCursor('auto');
    }
  }

  // close popup
  function closePopup() {
    setPopupGroup(null);
    setCanvasCursor('auto');
  }

  return (
    <>
      <Suspense fallback={null}>
        <group
          onPointerDown={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <primitive object={scene} />
        </group>
      </Suspense>

      {popupGroup && (
        <Html fullscreen>
          <div className="popup-backdrop" onClick={closePopup}>
            <div className="popup-box" onClick={e => e.stopPropagation()}>
              <button className="popup-close" onClick={closePopup}>✕</button>
              <h2 className="popup-title">{popupGroup.title}</h2>
              <p className="popup-content">{popupGroup.content}</p>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}
