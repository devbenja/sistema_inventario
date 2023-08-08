import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { IoMdTrash } from "react-icons/io";
import { FaFileInvoice, FaPrint, FaEye, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ComprasRealizadas = () => {
  const [compras, setCompras] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [detallesCompra, setDetallesCompra] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  useEffect(() => {
    const obtenerComprasRealizadas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Entradas");
        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error("Error al obtener las ventas realizadas:", error);
      }
    };

    obtenerComprasRealizadas();
  }, []);

  const mostrarAlertaEliminar = (compraId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la compra y no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarCompra(compraId);
      }
    });
  };

  const eliminarCompra = async (compraId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/EliminarCompra/${compraId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCompras((prevCompras) =>
          prevCompras.filter((compra) => compra.Codigo !== compraId)
        );

        Swal.fire(
          "Compra eliminada",
          "La compra ha sido eliminada correctamente",
          "success"
        );
      } else {
        console.error("Error al eliminar la compra");
      }
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
    }
  };

  const obtenerDetallesCompra = async (compraId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/DetallesCompra/${compraId}`
      );
      const data = await response.json();
      setDetallesCompra(data);
    } catch (error) {
      console.error("Error al obtener los detalles de la compra:", error);
    }
  };

  const mostrarDetallesCompra = async (compra) => {
    setCompraSeleccionada(compra);
    await obtenerDetallesCompra(compra.Codigo);
    setMostrarDetalles(true);
  };

  const cerrarDetallesCompra = () => {
    setCompraSeleccionada(null);
    setDetallesCompra([]);
    setMostrarDetalles(false);
  };

  return (
    <div>
      <Header />
      <div className="md:col-span-2 col-span-2 bg-white p-5 rounded-lg shadow-lg">
        <h2 className="mb-4">Compras realizadas</h2>
        <table className="App-auto w-1/2" id="table">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center border">
            <tr>
              <th scope="col" className="py-3 border">
                Código
              </th>
              <th scope="col" className="py-3 border">
                Fecha
              </th>
              <th scope="col" className="py-3 border">
                Proveedor
              </th>
              <th scope="col" className="py-3 border">
                Empleado
              </th>
              <th scope="col" className="py-3 border">
                Total
              </th>
              <th scope="col" className="py-3 border">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra.Codigo} compra={compra}>
                <td className="border px-4 py-2 text-center">
                  {compra.Codigo}
                </td>
                <th className="border px-4 py-2 text-center">
                  {new Date(compra.Fecha).toLocaleDateString()}
                </th>
                <td className="border px-4 py-2 text-center">
                  {compra.Proveedor}
                </td>
                <td className="border px-4 py-2 text-center">
                  {compra.Comprador}
                </td>
                <td className="border px-4 py-2 text-center">{compra.Total}</td>
                <td className="border px-4 py-2 flex justify-evenly">
                  <button
                    className="h-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => mostrarDetallesCompra(compra)}
                  >
                    <FaShoppingCart className="w-15" />
                  </button>
                  <button className=" h-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaPrint className="w-15" />
                  </button>
                  <button
                    className=" h-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // onClick={() => eliminarProducto(index)}
                    onClick={() => mostrarAlertaEliminar(compra.Codigo)}
                  >
                    <IoMdTrash className="w-15" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarDetalles && detallesCompra.length > 0 && (
          <div className="mt-4">
            <h3>Detalles de la Compra</h3>
            <table className="App-auto w-full">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center border">
                <tr>
                  <th scope="col" className="py-3 border">
                    Codigo
                  </th>
                  <th scope="col" className="py-3 border">
                    Producto
                  </th>
                  <th scope="col" className="py-3 border">
                    Descripcion
                  </th>
                  <th scope="col" className="py-3 border">
                    Cantidad
                  </th>
                  <th scope="col" className="py-3 border">
                    Precio
                  </th>
                  <th scope="col" className="py-3 border">
                    Descuento
                  </th>
                  <th scope="col" className="py-3 border">
                    Subtotal
                  </th>
                  <th scope="col" className="py-3 border">
                    Iva
                  </th>
                  <th scope="col" className="py-3 border">
                    Total
                  </th>
                  {/* ... otras columnas de detalles ... */}
                </tr>
              </thead>
              <tbody>
                {detallesCompra.map((detalle) => (
                  <tr key={detalle.ProductoId}>
                    <td className="border px-4 py-2 text-center">
                      {detalle.IdCompra}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Producto}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Descripcion}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Cantidad}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Precio}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Descuento}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Subtotal}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.IVA}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {detalle.Total}
                    </td>
                    {/* ... otras celdas de detalles ... */}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={cerrarDetallesCompra}
            >
              Cerrar Detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprasRealizadas;
