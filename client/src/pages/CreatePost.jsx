import { useState } from "react";
import { useLocationContext } from "../context/LocationContext";
import api from "../services/api";

function CreatePost() {
    const {
        location,
        requestLocation,
    } = useLocationContext();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("COMMUNITY");
    const [locality, setLocality] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location) {
            setError("Please allow your location first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const formData = new FormData();

            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            formData.append("latitude", location.latitude);
            formData.append("longitude", location.longitude);

            if (locality.trim()) {
                formData.append("locality_name", locality.trim());
            }

            const response = await api.post("/posts", formData);

            console.log("Post created:", response.data);

            setMessage("Post created successfully! 🎉");

            setTitle("");
            setContent("");
            setLocality("");
        } catch (err) {
            console.error("Create post error:", err);

            setError(
                err.message || "Failed to create post. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>
            <h1>Create a Local Post</h1>

            {!location && (
                <div style={{ marginBottom: "20px" }}>
                    <p>
                        We need your location to create a nearby post.
                    </p>

                    <button onClick={requestLocation}>
                        Get My Location
                    </button>
                </div>
            )}

            {location && (
                <p>
                    📍 Location detected
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Title</label>
                    <br />

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's happening?"
                        required
                        minLength={3}
                        maxLength={200}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Content</label>
                    <br />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell your local community about it..."
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={6}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Category</label>
                    <br />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            padding: "10px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="ALERT">Alert</option>
                        <option value="TRAFFIC">Traffic</option>
                        <option value="NEWS">News</option>
                        <option value="EVENT">Event</option>
                        <option value="ANNOUNCEMENT">
                            Announcement
                        </option>
                        <option value="LOST_FOUND">
                            Lost & Found
                        </option>
                        <option value="COMMUNITY">
                            Community
                        </option>
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Locality (optional)</label>
                    <br />

                    <input
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder="e.g. Rajpur Road"
                        maxLength={150}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                        }}
                    />
                </div>

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                {message && (
                    <p style={{ color: "green" }}>
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading || !location}
                    style={{
                        padding: "12px 20px",
                        marginTop: "10px",
                    }}
                >
                    {loading ? "Creating..." : "Create Post"}
                </button>
            </form>
        </div>
    );
}

export default CreatePost;