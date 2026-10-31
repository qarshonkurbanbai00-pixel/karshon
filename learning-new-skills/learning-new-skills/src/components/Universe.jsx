import React, {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Pause, Play, RotateCcw } from "lucide-react";
import { skills } from "../data";

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticOrbit /> : this.props.children;
  }
}

export function StaticOrbit() {
  return (
    <div className="static-orbit" aria-hidden="true">
      <div className="static-ring ring-one" />
      <div className="static-ring ring-two" />
      <div className="static-ring ring-three" />
      <div className="static-core" />
      <i className="static-moon" />
    </div>
  );
}

const nodePositions = skills.map((_, i) => {
  const a = (i / 6) * Math.PI * 2;
  return [Math.cos(a) * 2.48, Math.sin(a) * 1.9, Math.sin(a * 2) * 0.6];
});

function OrbitalScene({
  paused,
  reducedMotion,
  selected,
  onSelect,
  rotationTarget,
  isVisible,
}) {
  const world = useRef();
  const core = useRef();
  const nodes = useRef([]);
  const positions = useMemo(() => {
    const p = new Float32Array(170 * 3);
    // A fixed seed gives the same quiet star field every time.
    let seed = 73;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < p.length; i++) p[i] = (random() - 0.5) * 14;
    return p;
  }, []);
  const ringGeometry = useMemo(
    () => new THREE.TorusGeometry(2.43, 0.008, 6, 160),
    [],
  );
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#799bff",
        transparent: true,
        opacity: 0.48,
      }),
    [],
  );
  useEffect(
    () => () => {
      ringGeometry.dispose();
      ringMaterial.dispose();
    },
    [ringGeometry, ringMaterial],
  );
  useFrame((state, delta) => {
    if (!isVisible) return;
    const dt = Math.min(delta, 0.04);
    if (!paused && !reducedMotion) rotationTarget.current.y += dt * 0.065;
    if (world.current) {
      world.current.rotation.y = THREE.MathUtils.damp(
        world.current.rotation.y,
        rotationTarget.current.y,
        5,
        dt,
      );
      world.current.rotation.x = THREE.MathUtils.damp(
        world.current.rotation.x,
        rotationTarget.current.x,
        5,
        dt,
      );
    }
    if (core.current && !paused && !reducedMotion) {
      core.current.rotation.y += dt * 0.1;
      core.current.rotation.z += dt * 0.04;
    }
    nodes.current.forEach((node, i) => {
      if (!node) return;
      const target = skills[i].id === selected ? 1.28 : 1;
      const s = THREE.MathUtils.damp(node.scale.x, target, 5, dt);
      node.scale.setScalar(s);
    });
  });
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[-3, 4, 5]} intensity={3.8} color="#b4d2ff" />
      <pointLight position={[2, -2, 3]} intensity={30} color="#7241ff" />
      <pointLight position={[-2, 2, 2]} intensity={18} color="#3b9eff" />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9eacdd"
          size={0.017}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
      <group ref={world} rotation={[0.12, -0.22, -0.18]}>
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[1.18, 2]} />
            <meshStandardMaterial
              color="#253b99"
              metalness={0.75}
              roughness={0.26}
              flatShading
            />
          </mesh>
          <mesh scale={1.009}>
            <icosahedronGeometry args={[1.18, 2]} />
            <meshBasicMaterial
              color="#8b9dff"
              wireframe
              transparent
              opacity={0.27}
            />
          </mesh>
          <mesh scale={1.055}>
            <icosahedronGeometry args={[1.18, 0]} />
            <meshBasicMaterial
              color="#6a8cff"
              wireframe
              transparent
              opacity={0.12}
            />
          </mesh>
        </group>
        {[
          [0.8, 0.15, 0.25],
          [-0.85, 0.4, 0.75],
          [0.15, 0.9, -0.45],
        ].map((r, i) => (
          <mesh
            key={i}
            geometry={ringGeometry}
            material={ringMaterial}
            rotation={r}
          />
        ))}
        {skills.map((skill, i) => (
          <group
            key={skill.id}
            position={nodePositions[i]}
            ref={(el) => {
              nodes.current[i] = el;
            }}
          >
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelect(skill.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "";
              }}
            >
              {i % 3 === 0 ? (
                <octahedronGeometry args={[0.25, 0]} />
              ) : i % 3 === 1 ? (
                <boxGeometry args={[0.33, 0.33, 0.33]} />
              ) : (
                <icosahedronGeometry args={[0.23, 1]} />
              )}
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={selected === skill.id ? 0.6 : 0.18}
                metalness={0.4}
                roughness={0.25}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.36, 0.006, 5, 36]} />
              <meshBasicMaterial
                color={skill.color}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function Universe({ selected, onSelect, reducedMotion }) {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState(null);
  const [contextLost, setContextLost] = useState(false);
  const container = useRef();
  const drag = useRef(null);
  const rotationTarget = useRef({ x: 0.12, y: -0.22 });
  const selectedSkill = skills.find((s) => s.id === selected) || skills[0];
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setSupported(Boolean(gl));
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
    let onScreen = true;
    const update = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { rootMargin: "60px" },
    );
    observer.observe(container.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      document.body.style.cursor = "";
    };
  }, []);
  return (
    <div className="universe-frame" ref={container}>
      <div className="orbit-coordinate coord-top" aria-hidden="true">
        YOUR POTENTIAL / UNLIMITED
      </div>
      <div className="orbit-coordinate coord-side" aria-hidden="true">
        EXPLORE · DISCOVER · GROW
      </div>
      <div className="universe-halo" aria-hidden="true" />
      <div
        className="scene-viewport"
        tabIndex={0}
        role="group"
        aria-label="Interactive 3D skills universe. Drag to rotate, use arrow keys to turn, or select a skill below."
        onKeyDown={(e) => {
          if (
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
          ) {
            e.preventDefault();
            if (e.key === "ArrowLeft") rotationTarget.current.y -= 0.2;
            if (e.key === "ArrowRight") rotationTarget.current.y += 0.2;
            if (e.key === "ArrowUp")
              rotationTarget.current.x = Math.max(
                -0.7,
                rotationTarget.current.x - 0.15,
              );
            if (e.key === "ArrowDown")
              rotationTarget.current.x = Math.min(
                0.7,
                rotationTarget.current.x + 0.15,
              );
          }
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          rotationTarget.current.y += (e.clientX - drag.current.x) * 0.007;
          rotationTarget.current.x = Math.max(
            -0.7,
            Math.min(
              0.7,
              rotationTarget.current.x + (e.clientY - drag.current.y) * 0.004,
            ),
          );
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        {supported && !contextLost ? (
          <SceneBoundary>
            <Suspense fallback={<StaticOrbit />}>
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 8.7], fov: 43 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: "low-power",
                }}
                frameloop={visible ? "always" : "never"}
                onCreated={({ gl }) => {
                  gl.domElement.setAttribute("aria-hidden", "true");
                  gl.domElement.addEventListener(
                    "webglcontextlost",
                    () => setContextLost(true),
                    { once: true },
                  );
                }}
              >
                <OrbitalScene
                  paused={paused}
                  reducedMotion={reducedMotion}
                  selected={selected}
                  onSelect={onSelect}
                  rotationTarget={rotationTarget}
                  isVisible={visible}
                />
              </Canvas>
            </Suspense>
          </SceneBoundary>
        ) : (
          <StaticOrbit />
        )}
      </div>
      <div className="orbit-label label-top">
        <span className="status-light" /> A WORLD OF POSSIBILITIES
      </div>
      <div className="orbit-label label-bottom">
        <span
          className="label-orb"
          style={{ background: selectedSkill.color }}
        />
        <div>
          <span className="micro">NOW EXPLORING</span>
          <strong>{selectedSkill.name}</strong>
        </div>
        <span className="label-plus">↗</span>
      </div>
      <div className="scene-controls">
        <span>
          <span className="drag-icon">↔</span>{" "}
          {supported && !contextLost
            ? "Drag to explore"
            : "Your skills, connected"}
        </span>
        <div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={
              paused ? "Play automatic rotation" : "Pause automatic rotation"
            }
            title={paused ? "Play rotation" : "Pause rotation"}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            type="button"
            onClick={() => {
              rotationTarget.current = { x: 0.12, y: -0.22 };
            }}
            aria-label="Reset 3D view"
            title="Reset view"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
