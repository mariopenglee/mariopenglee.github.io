import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader, Mesh, MeshStandardMaterial, Group } from 'three';

// Custom hook to detect mobile
function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

const Astronaut: React.FC = () => {
  const group = useRef<Group>(null);
  const obj = useLoader(OBJLoader, '/models/astronaut/base.obj');
  const texture = useLoader(TextureLoader, '/models/astronaut/textures/shaded.png');
  const [t, setT] = useState(0);
  const [spin, setSpin] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();

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
      // Responsive position and scale
      if (isMobile) {
        group.current.position.x = 0;
        group.current.position.y = -0.5 - scrollY * 2.5;
        group.current.position.z = 0;
        group.current.scale.set(1, 1, 1);
      } else {
        group.current.position.x = 3;
        group.current.position.y = Math.sin(t) * 0.5 - 1 - scrollY * 3;
        group.current.position.z = 0;
        group.current.scale.set(1.5, 1.5, 1.5);
      }
      group.current.rotation.y += spin ? 0.2 : 0.01;
      if (spin) {
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
