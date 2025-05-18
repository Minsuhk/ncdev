// Scene.jsx
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import './Scene.css';

export default function Scene() {
  const { scene } = useGLTF('/models/submerged_era/scene.gltf');
  const [popupGroup, setPopupGroup] = useState(null);

  // disable water raycasts
  useEffect(() => {
    ['Object_719','Object_713'].forEach(name => {
      const o = scene.getObjectByName(name);
      if (o) o.raycast = () => {};
    });
  }, [scene]);

  // define your clickable groups
  const groups = useMemo(() => [
    {
      names: new Set(['Object_25','Object_33','Object_30','Object_28','Object_39','Object_36','Object_26']),
      title: 'Projects 💻',
      content: '' // we'll replace this with the carousel
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

  // flat set for hover detection
  const hoverNames = useMemo(() => {
    const s = new Set();
    groups.forEach(g => g.names.forEach(n => s.add(n)));
    return s;
  }, [groups]);

  // helper to set canvas cursor
  function setCanvasCursor(c) {
    const cvs = document.querySelector('canvas');
    if (cvs) cvs.style.cursor = c;
  }

  // click: open matching popup
  function handleClick(e) {
    e.stopPropagation();
    let m = e.object;
    while (m && !hoverNames.has(m.name)) m = m.parent;
    if (!m) return;
    const g = groups.find(g => g.names.has(m.name));
    if (g) setPopupGroup(g);
  }

  // hover => custom cursor
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

  function closePopup() {
    setPopupGroup(null);
    setCanvasCursor('auto');
  }

  // your project items
  const projectItems = [
    {
      title: 'Sentimax',
      image: 'public/assets/images/Firefly_13.jpg',
      technologies: 'Tech: HTML, CSS, React, Vite, and more!',
      description: 'What did you say?\n What could that possibly mean?',
      link: 'https://github.com/ricardogrm02/Sentimax'
    },
    {
      title: 'PokeCheck Website',
      image: 'public/assets/images/pokeball.png',
      technologies: 'Tech: HTML, CSS, JS, PokeAPI',
      description: "Gotta check 'em all, gotta check 'em all!\n Check on your fav Pokemon on any browser!",
      link: 'https://github.com/Minsuhk/PokedexWebsite'
    },
    {
      title: 'CSUF Food Review App',
      image: 'public/assets/images/csuf_tuffy.png',
      technologies: 'Tech: Swift, Firebase, XCode',
      description: 'Feeling hungry at CSUF? Use this app!',
      link: 'https://github.com/CSUF-CPSC223W-2022S/project-group-9'
    },
    {
      title: 'React Personal Website',
      image: 'public/assets/images/React.png',
      technologies: 'Tech: HTML, CSS, React, Vite',
      description: 'A website all about me!',
      link: 'https://github.com/Minsuhk/nickchungdev'
    },
    {
      title: 'Fruit Catching Game',
      image: 'public/assets/images/farmer.png',
      technologies: 'Tech: C#, Unity',
      description: 'Gotta save the cute fruits to save the farm!',
      link: 'https://github.com/Minsuhk/Happy-Farm-Game'
    },
    {
      title: 'T-Rex AI Model',
      image: 'public/assets/images/trex.png',
      technologies: 'Tech: Python, HTML, CSS',
      description: "If we can't get a score of 1000 on the Google T-Rex game, then AI will do it for us!",
      link: 'https://github.com/JustinLieng/CPSC-481-Dino-AI'
    },
    {
      title: 'Moyai Game info Website',
      image: 'public/assets/images/moyai.png',
      technologies: 'Tech: HTML, CSS, JS, Flask, MongoDB, YouTube API, SteamAPI',
      description: 'The one-stop site for all your game info needs!',
      link: 'https://github.com/HunterBendel/Moyai'
    },
    // add more...
  ];

  // simple carousel component
  function ProjectCarousel({ items }) {
    const [index, setIndex] = useState(0);
    const prev = () => setIndex((index + items.length - 1) % items.length);
    const next = () => setIndex((index + 1) % items.length);
    const item = items[index];

    return (
      <div className="carousel">
        <button className="carousel-nav" onClick={prev}>‹</button>
        <div className="carousel-item">
          <h3>{item.title}</h3>
          <img src={item.image} alt={item.title} className="carousel-image" />
          <p className="carousel-tech">{item.technologies}</p>
          <p className="carousel-desc">{item.description}</p>
          <a href={item.link} target="_blank" rel="noopener noreferrer">Learn More</a>
        </div>
        <button className="carousel-nav" onClick={next}>›</button>
      </div>
    );
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
              {popupGroup.title === 'Projects 💻' ? (
                <ProjectCarousel items={projectItems} />
              ) : (
                <p className="popup-content">{popupGroup.content}</p>
              )}
            </div>
          </div>
        </Html>
      )}
    </>
  );
}
