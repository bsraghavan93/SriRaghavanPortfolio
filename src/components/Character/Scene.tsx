import { Component, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const mouse = { x: 0, y: 0 };

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function CharacterModel() {
  const { scene } = useGLTF("/models/character.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#12122a",
          emissive: "#3a1a8c",
          emissiveIntensity: 0.2,
          metalness: 0.85,
          roughness: 0.25,
        });
      }
    });
    invalidate();
  }, [scene, invalidate]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.3,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.1,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <primitive object={scene} scale={1} />
      </Float>
    </group>
  );
}

useGLTF.preload("/models/character.glb");

const Scene = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasRef}>
        <div className="character-rim"></div>
        <SceneErrorBoundary>
          <Canvas
            frameloop={visible ? "always" : "never"}
            gl={{ antialias: false, alpha: true }}
            camera={{ position: [0, 13.1, 24.7], fov: 14.5 }}
            dpr={Math.min(window.devicePixelRatio, 2)}
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#7b2fff" />
            <pointLight position={[-5, -2, -3]} intensity={1} color="#2f7bff" />
            <Suspense fallback={null}>
              <CharacterModel />
              <Environment
                files="/models/char_enviorment.hdr"
                environmentIntensity={0.4}
              />
              <EffectComposer>
                <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.5} />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </SceneErrorBoundary>
      </div>
    </div>
  );
};

export default Scene;
