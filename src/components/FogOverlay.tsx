import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function FogOverlay() {
    const { isProfessionalMode } = useTheme();

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
            {/* Fog Container */}
            <motion.div
                className="relative w-[200%] h-[200%] -top-[50%] -left-[50%]"
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    rotate: { duration: 180, repeat: Infinity, ease: "linear" },
                    scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                {/* SVG Filter Definition */}
                <svg className="hidden">
                    <defs>
                        <filter id="fog-filter" x="0%" y="0%" width="100%" height="100%">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency={isProfessionalMode ? "0.012" : "0.008"}
                                numOctaves="2"
                                seed="5"
                            />
                            <feDisplacementMap in="SourceGraphic" scale="100" />
                        </filter>
                    </defs>
                </svg>

                {/* Fog Layer 1 - Deep Base */}
                <div
                    className="absolute inset-0 opacity-40 will-change-transform"
                    style={{
                        background: `radial-gradient(circle at center, transparent 30%, ${isProfessionalMode ? '#0f172a' : '#000000'
                            } 70%)`
                    }}
                />

                {/* Fog Layer 2 - Swirling Mist */}
                <div
                    className="absolute inset-0 will-change-transform mix-blend-screen"
                    style={{
                        filter: "url(#fog-filter)",
                        background: isProfessionalMode
                            ? "linear-gradient(45deg, rgba(58, 134, 255, 0.2), transparent)"
                            : "linear-gradient(45deg, rgba(168, 85, 247, 0.2), transparent)" // System Purple
                    }}
                />

                {/* Fog Layer 3 - Accent Highlights (Portal feel) */}
                <motion.div
                    className="absolute inset-0 will-change-transform mix-blend-overlay"
                    animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        background: isProfessionalMode
                            ? "radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.15), transparent 50%)"
                            : "radial-gradient(circle at 60% 60%, rgba(192, 132, 252, 0.15), transparent 50%)"
                    }}
                />
            </motion.div>

            {/* Vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}
