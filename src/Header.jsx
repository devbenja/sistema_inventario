import { Link } from "react-router-dom";
import { useAuth } from "./context/authContext";

export const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/Home" className="text-white text-lg font-semibold">
              INVENT
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <Link
              to="/Create"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
            >
              👽 Usuarios
            </Link>
            <Link
              to="/Proveedores"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
            >
              👤 Proveedores
            </Link>
            <Link
              to="/Clientes"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
            >
              👥 Clientes
            </Link>
            <Link
              to="/Productos"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
            >
              💎 Productos
            </Link>
            <Link
              to="/Ventas"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
            >
              Ventas
            </Link>
            <Link
              to="/Compras"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
            >
              Compras
            </Link>
            {/* </div> */}
            {/* <div className="md:flex items-center"> */}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
              >
                Salir
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
              >
                Salir
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
