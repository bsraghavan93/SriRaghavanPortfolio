import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";

const mouse = { x: 0, y: 0 };

function LaptopModel({ onLoaded }: { onLoaded: () => void }) {
  const { scene } = useGLTF("/models/laptop.glb");
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
        child.castShadow = true;
      }
    });

    onLoaded();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

useGLTF.preload("/models/laptop.glb");

const Scene = () => {
  const { setLoading } = useLoading();
  const progressRef = useRef(setProgress((value) => setLoading(value)));

  const handleLoaded = () => {
    progressRef.current.loaded();
  };

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
        <Canvas
          gl={{ antialias: false, alpha: true }}
          camera={{ position: [0, 0.5, 8], fov: 25 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#7b2fff" />
          <pointLight position={[-5, -2, -3]} intensity={1} color="#2f7bff" />
          <Suspense fallback={null}>
            <LaptopModel onLoaded={handleLoaded} />
            <Environment
              files="/models/char_enviorment.hdr"
              environmentIntensity={0.4}
            />
            <EffectComposer>
              <Bloom luminanceThreshold={0.4} mipmapBlur intensity={2} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Scene;
