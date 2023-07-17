import React from 'react'
import { IoMdTrash } from 'react-icons/io';
import { BiEdit } from "react-icons/bi";

export const CardsProductos = ({ nombre, descripcion, stock, id, precioC, precioV }) => {
    return (
        <tbody>
            <tr>
                <td className="border px-6 py-4 text-center">{id}</td>
                <td className="border px-6 py-4">{nombre}</td>
                <td className="border px-6 py-4">{descripcion}</td>
                <td className="border px-6 py-4 text-center">{stock}</td>
                <td className="border px-6 py-4 text-center">{precioC} C$</td>
                <td className="border px-6 py-4 text-center">{precioV} C$</td>
                <td className="border px-5 py-3 flex items-center justify-center">
                    <button className="flex items-center ml-5 bg-red-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <IoMdTrash  className='w-15' />
                    </button>
                    <button className="flex items-center ml-5 bg-green-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <BiEdit  className='w-15' />
                    </button>
                </td>
            </tr>
        </tbody>
    )
}