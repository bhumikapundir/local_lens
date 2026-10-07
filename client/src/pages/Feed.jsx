import { useEffect, useState } from "react";
import { useLocationContext } from "../context/LocationContext";
import { getNearbyFeed } from "../services/postService";

function Feed() {
    const {
        location,
        radius,
        requestLocation,
    } = useLocationContext();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!location) {
            return;
        }

        const fetchFeed = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getNearbyFeed({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius_km: radius,
                    page: 1,
                    limit: 10,
                });

                console.log("Feed response:", response);

                setPosts(response.data.posts);
            } catch (err) {
                console.error("Feed error:", err);
                setError(err.message || "Failed to load feed.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [location, radius]);

    if (!location) {
        return (
            <div style={{ padding: "40px" }}>
                <h1>Local Lens Feed</h1>

                <p>
                    We need your location to show nearby posts.
                </p>

                <button onClick={requestLocation}>
                    Get My Location
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px" }}>
            <h1>Local Lens Feed</h1>

            <p>
                Showing posts within{" "}
                <strong>{radius} km</strong>
            </p>

            {loading && <p>Loading nearby posts...</p>}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && !error && posts.length === 0 && (
                <p>
                    No posts found within {radius} km.
                </p>
            )}

            {posts.map((post) => (
                <div
                    key={post.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginTop: "15px",
                        borderRadius: "10px",
                    }}
                >
                    <h2>{post.title}</h2>

                    <p>{post.content}</p>

                    <p>
                        Category: <strong>{post.category}</strong>
                    </p>

                    <p>
                        Location: {post.locality_name || "Unknown"}
                    </p>

                    <p>
                        Distance: {post.distance_km} km
                    </p>

                    <p>
                        Posted by: {post.author?.name || "Unknown"}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default Feed;