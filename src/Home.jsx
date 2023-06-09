import React, { useEffect, useState } from 'react'
import { Header } from './Header'
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const Home = () => {

  const [cantidadProductos, setCantidadProductos] = useState([]);
  const [cantidadClientes, setCantidadClientes] = useState([]);
  const [cantidadVentas, setCantidadVentas] = useState([]);


  const obtenerCantidadProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/CantidadProductos");
      const data = await response.json();
      setCantidadProductos(data);
    } catch (error) {
      console.error('Error al obtener cantidad de productos', error)
    }
  }

  const obtenerCantidadClientes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/CantidadClientes");
      const data = await response.json();
      setCantidadClientes(data);
    } catch (error) {
      console.error('Error al obtener cantidad de clientes', error)
    }
  }

  const obtenerCantidadVentas = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/CantidadVentasRealizadas");
      const data = await response.json();
      setCantidadVentas(data);
    } catch (error) {
      console.error('Error al obtener cantidad de ventas realizadas', error)
    }
  }

  useEffect(() => {
    obtenerCantidadProductos();
    obtenerCantidadClientes();
    obtenerCantidadVentas();
  }, []);


  console.log(cantidadProductos);

  return (
    <div>
      <Header />
      <section class="px-4 py-12 mx-auto max-w-7xl">
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div class="border flex flex-row items-center p-5 card">
            <div class="flex items-center justify-center w-10 h-10 text-pink-700 bg-pink-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-none w-5 h-5">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h2 class="mb-1 text-lg font-bold leading-none text-gray-900 truncate">
                {
                  cantidadVentas.map(ventas => (
                    ventas.TotalSalidas
                  ))
                }
              </h2>  
              <p class="text-sm leading-none text-gray-600">Ventas Realizadas</p>
            </div>
          </div>
          <div class="flex flex-row items-center p-5 card border">
            <div class="flex items-center justify-center w-10 h-10 text-green-700 bg-green-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-none w-5 h-5">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h2 class="mb-1 text-lg font-bold leading-none text-gray-900 truncate">
                {
                  cantidadProductos.map(cantidad => (
                    cantidad.TotalProductos
                  ))
                }
              </h2>
              <p class="text-sm leading-none text-gray-600">Total de productos</p>
            </div>
          </div>
          <div class="flex flex-row items-center p-5 card border">
            <div class="flex items-center justify-center w-10 h-10 text-red-700 bg-red-100 rounded">
              <UserCircleIcon className="flex-none h-5 w-5" />
            </div>
            <div class="ml-3">
              <h2 class="mb-1 text-lg font-bold leading-none text-gray-900 truncate">
                {
                  cantidadClientes.map(clientes => (
                    clientes.TotalClientes
                  ))
                }
              </h2>
              <p class="text-sm leading-none text-gray-600">Total de clientes</p>
            </div>
          </div>
          <div class="flex flex-row items-center p-5 card border">
            <div class="flex items-center justify-center w-10 h-10 text-yellow-700 bg-yellow-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="flex-none w-5 h-5">
                <path
                  fill-rule="evenodd"
                  d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h2 class="mb-1 text-lg font-bold leading-none text-gray-900 truncate">12,655</h2>
              <p class="text-sm leading-none text-gray-600">Click through rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
