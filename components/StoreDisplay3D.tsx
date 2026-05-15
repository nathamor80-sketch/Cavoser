'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// Confirmed free GLB models from KhronosGroup
const SHELF_ITEMS = [
  { url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', scale: 0.28, position: [-1.1, 0.55, 0] as [number,number,number] },
  { url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoomBox/glTF-Binary/BoomBox.glb', scale: 20, position: [0, 0.55, 0] as [number,number,number] },
  { url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb', scale: 5, position: [1.1, 0.55, 0] as [number,number,number] },
  { url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb', scale: 0.0025, position: [-0.55, -0.75, 0] as [number,number,number] },
  { url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Binary/Avocado.glb', scale: 7, position: [0.55, -0.75, 0] as [number,number,number] },
]

SHELF_ITEMS.forEach((item) => useGLTF.preload(item.url))

function GLBProduct({ url, scale, position }: { url: string; scale: number; position: [number,number,number] }) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(), [scene])
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.3}>
      <primitive object={cloned} scale={scale} position={position} />
    </Float>
  )
}

function FallbackProduct({ position }: { position: [number,number,number] }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.5 })
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.4, 0.5, 0.3]} />
      <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.3} roughness={0.3} metalness={0.5} />
    </mesh>
  )
}

function DisplayUnit() {
  return (
    <group>
      {/* Main display stand */}
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.08, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Middle shelf */}
      <mesh position={[0, -1.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.08, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-1.5, -0.65, 0]}>
        <boxGeometry args={[0.06, 1.3, 0.06]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.4} metalness={0.8} />
      </mesh>
      {/* Right leg */}
      <mesh position={[1.5, -0.65, 0]}>
        <boxGeometry args={[0.06, 1.3, 0.06]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.4} metalness={0.8} />
      </mesh>
      {/* Shelf edge glow top */}
      <mesh position={[0, -0.01, 0.41]}>
        <boxGeometry args={[3.2, 0.015, 0.01]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>
      {/* Shelf edge glow bottom */}
      <mesh position={[0, -1.26, 0.41]}>
        <boxGeometry args={[3.2, 0.015, 0.01]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
      </mesh>

      {/* Products */}
      {SHELF_ITEMS.map((item, i) => (
        <Suspense key={i} fallback={<FallbackProduct position={item.position} />}>
          <GLBProduct url={item.url} scale={item.scale} position={item.position} />
        </Suspense>
      ))}
    </group>
  )
}

function SignBoard() {
  return (
    <group position={[0, 1.6, 0]}>
      {/* Sign back */}
      <mesh>
        <boxGeometry args={[2.8, 0.55, 0.05]} />
        <meshStandardMaterial color="#0f0f1a" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Sign glow border */}
      <mesh position={[0, 0, 0.026]}>
        <boxGeometry args={[2.85, 0.6, 0.01]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.18
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} color="#c4b5fd" />
      <pointLight position={[3, 3, 3]} intensity={8} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={4} color="#6366f1" />
      <pointLight position={[0, -1, 3]} intensity={3} color="#d946ef" />
      <spotLight position={[0, 5, 2]} angle={0.4} penumbra={0.5} intensity={15} color="#e0d7ff" castShadow />

      <Environment preset="city" />

      <group ref={groupRef}>
        <SignBoard />
        <DisplayUnit />
      </group>

      <ContactShadows position={[0, -2.1, 0]} opacity={0.4} scale={8} blur={2} far={4} color="#6366f1" />
    </>
  )
}

export default function StoreDisplay3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.2, 4.5], fov: 55 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
