import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { Mesh } from 'three';

const GuardianShield: React.FC = () => {
    const meshRef = useRef<Mesh>(null!);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.5, 1]} />
            <meshStandardMaterial
                wireframe
                color="#FFCC00"
                emissive="#FFCC00"
                emissiveIntensity={2}
            />
        </mesh>
    );
};


const CyberScene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#FFCC00" intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <GuardianShield />
        <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>
    </Canvas>
  );
};

export default CyberScene;
