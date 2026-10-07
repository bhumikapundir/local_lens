import { useState } from "react";

function ManualLocationPicker({ onSelect }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchLocation = async () => {
        if (!search.trim()) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResults([]);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    search
                )}&limit=5`
            );

            const data = await response.json();

            if (data.length === 0) {
                setError("No locations found.");
            } else {
                setResults(data);
            }
        } catch (err) {
            console.error(err);
            setError("Unable to search for this location.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (place) => {
        onSelect({
            latitude: Number(place.lat),
            longitude: Number(place.lon),
            localityName: place.display_name,
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
            }}
        >
            <div
                style={{
                    background: "white",
                    color: "black",
                    padding: "30px",
                    borderRadius: "15px",
                    width: "100%",
                    maxWidth: "500px",
                }}
            >
                <h2>Choose Your Location</h2>

                <p>
                    We couldn't access your browser location. Search for your
                    locality instead.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchLocation();
                            }
                        }}
                        placeholder="Search city or locality"
                        style={{
                            flex: 1,
                            padding: "12px",
                        }}
                    />

                    <button onClick={searchLocation}>
                        Search
                    </button>
                </div>

                {loading && <p>Searching...</p>}

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <div style={{ marginTop: "20px" }}>
                    {results.map((place) => (
                        <button
                            key={place.place_id}
                            onClick={() => handleSelect(place)}
                            style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "12px",
                                marginBottom: "8px",
                                background: "#f5f5f5",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            {place.display_name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ManualLocationPicker;