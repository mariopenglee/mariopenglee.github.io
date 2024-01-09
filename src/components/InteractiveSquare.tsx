import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';


const InteractiveSquare: React.FC = () => {
  const mesh = useRef<any>();
  const [scrollY, setScrollY] = useState(0);

  let increasing = true;
  const [destinationX, setDestinationX] = useState(0);
  const [destinationY, setDestinationY] = useState(0);

  onmousemove = (e) => {
    if (!mesh.current) {
      return;
    }

    setDestinationX((e.clientX - window.innerWidth / 2)/100);
    setDestinationY(-(e.clientY - window.innerHeight / 2)/100);

  }


  useFrame(() => {
    if (mesh.current) {

      if (scrollY < window.innerHeight) {
      mesh.current.position.x += (destinationX - mesh.current.position.x) / 100;
      mesh.current.position.y += (destinationY - mesh.current.position.y) / 100;
      }
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
      

      if (increasing) {
        mesh.current.scale.x += 0.001;
        mesh.current.scale.y += 0.001;
        mesh.current.scale.z += 0.001;
        if (mesh.current.scale.x > 1.2) {
          increasing = false;
        }
      }
      else {
        mesh.current.scale.x -= 0.001;
        mesh.current.scale.y -= 0.001;
        mesh.current.scale.z -= 0.001;
        if (mesh.current.scale.x < 1) {
          increasing = true;
        }
      }
    }
  });

  const handleScroll = () => {
    setScrollY(window.scrollY);
    setDestinationX((window.innerWidth / 2 - window.scrollY) / 100);
    setDestinationY((window.innerHeight / 2 - window.scrollY) / 100);

  };


  window.addEventListener('scroll', handleScroll);

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      onClick={() => console.log('Cube clicked')}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={`hsl(${(scrollY / 5) % 360}, 50%, 50%)`} />
    </mesh>
  );

};

export default InteractiveSquare;
