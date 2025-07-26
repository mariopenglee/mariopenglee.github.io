import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader, Mesh, MeshStandardMaterial, Group } from 'three';

const Astronaut: React.FC = () => {
  const group = useRef<Group>(null);
  const obj = useLoader(OBJLoader, '/models/astronaut/base.obj');
  const texture = useLoader(TextureLoader, '/models/astronaut/textures/shaded.png');
  const [t, setT] = useState(0);
  const [spin, setSpin] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Apply texture to all meshes in the OBJ
  useEffect(() => {
    obj.traverse((child: any) => {
      if (child instanceof Mesh) {
        child.material = new MeshStandardMaterial({ map: texture });
      }
    });
  }, [obj, texture]);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll progress (0 at top, 1 at bottom)
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollY(progress);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((_, delta) => {
    setT(t => t + delta);
    if (group.current) {
      // Start at right side of screen (e.g., x = 2)
      group.current.position.x = 3;
      // Dive down as you scroll: base y + floating + scroll effect
      group.current.position.y = Math.sin(t) * 0.5 - 1 - scrollY * 3;
      group.current.position.z = 0;
      group.current.rotation.x += 0;
      group.current.rotation.y += spin ? 0.2 : 0.01;
      group.current.scale.set(1.5, 1.5, 1.5);
      if (spin) {
        // Stop spinning after a short time
        setTimeout(() => setSpin(false), 300);
      }
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive
        object={obj}
        onClick={() => setSpin(true)}
      />
    </group>
  );
};

export default Astronaut;
