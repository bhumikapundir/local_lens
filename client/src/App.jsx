import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* सबके लिए खुले पेज */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* सिर्फ़ logged in users के लिए */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;