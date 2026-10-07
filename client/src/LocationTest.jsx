import useLocation from "./hooks/useLocation";

function LocationTest() {
    const {
        location,
        status,
        error,
        requestLocation,
    } = useLocation();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Location Test</h1>

            <p>
                Status: <strong>{status}</strong>
            </p>

            <button onClick={requestLocation}>
                Get My Location
            </button>

            {location && (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default LocationTest;