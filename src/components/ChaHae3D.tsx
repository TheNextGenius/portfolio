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
            group.current.position.y = Math.sin(t) * 0.1;
            group.current.rotation.y = Math.sin(t / 4) * 0.05;
        }
    });

    return (
        <primitive
            ref={group}
            object={gltf.scene}
            scale={0.25}
            position={[0, -2.5, 0]}
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
                camera={{ position: [0, 0, 12], fov: 40 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
            >
                {/* Main dynamic lighting */}
                <ambientLight intensity={1.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2.5} castShadow />

                {/* Cinematic Rim Lights (Backlights) for silhouette pop */}
                <pointLight position={[10, 5, -10]} intensity={15} color="#7b2cbf" />
                <pointLight position={[-10, 5, -10]} intensity={15} color="#3a86ff" />

                {/* Accent Lights */}
                <pointLight position={[0, -2, 5]} intensity={2} color="#ffffff" />
                <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />

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
                        position={[0, -2.5, 0]}
                        opacity={0.6}
                        scale={12}
                        blur={2.5}
                        far={5}
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
