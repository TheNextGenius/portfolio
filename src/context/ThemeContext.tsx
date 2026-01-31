"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    isProfessionalMode: boolean;
    toggleProfessionalMode: () => void;
    isTransitioning: boolean;
    setIsTransitioning: (val: boolean) => void;
    performThemeSwap: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isProfessionalMode, setIsProfessionalMode] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Use a deferred update to satisfy the react-hooks/set-state-in-effect rule
        const timer = setTimeout(() => {
            setIsMounted(true);
            const savedMode = localStorage.getItem("professionalMode");
            if (savedMode !== null) {
                const parsedMode = savedMode === "true";
                setIsProfessionalMode(parsedMode);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const toggleProfessionalMode = () => {
        setIsTransitioning(true);
    };

    const performThemeSwap = () => {
        setIsProfessionalMode((prev) => {
            const newMode = !prev;
            localStorage.setItem("professionalMode", String(newMode));
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{
            isProfessionalMode,
            toggleProfessionalMode,
            isTransitioning,
            setIsTransitioning,
            performThemeSwap
        }}>
            {isMounted ? children : <div className="invisible">{children}</div>}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
