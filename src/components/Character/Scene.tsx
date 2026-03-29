import { Component, ReactNode, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const isScreen =
          name.includes("screen") ||
          name.includes("display") ||
          name.includes("monitor");
        child.material = new THREE.MeshStandardMaterial({
          color: isScreen ? "#050510" : "#12122a",
          emissive: isScreen ? "#7b2fff" : "#3a1a8c",
          emissiveIntensity: isScreen ? 2.5 : 0.2,
          metalness: 0.85,
          roughness: isScreen ? 0.05 : 0.25,
        });
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.4,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.15,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
        <primitive object={scene} scale={4} rotation={[0.15, -0.4, 0]} />
      </Float>
    </group>
  );
}

useGLTF.preload("/models/character.glb");

const Scene = () => {
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
      <div className="character-model">
        <div className="character-rim"></div>
        <SceneErrorBoundary>
          <Canvas
            gl={{ antialias: false, alpha: true }}
            camera={{ position: [0, 0.5, 8], fov: 25 }}
            dpr={Math.min(window.devicePixelRatio, 2)}
          >
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#7b2fff" />
            <pointLight position={[-5, -2, -3]} intensity={1} color="#2f7bff" />
            <Suspense fallback={null}>
              <CharacterModel />
              <Environment
                files="/models/char_enviorment.hdr"
                environmentIntensity={0.4}
              />
              <EffectComposer>
                <Bloom luminanceThreshold={0.4} mipmapBlur intensity={2} />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </SceneErrorBoundary>
      </div>
    </div>
  );
};

export default Scene;
