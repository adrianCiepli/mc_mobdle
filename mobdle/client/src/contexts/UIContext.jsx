import { createContext, useContext, useMemo } from "react";
import confetti from "canvas-confetti";
import buttonClickFx from '../assets/audio/button-click.mp3';

/**
 * Provider used in main.jsx (the first jsx file "entry point" for this app) that renders <App />
 * App.jsx needs to use the context, so we go to the component that mounts App, main.jsx
 * main.jsx is always in a React project and 
 */

const UIContext = createContext(null);
const uiClickAudio = new Audio(buttonClickFx); // never changes, doesn't need to be a ref in component

const playSuccessConfetti = () => {
    const duration = 2000; // ms
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, angle: 90, spread: 120, ticks: 60, zIndex: 1001 }; // dark overlay is z=1000

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () { // runs function repeatedly on ms interval, starting at 0
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval); // this is why we store interval variable, so we can force stop the repeated execution
        }

        var particleCount = 125 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

export function UIProvider({ children }) {
    const playButtonClick = () => {
        uiClickAudio.currentTime = 0.18; // start time in seconds for the mp3
        uiClickAudio.play().catch(() => {}); // returns promise along the play-time to maybe return error along way
        // Can keep going in parallel past the audio promise
    };

    const value = useMemo(() => ({
        // Saves return value and returns cache if dependencies here have not changed but render was triggered (things should be consts here)
        playButtonClick: playButtonClick,
        playSuccessConfetti: playSuccessConfetti,
    }), []);

    return(
        <UIContext value={value}>
            {children}
        </UIContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUIContext() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
