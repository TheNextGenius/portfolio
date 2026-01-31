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
                <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
                    {/* Advanced SVG Filters for organic smoke/ink */}
                    <svg className="hidden">
                        <defs>
                            <filter id="shadow-surge-filter">
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.04"
                                    numOctaves="4"
                                    result="noise"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale="150"
                                />
                                <feGaussianBlur stdDeviation="8" />
                            </filter>
                        </defs>
                    </svg>

                    {/* Multiple overlapping organic "Shadow Blobs" */}
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 bg-black"
                            style={{
                                filter: "url(#shadow-surge-filter)",
                                borderRadius: "40% 60% 30% 70% / 50% 30% 70% 50%"
                            }}
                            initial={{ scale: 0, opacity: 0, rotate: i * 45 }}
                            animate={{
                                scale: phase === "expanding" ? 3.5 : 0,
                                opacity: phase === "expanding" ? 1 : 0,
                                rotate: phase === "expanding" ? i * 45 + 90 : i * 45
                            }}
                            transition={{
                                duration: 1.5,
                                ease: phase === "expanding" ? "circOut" : "circIn",
                                delay: i * 0.1
                            }}
                            onAnimationComplete={() => {
                                if (i === 0) { // Only trigger for the first one
                                    if (phase === "expanding") handleExpandingComplete();
                                    else if (phase === "shrinking") handleShrinkingComplete();
                                }
                            }}
                        />
                    ))}

                    {/* Central Energy Burst / Flash */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === "expanding" ? [0, 1, 0] : 0 }}
                        transition={{ duration: 0.8, times: [0, 0.5, 1], delay: 0.8 }}
                    >
                        <div className="w-96 h-96 bg-system-purple blur-[100px] rounded-full opacity-50" />
                        <div className="absolute w-2 h-screen bg-white blur-[20px] rotate-45 transform scale-y-[10]" />
                        <div className="absolute w-screen h-2 bg-white blur-[20px] -rotate-45 transform scale-x-[10]" />
                    </motion.div>

                    {/* Text overlay during transition */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: phase === "expanding" ? 1 : 0, scale: phase === "expanding" ? 1.2 : 0.8 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="text-white font-mono text-2xl tracking-[1em] text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                            {phase === "expanding" ? "[SYSTEM REBOOT]" : "[SYNC COMPLETE]"}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
