import { useLocationContext } from "./context/LocationContext";

function LocationSettingsTest() {
    const {
        location,
        status,
        radius,
        setRadius,
        requestLocation,
    } = useLocationContext();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Location Settings</h1>

            <h2>Location</h2>

            {location ? (
                <>
                    <p>
                        Latitude: {location.latitude}
                    </p>
                    <p>
                        Longitude: {location.longitude}
                    </p>
                </>
            ) : (
                <p>Location not detected yet.</p>
            )}

            <button onClick={requestLocation}>
                Get My Location
            </button>

            <h2 style={{ marginTop: "30px" }}>
                Search Radius
            </h2>

            <button
                onClick={() => setRadius(5)}
                style={{
                    marginRight: "10px",
                    fontWeight: radius === 5 ? "bold" : "normal",
                }}
            >
                5 km
            </button>

            <button
                onClick={() => setRadius(10)}
                style={{
                    fontWeight: radius === 10 ? "bold" : "normal",
                }}
            >
                10 km
            </button>

            <p>
                Selected radius: <strong>{radius} km</strong>
            </p>

            <p>
                Location status: <strong>{status}</strong>
            </p>
        </div>
    );
}

export default LocationSettingsTest;