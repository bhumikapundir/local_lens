import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';

import LocationTest from './LocationTest';
import LocationSettingsTest from './LocationSettingsTest';
import ManualLocationPicker from './ManualLocationPicker';

import { LocationProvider, useLocationContext } from './context/LocationContext';

function AppContent() {
  const {
    status,
    setManualLocation,
  } = useLocationContext();

  return (
    <>
      {status === 'denied' && (
        <ManualLocationPicker
          onSelect={setManualLocation}
        />
      )}

      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/location-test"
            element={<LocationTest />}
          />

          <Route
            path="/location-settings"
            element={<LocationSettingsTest />}
          />

          <Route
            path="/create-post"
            element={<CreatePost />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/feed"
              element={<Feed />}
            />
          </Route>

        </Route>

      </Routes>
    </>
  );
}

function App() {
  return (
    <LocationProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LocationProvider>
  );
}

export default App;