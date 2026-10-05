import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">
                <MapPin size={22} />
                <span>LocalLens</span>
            </NavLink>

            <div className="navbar-links">
                <NavLink to="/feed">Feed</NavLink>

                {/* loading के दौरान कुछ मत दिखाओ, ताकि Login/Logout झपके नहीं */}
                {!loading && user && (
                    <>
                        <span className="navbar-user">
                            <User size={16} />
                            {user.name}
                        </span>
                        <button type="button" className="navbar-logout" onClick={handleLogout}>
                            <LogOut size={16} />
                            Logout
                        </button>
                    </>
                )}

                {!loading && !user && (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;