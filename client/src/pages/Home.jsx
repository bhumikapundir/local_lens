import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
    const { user, loading } = useAuth();

    return (
        <div className="home">
            <MapPin size={48} className="home-icon" />
            <h1>Your neighborhood's real&#8209;time pulse.</h1>
            <p className="home-subtitle">
                Discover verified local news, events and alerts within 5-10 km of you.
            </p>

            {/* loading के दौरान बटन मत दिखाओ, ताकि झपकें नहीं */}
            {!loading && (
                <div className="home-actions">
                    {user ? (
                        <>
                            <p className="home-welcome">Welcome back, {user.name}!</p>
                            <Link to="/feed" className="home-btn home-btn-primary">
                                Go to your feed
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="home-btn home-btn-primary">
                                Get started
                            </Link>
                            <Link to="/login" className="home-btn home-btn-secondary">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;