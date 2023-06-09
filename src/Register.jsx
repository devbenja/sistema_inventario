import React from 'react'
import { useState } from 'react';
import { Header } from './Header';

export const Register = () => {

    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensajeExitoso, setMensajeExitoso] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarAlertaExitosa, setMostrarAlertaExitosa] = useState(false);
    const [mostrarAlertaError, setMostrarAlertaError] = useState(false);

    const handleNombreUsuarioChange = (event) => {
        setNombreUsuario(event.target.value);
    };

    const handleContrasenaChange = (event) => {
        setContrasena(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreUsuario, contrasena })
            });

            var data = await response.json();

            if (response.ok) {
                setMensajeExitoso(data.mensaje);
                setMostrarAlertaExitosa(true);
                // Limpiar los campos de entrada después de crear el usuario
                setNombreUsuario('');
                setContrasena('');
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

    return (
        <>
            <Header/>
            <div class="w-full py-6 mx-auto mt-20 md:w-3/5 lg:w-1/3">
                <h1 class="mb-1 mt-10 text-xl font-medium text-center text-gray-800 md:text-3xl">Crear Usuario</h1>
                <form onSubmit={handleFormSubmit} className="mt-12 space-y-4">
                    <label className="block w-full">
                        <span className="block mb-1 text-medium font-medium text-gray-700">Nombre de usuario</span>
                        <input value={nombreUsuario} onChange={handleNombreUsuarioChange} className="form-input w-full rounded" type="text" placeholder="Ingrese el nombre de usuario" required />
                    </label>
                    <label className="block">
                        <span className="block mb-1 text-medium font-medium text-gray-700">Contraseña</span>
                        <input value={contrasena} onChange={handleContrasenaChange} class="form-input w-full rounded" type="password" placeholder="••••••••" required />
                    </label>
                    <button type='submit' class="h-10 w-full text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg hover:bg-indigo-800">Crear</button>
                </form>

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
                
            </div>
        </>

    )
}
