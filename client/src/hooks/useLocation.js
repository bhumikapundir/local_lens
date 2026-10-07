import { useCallback, useState } from "react";

function useLocation() {
    const [location, setLocation] = useState(null);
    const [localityName, setLocalityName] = useState(null);
    const [status, setStatus] = useState("prompt");
    const [error, setError] = useState(null);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus("unavailable");
            setError("Geolocation is not supported by this browser.");
            return;
        }

        setStatus("prompt");
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                setLocalityName("Current Location");
                setStatus("granted");
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus("denied");
                    setError("Location permission was denied.");
                } else {
                    setStatus("unavailable");
                    setError("Unable to get your location.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, []);

    const setManualLocation = useCallback((manualLocation) => {
        setLocation({
            latitude: manualLocation.latitude,
            longitude: manualLocation.longitude,
        });

        setLocalityName(manualLocation.localityName);
        setStatus("manual");
        setError(null);
    }, []);

    return {
        location,
        localityName,
        status,
        error,
        requestLocation,
        setManualLocation,
    };
}

export default useLocation;