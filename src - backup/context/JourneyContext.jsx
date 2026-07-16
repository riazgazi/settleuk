import React, { createContext, useContext } from 'react';
import { useJourney } from '../hooks/useJourney';

const JourneyContext = createContext(null);

export const JourneyProvider = ({ children }) => {
    const journeyData = useJourney();
    return (
        <JourneyContext.Provider value={journeyData}>
            {children}
        </JourneyContext.Provider>
    );
};

export const useJourneyContext = () => {
    const context = useContext(JourneyContext);
    if (!context) {
        throw new Error('useJourneyContext must be used within a JourneyProvider');
    }
    return context;
};