import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import Dashboard from "./pages/admin/Dashboard";
import ContentForm from "./components/admin/ContentForm";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const ContentFormWrapper = ({ type }) => {
  const { id } = useParams();
  return <ContentForm type={type} id={id} />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/news/create"
                element={
                  <ProtectedRoute>
                    <ContentForm type="news" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/news/edit/:id"
                element={
                  <ProtectedRoute>
                    <ContentFormWrapper type="news" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/announcements/create"
                element={
                  <ProtectedRoute>
                    <ContentForm type="announcements" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/announcements/edit/:id"
                element={
                  <ProtectedRoute>
                    <ContentFormWrapper type="announcements" />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
