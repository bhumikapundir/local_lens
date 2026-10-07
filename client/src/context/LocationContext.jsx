import { createContext, useContext, useState } from "react";
import useLocation from "../hooks/useLocation";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
    const {
        location,
        localityName,
        status,
        error,
        requestLocation,
        setManualLocation,
    } = useLocation();

    const [radius, setRadius] = useState(5);

    const value = {
        location,
        localityName,
        status,
        error,
        requestLocation,
        setManualLocation,
        radius,
        setRadius,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocationContext() {
    const context = useContext(LocationContext);

    if (!context) {
        throw new Error(
            "useLocationContext must be used inside <LocationProvider>"
        );
    }

    return context;
}