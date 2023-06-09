import React from 'react'
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';

export const CardsProveedores = ({nombre, telefono}) => {

    return (
        <div class="w-60 m-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex flex-col items-center pb-10">
                <UserCircleIcon className="h-20 m-3 w-20 text-gray-500" />
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{nombre}</h5>
                <span class="text-sm text-gray-500 dark:text-gray-400">{telefono}</span>
                <div class="flex mt-4 space-x-3 md:mt-6">
                    <Link  class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Editar</Link>
                    <Link  class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Eliminar</Link>
                </div>
            </div>
        </div>
    )
}