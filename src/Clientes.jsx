import React, { useState, useEffect } from 'react'
import { Header } from './Header'
import { CardsCliente } from './components/CardsCliente';

export const Clientes = () => {

    const [nombreCliente, setNombreCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [correoCliente, setCorreoCliente] = useState('');
    const [direccionCliente, setDireccionCliente] = useState('');
    const [clientes, setClientes] = useState([0]);
    const [isOpen, setIsOpen] = useState(false);
    const [mensajeExitoso, setMensajeExitoso] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarAlertaExitosa, setMostrarAlertaExitosa] = useState(false);
    const [mostrarAlertaError, setMostrarAlertaError] = useState(false);
    const [cardUpdate, setCardUpdate] = useState(false);


    // Abrir el modal
    const openModal = () => {
        setIsOpen(true);
    };

    // Cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };

    const handleNombreClienteChange = (event) => {
        setNombreCliente(event.target.value);
    };

    const handleTelefonoClienteChange = (event) => {
        setTelefonoCliente(event.target.value);
    };

    const handleCorreoClienteChange = (event) => {
        setCorreoCliente(event.target.value);
    };

    const handleDireccionClienteChange = (event) => {
        setDireccionCliente(event.target.value);
    };



    // Esta funcion manda los datos en la peticion post
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/CrearCliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreCliente, telefonoCliente, correoCliente, direccionCliente })
            });

            var data = await response.json();

            if (response.ok) {
                setMensajeExitoso(data.mensaje);
                setMostrarAlertaExitosa(true);
                // Limpiar los campos de entrada después de crear el usuario
                setNombreCliente('');
                setTelefonoCliente('');
                setCorreoCliente('');
                setDireccionCliente('');
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

        setCardUpdate(true)

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
        setCardUpdate(false)
    }, [cardUpdate]);

    return (
        <div>
            <>
                {
                    isOpen && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 modal-backdrop bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-2/5 mx-auto mb-60">
                                <h2 className="text-xl font-semibold mb-10">Crear Cliente</h2>
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
                                <form onSubmit={handleFormSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Nombre</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={nombreCliente}
                                            onChange={handleNombreClienteChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="mb-7">
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Telefono</label>
                                        <input
                                            type="text"
                                            id="email"
                                            value={telefonoCliente}
                                            onChange={handleTelefonoClienteChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="mb-7">
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Correo</label>
                                        <input
                                            type="text"
                                            id="email"
                                            value={correoCliente}
                                            onChange={handleCorreoClienteChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="mb-7">
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Direccion</label>
                                        <input
                                            type="text"
                                            id="email"
                                            value={direccionCliente}
                                            onChange={handleDireccionClienteChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-3 sm:justify-center lg:justify-end">
                                        <button
                                            type="submit"
                                            className="mr-3 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Crear
                                        </button>
                                        <button
                                            className="bg-gray-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                            onClick={closeModal}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    )
                }
            </>
            <Header />
            <div className="border p-10">
                <div className="flex flex-wrap gap-5 justify-around items-center mb-4 w-full">
                    <p className="text-xl font-medium">Clientes</p>
                    <div className="flex gap-5 justify-around flex-wrap items-center">
                        <form className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">Buscar</label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                </div>
                                <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 w-full text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 blockw-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                            </div>
                        </form>

                        <button
                            className=" ml-5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={openModal}
                        >
                            Crear Cliente
                        </button>
                    </div>
                </div>
            </div>

            <div className='container px-5 py-10 mx-auto overflow-x-auto'>
                <table className=" w-full text-sm text-left text-gray-500 dark:text-gray-400" id="table">
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center'>
                        <tr>
                            <th scope="col" className="px-6 py-3">Codigo</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Telefono</th>
                            <th scope="col" className="px-6 py-3">Correo</th>
                            <th scope="col" className="px-6 py-3">Direccion</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    {
                        clientes.map(cliente => (
                            <CardsCliente 
                                key={cliente.IdCliente} 
                                setCardUpdate={setCardUpdate}  
                                id={cliente.IdCliente} nombre={cliente.NombreCliente} 
                                telefono={cliente.TelefonoCliente} 
                                correo={cliente.CorreoCliente} 
                                direccion={cliente.DireccionCliente}
                            />
                        ))
                    }
                </table>
            </div>
        </div>
    )
}
