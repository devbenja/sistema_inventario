import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


export const Login = () => {

    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [wrong, setWrong] = useState(false);

    const handleNombreUsuarioChange = (event) => {
        setNombreUsuario(event.target.value);
    };

    const handleContrasenaChange = (event) => {
        setContrasena(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreUsuario, contrasena })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje(data.mensaje);
                setMostrarAlerta(true);
                setTimeout(() => {
                    navigate("/Inicio");
                }, 2000);
                setWrong(false)
            } else {
                setMensaje(data.mensaje);
                setWrong(true);
            }
        } catch (error) {
            console.log(error);
            setMensaje('Error de conexiòn');
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-20 py-20 mt-20 lg:px-8">

                <div className="sm:mx-auto sm:w-full  sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Iniciar Sesion
                    </h2>
                </div>

                <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
                    {wrong && (
                        <div className='space-y-2 mb-2'>
                            <div class="flex gap-2 p-2 alert text-red-700 bg-red-100" role="alert"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                {mensaje}
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Usuario
                            </label>
                            <div className="mt-2">
                                <input
                                    value={nombreUsuario}
                                    onChange={handleNombreUsuarioChange}
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={contrasena}
                                    onChange={handleContrasenaChange}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Ingresar
                            </button>
                        </div>
                    </form>

                    {mostrarAlerta && (

                        <div className='space-y-2 mt-5'>
                            <div class="flex gap-2 p-2 alert text-green-800 bg-green-100" role="alert"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                {mensaje}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
