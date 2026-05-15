'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, SpotLight } from '@react-three/drei'
import * as THREE from 'three'

// Free GLB models from KhronosGroup glTF-Sample-Assets
const MODELS = [
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    scale: 0.35,
    label: 'Helmet',
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb',
    scale: 0.003,
    label: 'Duck',
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoomBox/glTF-Binary/BoomBox.glb',
    scale: 25,
    label: 'BoomBox',
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Binary/Avocado.glb',
    scale: 8,
    label: 'Avocado',
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb',
    scale: 6,
    label: 'Bottle',
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb',
    scale: 1.5,
    label: 'Car',
  },
]

// Preload all models
MODELS.forEach((m) => useGLTF.preload(m.url))

function GLBModel({ url, scale, position, rotSpeed }: {
  url: string
  scale: number
  position: [number, number, number]
  rotSpeed: number
}) {
  const { scene } = useGLTF(url)
  const ref = useRef<THREE.Group>(null!)
  const cloned = useMemo(() => scene.clone(), [scene])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * rotSpeed
  })

  return <primitive ref={ref} object={cloned} position={position} scale={scale} />
}

function FallbackBox({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} />
    </mesh>
  )
}

function ShelfUnit({ z, side, row }: { z: number; side: 1 | -1; row: number }) {
  const x = side * 3.2
  const y = row === 0 ? -0.2 : 0.85

  const modelIndex = Math.abs(Math.floor(z / 3) * 2 + row + side) % MODELS.length
  const model = MODELS[modelIndex]
  const rotSpeed = 0.2 + (modelIndex * 0.07)

  return (
    <group position={[x, y, z]}>
      {/* Shelf board */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.04, 0.65]} />
        <meshStandardMaterial color="#111122" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Back panel */}
      <mesh position={[side * 0.72, 0.45, 0]}>
        <boxGeometry args={[0.04, 1.0, 0.65]} />
        <meshStandardMaterial color="#0a0a18" roughness={1} />
      </mesh>
      {/* Shelf edge glow strip */}
      <mesh position={[0, -0.02, 0.33]}>
        <boxGeometry args={[1.5, 0.02, 0.01]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1} />
      </mesh>
      {/* 3D product model */}
      <Suspense fallback={<FallbackBox position={[0, 0.25, 0]} />}>
        <GLBModel
          url={model.url}
          scale={model.scale}
          position={[0, 0.25, 0]}
          rotSpeed={rotSpeed}
        />
      </Suspense>
    </group>
  )
}

function StoreFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -15]} receiveShadow>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#080812" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Grid lines */}
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -i * 2.5 + 6]}>
          <planeGeometry args={[8, 0.015]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Side glowing lines */}
      {[-3.6, 3.6].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.19, -15]}>
          <planeGeometry args={[0.025, 60]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  )
}

function StoreCeiling() {
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -15]}>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#07070f" roughness={1} />
      </mesh>
      {/* Light panels */}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} position={[0, 2.48, -i * 3.5 + 5]}>
          <boxGeometry args={[0.25, 0.015, 1.0]} />
          <meshStandardMaterial color="#fff" emissive="#c4b5fd" emissiveIntensity={2} />
        </mesh>
      ))}
    </>
  )
}

function StoreWalls() {
  return (
    <>
      <mesh position={[-4, 0.65, -15]}>
        <boxGeometry args={[0.08, 3.8, 60]} />
        <meshStandardMaterial color="#080812" roughness={1} />
      </mesh>
      <mesh position={[4, 0.65, -15]}>
        <boxGeometry args={[0.08, 3.8, 60]} />
        <meshStandardMaterial color="#080812" roughness={1} />
      </mesh>
      {/* End wall glow */}
      <mesh position={[0, 0.65, -36]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.12} transparent opacity={0.5} />
      </mesh>
    </>
  )
}

function StoreScene() {
  const camZ = useRef(5)

  useFrame((state) => {
    camZ.current -= 0.025
    if (camZ.current < -28) camZ.current = 5
    state.camera.position.z = camZ.current
    state.camera.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 0.7) * 0.025
  })

  const shelfPositions = useMemo(() => {
    const items: { z: number; side: 1 | -1; row: number }[] = []
    for (let z = 2; z >= -34; z -= 3.5) {
      items.push({ z, side: 1, row: 0 })
      items.push({ z, side: -1, row: 0 })
      items.push({ z: z - 1.75, side: 1, row: 1 })
      items.push({ z: z - 1.75, side: -1, row: 1 })
    }
    return items
  }, [])

  return (
    <>
      <ambientLight intensity={0.1} color="#1a1a3e" />

      {/* Ceiling spotlights */}
      {Array.from({ length: 10 }).map((_, i) => (
        <SpotLight
          key={i}
          position={[0, 2.2, -i * 3.5 + 3]}
          angle={0.45}
          penumbra={0.5}
          intensity={12}
          color="#e0d7ff"
          distance={7}
          castShadow={false}
        />
      ))}

      {/* Colored accent lights */}
      <pointLight position={[-3.5, 0.5, -3]} intensity={3} color="#6366f1" distance={5} />
      <pointLight position={[3.5, 0.5, -10]} intensity={3} color="#d946ef" distance={5} />
      <pointLight position={[-3.5, 0.5, -17]} intensity={3} color="#8b5cf6" distance={5} />
      <pointLight position={[3.5, 0.5, -24]} intensity={3} color="#06b6d4" distance={5} />
      <pointLight position={[0, 1, -32]} intensity={6} color="#6366f1" distance={10} />

      <StoreFloor />
      <StoreCeiling />
      <StoreWalls />

      {shelfPositions.map((s, i) => (
        <ShelfUnit key={i} z={s.z} side={s.side} row={s.row} />
      ))}
    </>
  )
}

export default function StoreBackground3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 72 }}
        shadows={false}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#07070f' }}
      >
        <StoreScene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/50 pointer-events-none" />
    </div>
  )
}
