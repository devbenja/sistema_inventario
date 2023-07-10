import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import Modal from "react-modal";
import "./App.css";
export const Ventas = () => {
    const [tablaVisible, setTablaVisible] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [reporteVentas, setReporteVentas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [salidas, setSalidas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [idProduct, setIdProducto] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [total, setTotal] = useState("");

    const [mensajeExitoso, setMensajeExitoso] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [mostrarAlertaExitosa, setMostrarAlertaExitosa] = useState(false);
    const [mostrarAlertaError, setMostrarAlertaError] = useState(false);


    const handleFechaSeleccionada = (fecha) => {
        setFechaSeleccionada(fecha);
    };
    const handleIdClienteChange = (event) => {
        setIdCliente(event.target.value);
    };

    const handleIdProductoChange = (event) => {
        setIdProducto(event.target.value);
    };

    const handleIdCantidadChange = (event) => {
        setCantidad(event.target.value);
    };


    const handleTotalChange = (event) => {
        setTotal(event.target.value);
    }

    const obtenerClientes = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Clientes");
            const data = await response.json();
            setClientes(data);
        } catch (error) {
            console.error("Error al obtener proveedores", error);
        }
    };

    const obtenerProductos = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Productos");
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener proveedores", error);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/GenerarSalida", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idProduct, idCliente, cantidad }),
            });

            var data = await response.json();

            if (response.ok) {
                setMensajeExitoso(data.mensaje);
                setMostrarAlertaExitosa(true);
                // Limpiar los campos de entrada después de crear el usuario
                setIdProducto("");
                setIdCliente("");
                setCantidad("");
                setMensajeError("");
                setMostrarAlertaError(false);

                // Ocultara la alerta luego de 3 seg

                setTimeout(() => {
                    setMostrarAlertaExitosa(false);
                }, 3000);
            } else {
                setMensajeError(data.mensaje);
                setMostrarAlertaError(true);
                setMensajeExitoso("");
                setMostrarAlertaExitosa(false);
            }
        } catch (error) {
            console.log(error);
            setMensajeError("Error de conexión");
        }
    };
    //! FUNCIONA
    const obtenerSalidas = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Salidas");
            const data = await response.json();
            setSalidas(data);
        } catch (error) {
            console.error("Error al obtener Entradas", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/reporte-ventas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fechaInicio, fechaFin }),
            });
            console.log(response); // Imprime la respuesta completa del servidor en la consola del navegador
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Imprime los datos de la respuesta del servidor en la consola del navegador
                if (data.length === 0) {
                    setModalVisible(true);
                } else {
                    setReporteVentas(data);
                }
            } else {
                console.error("Error al generar el reporte de ventas");
            }
        } catch (error) {
            console.error(error);
        }
    };
    const actualizarVentas = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/Salidas");
            if (response.ok) {
                const data = await response.json();
                setReporteVentas(data);
            } else {
                console.error("Error al obtener las ventas");
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        obtenerClientes();
        obtenerProductos();
        obtenerSalidas();
        actualizarVentas();
    }, []);

    const mostrarModalSinRegistros = () => {
        setModalVisible(true);
    };

    const precio = 20;

    console.log(total);

    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 p-50">
                <div className="p-20">
                    <h2 className="font-bold">Generar venta</h2>
                    {mostrarAlertaExitosa && (
                        <div
                            className="mt-5 flex bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700"
                            role="alert"
                        >
                            <svg
                                className="w-5 h-5 inline mr-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            <div>
                                <span className="font-medium">{mensajeExitoso}</span>
                            </div>
                        </div>
                    )}

                    {mostrarAlertaError && (
                        <div
                            className="mt-5 flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
                            role="alert"
                        >
                            <svg
                                className="w-5 h-5 inline mr-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            <div>
                                <span className="font-medium">{mensajeError}</span>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="p-10">
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="country"
                            >
                                Cliente
                            </label>
                            <select
                                required
                                id="country"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={idCliente}
                                onChange={handleIdClienteChange}
                            >
                                <option>Selecciona un cliente</option>
                                {clientes.map((cliente) => (
                                    <option value={cliente.IdCliente} key={cliente.IdCliente}>
                                        {cliente.IdCliente}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="city"
                            >
                                Producto
                            </label>
                            <select
                                id="city"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                value={idProduct}
                                onChange={handleIdProductoChange}
                                required
                            >
                                <option>Selecciona una producto</option>
                                {productos.map((producto) => (
                                    <option value={producto.IdProducto} key={producto.IdProducto}>
                                        {producto.IdProducto}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="name"
                            >
                                Cantidad
                            </label>
                            <input
                                required
                                value={cantidad}
                                onChange={handleIdCantidadChange}
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                value={total} 
                                onChange={handleTotalChange}
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
                    <h2 className="font-bold">Generar Reporte de Ventas</h2>
                    <div className="App-page">
                        <div className="App-container mt-8">
                            <form onSubmit={handleSubmit} className="mb-4">
                                {" "}
                                {/* //className="App-form" */}
                                <div className="flex flex-wrap items-center">
                                    <div className="mr-4">
                                        <label
                                            className="block text-gray-700 font-bold "
                                            htmlFor="startDate"
                                        >
                                            Fecha de inicio:
                                            <input
                                                type="date"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                className="mt-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                required
                                            />{" "}
                                            {/* className="App-input" */}
                                        </label>
                                    </div>
                                    <div className="mr-4">
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="endDate"
                                        >
                                            Fecha de fin:
                                            <input
                                                type="date"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                                className="mt-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
                                                required
                                            />
                                        </label>{" "}
                                        {/* className="App-input" */}
                                    </div>

                                    <div className="">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-7 rounded"
                                        >
                                            Generar reporte
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="overflow-x-auto mt-8">
                                {reporteVentas.length > 0 ? (
                                    <table className="App-auto table-auto" id="table">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">IdSalida</th>
                                                <th className="px-4 py-2">IdProducto</th>
                                                <th className="px-4 py-2">IdCliente</th>
                                                <th className="px-4 py-2">Cantidad</th>
                                                <th className="px-4 py-2">FechaSalida</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reporteVentas.map((venta) => (
                                                <tr key={venta.IdSalida}>
                                                    <td className="border px-4 py-2">{venta.IdSalida}</td>
                                                    <td className="border px-4 py-2">{venta.IdProducto}</td>
                                                    <td className="border px-4 py-2">{venta.IdCliente}</td>
                                                    <td className="border px-4 py-2">{venta.Cantidad}</td>
                                                    <td className="border px-4 py-2">{venta.FechaSalida}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : null}
                            </div>

                            <Modal
                                isOpen={modalVisible}
                                onRequestClose={() => setModalVisible(false)}
                                className="App-modal"
                                overlayClassName="App-modal-overlay"
                            >
                                {/* <h2>No hay registros disponibles</h2> */}
                                <p id="message">
                                    No se encontraron registros para la fecha seleccionada.
                                </p>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
                                    onClick={() => setModalVisible(false)}
                                >
                                    Cerrar
                                </button>
                            </Modal>
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-8"></div>
                </div>
            </div>
        </div>
    );
};

export default Ventas;