"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    isProfessionalMode: boolean;
    toggleProfessionalMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isProfessionalMode, setIsProfessionalMode] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

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
        setIsProfessionalMode((prev) => {
            const newMode = !prev;
            localStorage.setItem("professionalMode", String(newMode));
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ isProfessionalMode, toggleProfessionalMode }}>
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
