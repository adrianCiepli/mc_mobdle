import { createContext, useContext, useMemo } from "react";

/**
 * Provider used in main.jsx (the first jsx file "entry point" for this app) that renders <App />
 * App.jsx needs to use the context, so we go to the component that mounts App, main.jsx
 * main.jsx is always in a React project and 
 */

const UIContext = createContext(null);
const uiClickAudio = new Audio('./assets/audio/file.mp3'); // never changes, doesn't need to be a ref in component

export function UIProvider({ children }) {
    const playButtonClick = () => {
        uiClickAudio.currentTime = 0; // sanity check that the mp3 is playing from start
        uiClickAudio.play().catch(() => {}); // returns promise along the play-time to maybe return error along way
        // Can keep going in parallel past the audio promise
    };

    const value = useMemo(() => ({
        // Saves return value and returns cache if dependencies here have not changed but render was triggered (things should be consts here)
        playButtonClick: playButtonClick
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
