import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Classroom
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-blue-700">
                Home
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md hover:bg-blue-700"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md hover:bg-blue-700"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md hover:bg-blue-700"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
