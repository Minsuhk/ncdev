// App.jsx
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Vector3 } from 'three'
import Scene from './Scene'

// preload your model
useGLTF.preload('/models/submerged_era/scene.gltf')

function AnimatedCamera({ fov }) {
  const { camera } = useThree()
  // when the fov prop changes, update camera.fov and call updateProjectionMatrix()
  useEffect(() => {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [camera, fov])

  // capture the initial camera position once
  const initialPos = useRef(camera.position.clone())

  // three way-points (initial + two others)
  const waypoints = [
    initialPos.current,
    new Vector3(-0.17, 0.40, 0.34),  // second angle
    new Vector3(0.26, 0.43, 0.22)    // third angle
  ]

  // index of the current target
  const [idx, setIdx] = useState(0)

  // every 10 seconds, move to the next waypoint
  useEffect(() => {
    const handle = setInterval(() => {
      setIdx(i => (i + 1) % waypoints.length)
    }, 10000)
    return () => clearInterval(handle)
  }, [waypoints.length])

  // on each frame, lerp toward the current waypoint
  useFrame((_, delta) => {
    camera.position.lerp(waypoints[idx], delta * 0.2)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function App() {
  const bgMusic = useRef(null)
  const [started, setStarted] = useState(false)
  const [fov, setFov] = useState(50)

  // decide FOV based on current window width
  const updateFovBasedOnWidth = () => {
    const w = window.innerWidth
    if (w <= 320) {
      setFov(100)      // ultra-small screens
    } else if (w <= 480) {
      setFov(85)      // phone
    } else if (w <= 800) {
      setFov(75)      // tablet / medium
    } else if (w <= 1280) {
      setFov(65)      // tablet / medium
    }
    else {
      setFov(50)      // desktop / large
    }
  }

  useEffect(() => {
    // initial FOV determination
    updateFovBasedOnWidth()
    // listen for resize events
    window.addEventListener('resize', updateFovBasedOnWidth)
    return () => window.removeEventListener('resize', updateFovBasedOnWidth)
  }, [])

  useEffect(() => {
    bgMusic.current = new Audio('/sounds/Beautiful_Cherry_Blossom.mp3')
    bgMusic.current.loop = true
    bgMusic.current.volume = 0.1
  }, [])

  const handleStartMusic = () => {
    if (!started && bgMusic.current) {
      bgMusic.current.play().then(() => setStarted(true))
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }} onClick={handleStartMusic}>
      <Canvas camera={{ position: [0.02, 0.52, 0.17], fov }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <group position={[-0.06, 0, 0.025]}>
          <Scene />
        </group>

        {/* drives the passive camera movement, now also respects dynamic fov */}
        <AnimatedCamera fov={fov} />

        {/* OrbitControls disabled so user can’t override the auto‐camera */}
        <OrbitControls enabled={false} />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.5}
            height={300}
            intensity={1.5}
          />
        </EffectComposer>

        {/* preload all assets */}
        <primitive object={Scene} />
      </Canvas>
    </div>
  )
}
