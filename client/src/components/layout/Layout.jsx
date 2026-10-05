import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
    return (
        <>
            <Navbar />
            <main style={{ padding: 'var(--space-5)', maxWidth: '900px', margin: '0 auto' }}>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;