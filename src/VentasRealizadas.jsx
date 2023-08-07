import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { IoMdTrash } from "react-icons/io";
import { FaFileInvoice, FaPrint, FaEye, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const VentasRealizadas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  useEffect(() => {
    const obtenerVentasRealizadas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/Salidas");
        const data = await response.json();
        setVentas(data);
      } catch (error) {
        console.error("Error al obtener las ventas realizadas:", error);
      }
    };

    obtenerVentasRealizadas();
  }, []);

  const mostrarAlertaEliminar = (ventaId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la venta y no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarVenta(ventaId);
      }
    });
  };

  const eliminarVenta = async (ventaId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/EliminarVenta/${ventaId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setVentas((prevVentas) =>
          prevVentas.filter((venta) => venta.Codigo !== ventaId)
        );

        Swal.fire(
          "Venta eliminada",
          "La venta ha sido eliminada correctamente",
          "success"
        );
      } else {
        console.error("Error al eliminar la venta");
      }
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    }
  };

  const obtenerDetallesVenta = async (ventaId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/DetallesVenta/${ventaId}`
      );
      const data = await response.json();
      setDetallesVenta(data);
    } catch (error) {
      console.error("Error al obtener los detalles de la venta:", error);
    }
  };

  const mostrarDetallesVenta = async (venta) => {
    setVentaSeleccionada(venta);
    await obtenerDetallesVenta(venta.Codigo);
    setMostrarDetalles(true);
  };

  const cerrarDetallesVenta = () => {
    setVentaSeleccionada(null);
    setDetallesVenta([]);
    setMostrarDetalles(false);
  };

  return (
    <div>
      <Header />
      <div className="md:col-span-2 col-span-2 bg-white p-5 rounded-lg shadow-lg">
        <h2 className="mb-4">Ventas realizadas</h2>
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
                Cliente
              </th>
              <th scope="col" className="py-3 border">
                Vendedor
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
            {ventas.map((venta) => (
              <tr key={venta.Codigo} venta={venta}>
                <td className="border px-4 py-2 text-center">{venta.Codigo}</td>
                <th className="border px-4 py-2 text-center">
                  {new Date(venta.Fecha).toLocaleDateString()}
                </th>
                <td className="border px-4 py-2 text-center">
                  {venta.Cliente}
                </td>
                <td className="border px-4 py-2 text-center">
                  {venta.Vendedor}
                </td>
                <td className="border px-4 py-2 text-center">{venta.Total}</td>
                <td className="border px-4 py-2 flex justify-evenly">
                  <button
                    className="h-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => mostrarDetallesVenta(venta)}
                  >
                    <FaShoppingCart className="w-15" />
                  </button>
                  <button className=" h-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaPrint className="w-15" />
                  </button>
                  <button
                    className=" h-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // onClick={() => eliminarProducto(index)}
                    onClick={() => mostrarAlertaEliminar(venta.Codigo)}
                  >
                    <IoMdTrash className="w-15" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarDetalles && detallesVenta.length > 0 && (
          <div className="mt-4">
            <h3>Detalles de la Venta</h3>
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
                {detallesVenta.map((detalle) => (
                  <tr key={detalle.ProductoId}>
                    <td className="border px-4 py-2 text-center">
                      {detalle.IdVenta}
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
              onClick={cerrarDetallesVenta}
            >
              Cerrar Detalles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VentasRealizadas;
