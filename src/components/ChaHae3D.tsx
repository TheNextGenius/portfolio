"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment, ContactShadows, PresentationControls, Html } from "@react-three/drei";
import * as THREE from "three";

function ChaHaeModel({ modelPath }: { modelPath: string }) {
    const group = useRef<THREE.Group>(null);
    const gltf = useGLTF(modelPath);

    useFrame((state) => {
        if (group.current) {
            // Gentle floating animation
            const t = state.clock.getElapsedTime();
            group.current.position.y = Math.sin(t) * 0.15;
            group.current.rotation.y = Math.sin(t / 4) * 0.1;
        }
    });

    return (
        <primitive
            ref={group}
            object={gltf.scene}
            scale={3}
            position={[0, -4.5, 0]}
            rotation={[0, -Math.PI / 4, 0]}
        />
    );
}

export default function ChaHae3D() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center font-mono text-system-purple animate-pulse">
                [INITIALIZING SYSTEM...]
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] md:h-[600px] relative pointer-events-auto">
            <Canvas
                shadows
                camera={{ position: [0, 2, 15], fov: 35 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true,
                    powerPreference: "high-performance"
                }}
            >
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#7b2cbf" />
                <directionalLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />

                <Suspense fallback={
                    <Html center>
                        <div className="text-system-purple animate-pulse font-mono">[SYNCING S-RANK ASSETS...]</div>
                    </Html>
                }>
                    <PresentationControls
                        global
                        snap
                        rotation={[0, 0.3, 0]}
                        polar={[-Math.PI / 3, Math.PI / 3]}
                        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                    >
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.05}>
                            <ChaHaeModel modelPath="/models/cha-hae-in.glb" />
                        </Float>
                    </PresentationControls>

                    <ContactShadows
                        position={[0, -4.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={4.5}
                    />
                </Suspense>

                <Environment preset="night" />
            </Canvas>

            {/* Overlay info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <p className="text-[10px] text-system-blue/30 font-mono uppercase tracking-widest animate-pulse">
                    Dimensional Sync Active
                </p>
            </div>
        </div>
    );
}

useGLTF.preload("/models/cha-hae-in.glb");
