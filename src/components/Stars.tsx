import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple animated stars background for deep space effect
export default function Stars({ count = 120 }) {
  const group = useRef<THREE.Group>(null);
  // Generate random star positions only once
  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        -Math.random() * 20,
      ] as [number, number, number]),
    [count]
  );

  useFrame(() => {
    if (group.current) {
      group.current.rotation.z += 0.0005;
    }
  });

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      ))}
    </group>
  );
}
