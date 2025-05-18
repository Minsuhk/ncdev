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
      names: new Set(['Object_25','Object_33','Object_30','Object_28','Object_39','Object_36','Object_26', 'Object_42']),
      title: 'Projects 💻',
      content: ''
    },
    {
      names: new Set(['Object_547','Object_553','Object_550','Object_6','Object_9','Object_544','Object_541','Object_10','Object_548','Object_551','Object_554','Object_542','Object_7','Object_301']),
      title: 'About Me',
      content: ''
    },
    {
      names: new Set(['Object_12']),
      title: 'Experience',
      content: ''
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
      image: '/assets/images/Firefly_13.jpg',
      technologies: 'Tech: HTML, CSS, React, Vite, and more!',
      description: 'What did you say?/n What could that possibly mean?',
      link: 'https://github.com/ricardogrm02/Sentimax'
    },
    {
      title: 'PokeCheck Website',
      image: '/assets/images/pokeball.png',
      technologies: 'Tech: HTML, CSS, JS, PokeAPI',
      description: "Gotta check 'em all, gotta check 'em all!/n Check on your fav Pokemon on any browser!",
      link: 'https://github.com/Minsuhk/PokedexWebsite'
    },
    {
      title: 'CSUF Food Review App',
      image: '/assets/images/csuf_tuffy.png',
      technologies: 'Tech: Swift, Firebase, XCode',
      description: 'Feeling hungry at CSUF? Use this app!',
      link: 'https://github.com/CSUF-CPSC223W-2022S/project-group-9'
    },
    {
      title: 'React Personal Website',
      image: '/assets/images/React.png',
      technologies: 'Tech: HTML, CSS, React, Vite',
      description: 'A website all about me!',
      link: 'https://github.com/Minsuhk/nickchungdev'
    },
    {
      title: 'Fruit Catching Game',
      image: '/assets/images/farmer.png',
      technologies: 'Tech: C#, Unity',
      description: 'Gotta save the cute fruits to save the farm!',
      link: 'https://github.com/Minsuhk/Happy-Farm-Game'
    },
    {
      title: 'T-Rex AI Model',
      image: '/assets/images/trex.png',
      technologies: 'Tech: Python, HTML, CSS',
      description: "If we can't get a score of 1000 on the Google T-Rex game, then AI will do it for us!",
      link: 'https://github.com/JustinLieng/CPSC-481-Dino-AI'
    },
    {
      title: 'Moyai Game info Website',
      image: '/assets/images/moyai.png',
      technologies: 'Tech: HTML, CSS, JS, Flask, MongoDB, YouTube API, SteamAPI',
      description: 'The one-stop site for all your game info needs!',
      link: 'https://github.com/HunterBendel/Moyai'
    },
  ];

  const aboutItems = [
    {
      title: '',
      image: '/assets/images/casual_picture_2.jpg',
      technologies: '',
      description: "Hi, you found me. I'm Nicholas from SoCal. Get ready to have some fun with my code 🫡.",
      contacts: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/nicholasmchung/', icon: '/assets/images/icons8-linkedin.svg' },
        { type: 'github',   url: 'https://github.com/Minsuhk',  icon: '/assets/images/icons8-github.svg'   },
        { type: 'email',    url: 'mailto: nicholasmchung@gmail.com',      icon: '/assets/images/icons8-email-100.png'    },
      ]
    },
    {
      title: 'Skills',
      image: '',
      technologies: '',
      description: '',
      skills: [
        'R', 'C#', 'C++',
        'Git', 'HTML5', 'CSS3',
        'Swift', 'React', 'Flask',
        'Python', 'JavaScript', 'In-Line x86 ASM'
      ]
    },
  ];

  const experienceItems = [
    {
      title: 'Supplemental Instructor',
      technologies: '',
      description: [
        '• Provided support for students by hosting bi-weekly study sessions, reinforcing concepts and challenging topics.',
        '• Simplified C++ topics through group activities and coding exercises, aiding student success.',
        '• Created reusable lesson plans and activities for use by current and future supplemental instructors.',
        '• Developed strong communication and teaching skills, honing time management and adaptability.'
      ],
      link: ''
    },
    {
      title: 'The Coder School Tutor',
      technologies: '',
      description:  [
        "• Instructed aspiring game developers through hands-on coding with Scratch, fostering knowledge in game dev.",
        "• Facilitated one-on-one coding sessions for K-12 students, improving understanding of programming concepts.",
        "• Constructed engaging lesson plans to captivate students' interest, ensuring an enjoyable learning experience.",
        "• Enhanced personalized instruction through collaborative efforts with fellow tutors, incorporating valuable insights from both students and peers' feedback."
      ],
      link: ''
    },
    {
      title: 'Computer Science Grader',
      technologies: '',
      description: [
        "• Evaluated and scored 250+ AI and OOP programming assignments each semester, ensuring consistent application of rubric criteria and rapid turnaround of feedback.",
        "• Designed and maintained automated test suites for core algorithms and object-oriented design exercises, cutting manual validation time by 30%.",
        "• Partnered with course instructors to refine grading rubrics and lab exercises, clarifying expectations and boosting student satisfaction scores by 15%.", 
        "• Identified and resolved code defects that improved average student code quality by 20%."
      ],
      link: ''
    },
    // …add more experience entries as needed…
  ];

  // simple carousel component
function ProjectCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((index + items.length - 1) % items.length);
  const next = () => setIndex((index + 1) % items.length);
  const item = items[index];

  // decide what to render below the text
  let body = null;
  if (item.contacts) {
    body = (
      <div className="contact-icons">
        {item.contacts.map(c => (
          <a key={c.type} href={c.url} target="_blank" rel="noopener noreferrer">
            <img src={c.icon} alt={c.type} className="contact-icon" />
          </a>
        ))}
      </div>
    );
  } else if (item.skills) {
    body = (
      <div className="skills-flex">
        {item.skills.map(s => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
      </div>
    );
  } else if (item.link) {
    // only projects have `link`, so "Learn More" only appears in the Projects carousel
    body = (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="learn-more">
        Learn More
      </a>
    );
  }

  return (
    <div className="carousel">
      <button className="carousel-nav" onClick={prev}>‹</button>
      <div className="carousel-item">
        <h3>{item.title}</h3>
        {item.image && (
          <img src={item.image} alt={item.title} className="carousel-image" />
        )}
        {item.technologies && (
          <p className="carousel-tech">{item.technologies}</p>
        )}
        {item.description && (
          Array.isArray(item.description)
            ? item.description.map((line, i) => (
                <p key={i} className="carousel-desc">{line}</p>
              ))
            : <p className="carousel-desc">{item.description}</p>
        )}
        {body}
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
              {popupGroup.title === 'Projects 💻' && (
                <ProjectCarousel items={projectItems} />
              )}
              {popupGroup.title === 'About Me' && (
                <ProjectCarousel items={aboutItems} />
              )}
              {popupGroup.title === 'Experience' && (
                <ProjectCarousel items={experienceItems} />
              )}
              {(popupGroup.title !== 'Projects 💻' &&
                popupGroup.title !== 'About Me' &&
                popupGroup.title !== 'Experience') && (
                <p className="popup-content">{popupGroup.content}</p>
              )}
            </div>
          </div>
        </Html>
      )}
    </>
  );
}
