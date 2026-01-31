"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ModeTransition() {
    const { isTransitioning, setIsTransitioning, performThemeSwap } = useTheme();
    const [phase, setPhase] = useState<"idle" | "expanding" | "shrinking">("idle");

    useEffect(() => {
        if (isTransitioning && phase === "idle") {
            const timer = setTimeout(() => {
                setPhase("expanding");
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning, phase]);

    const handleExpandingComplete = () => {
        performThemeSwap();
        setPhase("shrinking");
    };

    const handleShrinkingComplete = () => {
        setPhase("idle");
        setIsTransitioning(false);
    };

    return (
        <AnimatePresence>
            {phase !== "idle" && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* SVG Filters for the smoke effect */}
                    <svg className="hidden">
                        <defs>
                            <filter id="shadow-portal-filter">
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.015"
                                    numOctaves="5"
                                    result="noise"
                                >
                                    <animate
                                        attributeName="baseFrequency"
                                        values="0.015;0.02;0.015"
                                        dur="5s"
                                        repeatCount="indefinite"
                                    />
                                </feTurbulence>
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale="120"
                                />
                                <feGaussianBlur stdDeviation="5" />
                            </filter>
                        </defs>
                    </svg>

                    {/* The expanding shadow overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden"
                        style={{ filter: "url(#shadow-portal-filter)" }}
                        initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
                        animate={{
                            clipPath: phase === "expanding" ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
                            opacity: phase === "expanding" ? 1 : 0
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut"
                        }}
                        onAnimationComplete={() => {
                            if (phase === "expanding") handleExpandingComplete();
                            else if (phase === "shrinking") handleShrinkingComplete();
                        }}
                    >
                        {/* Mystical particles/swirls inside the portal */}
                        <div className="relative w-full h-full">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 bg-gradient-to-br from-system-purple/20 via-transparent to-system-blue/20 blur-3xl"
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 3 + i,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    style={{
                                        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 70%",
                                    }}
                                />
                            ))}

                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="text-system-purple font-mono text-xl tracking-[0.5em] animate-pulse">
                                    [SYSTEM LEVELING...]
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
