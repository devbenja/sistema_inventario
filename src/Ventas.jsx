import React, { useState, useEffect } from 'react'
import { Header } from './Header'

export const Ventas = () => {

    const [salidas, setSalidas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [idProduct, setIdProducto] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [cantidad, setCantidad] = useState('');

    const [mensajeExitoso, setMensajeExitoso] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarAlertaExitosa, setMostrarAlertaExitosa] = useState(false);
    const [mostrarAlertaError, setMostrarAlertaError] = useState(false);

    const handleIdClienteChange = (event) => {
        setIdCliente(event.target.value);
    };

    const handleIdProductoChange = (event) => {
        setIdProducto(event.target.value);
    };

    const handleIdCantidadChange = (event) => {
        setCantidad(event.target.value);
    };

    const obtenerClientes = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Clientes");
            const data = await response.json();
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener proveedores', error)
        }
    }

    useEffect(() => {
        obtenerClientes();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Productos");
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error('Error al obtener proveedores', error)
        }
    }

    useEffect(() => {
        obtenerProductos();
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/GenerarSalida', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idProduct, idCliente, cantidad })
            });

            var data = await response.json();

            if (response.ok) {
                setMensajeExitoso(data.mensaje);
                setMostrarAlertaExitosa(true);
                // Limpiar los campos de entrada después de crear el usuario
                setIdProducto('');
                setIdCliente('');
                setCantidad('');
                setMensajeError('');
                setMostrarAlertaError(false);

                // Ocultara la alerta luego de 3 seg

                setTimeout(() => {
                    setMostrarAlertaExitosa(false);
                }, 3000);
            } else {
                setMensajeError(data.mensaje);
                setMostrarAlertaError(true);
                setMensajeExitoso('');
                setMostrarAlertaExitosa(false);
            }

        } catch (error) {
            console.log(error);
            setMensajeError('Error de conexión');
        }

    };

    const obtenerSalidas = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Salidas");
            const data = await response.json();
            setSalidas(data);
        } catch (error) {
            console.error('Error al obtener Entradas', error)
        }
    }

    useEffect(() => {
        obtenerSalidas();
    }, []);

    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 p-50">
                <div className="p-20">
                    <h2>Generar venta</h2>
                    {mostrarAlertaExitosa && (
                        <div className="mt-5 flex bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700" role="alert">
                            <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                            <div>
                                <span className="font-medium">{mensajeExitoso}</span>
                            </div>
                        </div>
                    )}

                    {mostrarAlertaError && (

                        <div className="mt-5 flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
                            <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                            <div>
                                <span className="font-medium">{mensajeError}</span>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleFormSubmit} className='p-10'>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="country">Cliente</label>
                            <select
                                required
                                id="country"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={idCliente}
                                onChange={handleIdClienteChange}
                            >
                                <option>Selecciona un cliente</option>
                                {
                                    clientes.map(cliente => (
                                        <option value={cliente.IdCliente} key={cliente.IdCliente}>{cliente.IdCliente}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="city">Producto</label>
                            <select
                                id="city"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={idProduct}
                                onChange={handleIdProductoChange}
                                required
                            >
                                <option>Selecciona una producto</option>
                                {
                                    productos.map(producto => (
                                        <option value={producto.IdProducto} key={producto.IdProducto}>{producto.IdProducto}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Cantidad</label>
                            <input
                                required
                                value={cantidad}
                                onChange={handleIdCantidadChange}
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
                <div className="p-20">
                    <h2>Ventas realizadas</h2>
                    <div className='overflow-x-auto mt-8'>
                        <table className="table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Id Entrada</th>
                                    <th className="px-4 py-2">Id Producto</th>
                                    <th className="px-4 py-2">Id Cliente</th>
                                    <th className="px-4 py-2">Cantidad</th>
                                    <th className="px-4 py-2">Fecha Salida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salidas.map(salida => (
                                    <tr key={salida.IdSalida}>
                                        <td className="border px-4 py-2">{salida.IdSalida}</td>
                                        <td className="border px-4 py-2">{salida.IdProducto}</td>
                                        <td className="border px-4 py-2">{salida.IdCliente}</td>
                                        <td className="border px-4 py-2">{salida.Cantidad}</td>
                                        <td className="border px-4 py-2">{salida.FechaSalida}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}
