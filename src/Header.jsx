import { Link } from "react-router-dom";

export const Header = () => {

    // const user = { rol: 'user' };

    /**
     
    {user.rol === 'admin' &&

                            <>
                                <Link to="/Create" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Crear Usuarios</Link>
                                <Link to="/Compras" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Compras</Link>
                                <Link to="/Proveedores" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Proveedores</Link>
                            </>

                        }

                        {user.rol === 'user' &&

                            <>
                                <Link to="/Clientes" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Clientes</Link>
                                <Link to="/Productos" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Productos</Link>
                                <Link to="/Ventas" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Ventas</Link>
                            </>

                        }
     */

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/Home" className="text-white text-lg font-semibold">INVENT</Link>
                    </div>
                    <div className="hidden md:flex">

                        <Link to="/Create" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Crear Usuarios</Link>
                        <Link to="/Compras" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Compras</Link>
                        <Link to="/Proveedores" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Proveedores</Link>
                        <Link to="/Clientes" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Clientes</Link>
                        <Link to="/Productos" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Productos</Link>
                        <Link to="/Ventas" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">Ventas</Link>

                    </div>
                </div>
            </div>
        </nav>
    )
}
