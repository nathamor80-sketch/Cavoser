'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, SpotLight } from '@react-three/drei'
import * as THREE from 'three'

// --- Product shapes on shelves ---
const PRODUCT_CONFIGS = [
  { geometry: 'box',      args: [0.4, 0.6, 0.3] as [number,number,number], color: '#c084fc', emissive: '#7c3aed' },
  { geometry: 'box',      args: [0.5, 0.4, 0.4] as [number,number,number], color: '#60a5fa', emissive: '#1d4ed8' },
  { geometry: 'cylinder', args: [0.15, 0.15, 0.7, 16] as [number,number,number,number], color: '#f472b6', emissive: '#be185d' },
  { geometry: 'box',      args: [0.3, 0.5, 0.25] as [number,number,number], color: '#34d399', emissive: '#065f46' },
  { geometry: 'cylinder', args: [0.2, 0.2, 0.5, 16] as [number,number,number,number], color: '#fbbf24', emissive: '#92400e' },
  { geometry: 'box',      args: [0.6, 0.35, 0.35] as [number,number,number], color: '#f87171', emissive: '#991b1b' },
  { geometry: 'box',      args: [0.35, 0.55, 0.3] as [number,number,number], color: '#a78bfa', emissive: '#5b21b6' },
  { geometry: 'cylinder', args: [0.18, 0.18, 0.6, 16] as [number,number,number,number], color: '#38bdf8', emissive: '#0369a1' },
]

function ProductShape({ config, position }: {
  config: typeof PRODUCT_CONFIGS[0]
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const rotSpeed = useMemo(() => (Math.random() - 0.5) * 0.4, [])

  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * rotSpeed
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {config.geometry === 'box' ? (
        <boxGeometry args={config.args as [number, number, number]} />
      ) : (
        <cylinderGeometry args={config.args as [number, number, number, number]} />
      )}
      <meshStandardMaterial
        color={config.color}
        emissive={config.emissive}
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  )
}

function Shelf({ z, side }: { z: number; side: 1 | -1 }) {
  const x = side * 3.2

  return (
    <group position={[x, 0, z]}>
      {/* Shelf board */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.05, 0.7]} />
        <meshStandardMaterial color="#1e1e2e" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Back panel */}
      <mesh position={[side * 0.65, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.05, 1.1, 0.7]} />
        <meshStandardMaterial color="#14142a" roughness={1} />
      </mesh>
      {/* Products on shelf */}
      {[0, 1, 2].map((i) => {
        const cfg = PRODUCT_CONFIGS[(Math.abs(z * 10 + i * 3 + side)) % PRODUCT_CONFIGS.length]
        return (
          <ProductShape
            key={i}
            config={cfg}
            position={[(i - 1) * 0.42, cfg.args[1] / 2, 0]}
          />
        )
      })}
    </group>
  )
}

function StoreFloor() {
  return (
    <>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -15]} receiveShadow>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Floor grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -i * 2 + 5]}>
          <planeGeometry args={[8, 0.02]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Side floor strips */}
      {[-3.5, 3.5].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.19, -15]}>
          <planeGeometry args={[0.03, 60]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  )
}

function StoreCeiling() {
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -15]} receiveShadow>
        <planeGeometry args={[8, 60]} />
        <meshStandardMaterial color="#0a0a18" roughness={1} />
      </mesh>
      {/* Ceiling lights strip */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, 2.48, -i * 3 + 4]}>
          <boxGeometry args={[0.3, 0.02, 1.2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#a5b4fc"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </>
  )
}

function StoreWalls() {
  return (
    <>
      {/* Left wall */}
      <mesh position={[-4, 0.7, -15]}>
        <boxGeometry args={[0.1, 4, 60]} />
        <meshStandardMaterial color="#0d0d1a" roughness={1} />
      </mesh>
      {/* Right wall */}
      <mesh position={[4, 0.7, -15]}>
        <boxGeometry args={[0.1, 4, 60]} />
        <meshStandardMaterial color="#0d0d1a" roughness={1} />
      </mesh>
      {/* End wall glow */}
      <mesh position={[0, 0.7, -35]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.08} transparent opacity={0.6} />
      </mesh>
    </>
  )
}

function StoreScene() {
  const cameraRef = useRef({ z: 5 })

  useFrame((state) => {
    // Smooth camera dolly forward, loop back
    cameraRef.current.z -= 0.03
    if (cameraRef.current.z < -25) cameraRef.current.z = 5
    state.camera.position.z = cameraRef.current.z
    state.camera.position.y = 0.2
    // Slight camera bob
    state.camera.position.y += Math.sin(state.clock.elapsedTime * 0.8) * 0.03
  })

  // Shelves on both sides at regular intervals
  const shelves = useMemo(() => {
    const result: { z: number; side: 1 | -1; y: number }[] = []
    for (let z = 0; z >= -32; z -= 3) {
      result.push({ z, side: 1, y: -0.2 })
      result.push({ z, side: -1, y: -0.2 })
      // Second shelf row higher
      result.push({ z: z - 1.5, side: 1, y: 0.8 })
      result.push({ z: z - 1.5, side: -1, y: 0.8 })
    }
    return result
  }, [])

  return (
    <>
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Ceiling spot lights */}
      {Array.from({ length: 8 }).map((_, i) => (
        <SpotLight
          key={i}
          position={[0, 2.3, -i * 4 + 2]}
          angle={0.5}
          penumbra={0.4}
          intensity={15}
          color="#d4c5ff"
          distance={8}
          castShadow={false}
        />
      ))}

      {/* Colored accent lights */}
      <pointLight position={[-3, 0.5, -5]} intensity={2} color="#6366f1" distance={6} />
      <pointLight position={[3, 0.5, -12]} intensity={2} color="#d946ef" distance={6} />
      <pointLight position={[-3, 0.5, -20]} intensity={2} color="#8b5cf6" distance={6} />
      <pointLight position={[0, 2, -30]} intensity={4} color="#6366f1" distance={10} />

      <StoreFloor />
      <StoreCeiling />
      <StoreWalls />

      {/* Shelving units */}
      {shelves.map((s, i) => (
        <group key={i} position={[0, s.y, s.z]}>
          <Shelf z={0} side={s.side} />
        </group>
      ))}
    </>
  )
}

export default function StoreBackground3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 70 }}
        shadows={false}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#08080f' }}
      >
        <StoreScene />
      </Canvas>
      {/* Gradient overlay: top & bottom fade for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-transparent to-zinc-950/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/50 pointer-events-none" />
    </div>
  )
}
