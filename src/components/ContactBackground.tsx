import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ContactBackground: React.FC = () => {
  const gltf = useLoader(GLTFLoader, '/models/scene.gltf');
  const mesh = useRef<any>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseDampeningFactor = 0.5; // Adjust this value for more or less dampening

  const onMouseMove = (event: MouseEvent) => {
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useFrame(() => {
    if (mesh.current) {
      // Default rotation
      mesh.current.rotation.y += 0.005; // Adjust this value for faster or slower rotation

      // Slight movement towards the mouse
      const targetPosition = new Vector3(
        mousePosition.x * mouseDampeningFactor,
        mousePosition.y * mouseDampeningFactor,
        0
      );
      mesh.current.position.lerp(targetPosition, 0.1); // Lerp for smooth transition

      // Scaling up the Earth
      mesh.current.scale.set(1.5, 1.5, 1.5); // Adjust these values for the desired size
    }
  });

  return (
    <primitive 
      object={gltf.scene}
      ref={mesh}
      position={[0, 0, 0]}
      onClick={() => console.log('Scene clicked')}
    />
  );
};

export default ContactBackground;
