import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import Modal from "react-modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./App.css";
import { IoMdTrash } from "react-icons/io";
import { BiEdit } from "react-icons/bi";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Compras = () => {
  const MySwal = withReactContent(Swal);

  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporteCompras, setReporteCompras] = useState([]);
  const [modalVisible2, setModalVisible2] = useState(false);

  // const [modalVisible2, setModalVisible2] = useState(false);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const [entradas, setEntradas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [nombreProducto, setNombreProducto] = useState("");
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [mensajeExitoso, setMensajeExitoso] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarAlertaExitosa, setMostrarAlertaExitosa] = useState(false);
  const [mostrarAlertaError, setMostrarAlertaError] = useState(false);

  const [precio, setPrecio] = useState("");
  const [compras, setCompras] = useState([]);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const abrirConfirmModal = () => {
    setConfirmModalVisible(true);
  };

  const cerrarConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
  };

  const handleNombreProveedorChange = (event) => {
    setNombreProveedor(event.target.value);
  };

  const handleNombreProductoChange = async (event) => {
    const nombreProducto = event.target.value;

    setNombreProducto(nombreProducto);

    try {
      const url = `http://localhost:5000/api/ProductoPrecioCompra?nombre=${nombreProducto}`;
      const response = await fetch(url);
      const data = await response.json();
      setPrecio(data.precio);
    } catch (error) {
      console.error("Error en la petición:", error);
    }

  };

  const handleIdCantidadChange = (event) => {
    setCantidad(event.target.value);
  };

  const obtenerProveedores = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/Proveedores");
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/Productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const proveedorSeleccionado = proveedores.find(
        (proveedor) => proveedor.NombreProveedor === nombreProveedor
      );
      // Veririficar si existe el cliente
      if (!proveedorSeleccionado) {
        setMensajeError("Proveedor no encontrado");
        setMostrarAlertaError(true);
        setMensajeExitoso("");
        setMostrarAlertaExitosa(false);

        // Eliminar el mensaje de error y limpiar el formulario después de 3 segundos
        setTimeout(() => {
          setMensajeError("");
          setNombreProveedor("");
          setNombreProducto("");
          setCantidad("");
          setMostrarAlertaError(false);
        }, 3000);
        return;
      }

      // Obtener el stock del producto seleccionado
      const productoSeleccionado = productos.find(
        (producto) => producto.Nombre === nombreProducto
      );

      // Verificar si el producto existe
      if (!productoSeleccionado) {
        setMensajeError("Producto no encontrado");
        setMostrarAlertaError(true);
        setMensajeExitoso("");
        setMostrarAlertaExitosa(false);

        // Eliminar el mensaje de error y limpiar el formulario después de 3 segundos
        setTimeout(() => {
          setMensajeError("");
          setNombreProducto("");
          setNombreProveedor("");
          setCantidad("");
          setMostrarAlertaError(false);
        }, 3000);
        return;
      }

      const response = await fetch("http://localhost:5000/api/GenerarEntrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombreProducto, nombreProveedor, cantidad, precio , subtotal, total, iva }),
      });

      var data = await response.json();

      if (response.ok) {
        Swal.fire('Realizaciòn de compra', 'Compra realizada correctamente', 'success')
        setMensajeExitoso(data.mensaje);
        setMostrarAlertaExitosa(true);
        // Limpiar los campos de entrada después de crear el usuario
        setNombreProducto("");
        setNombreProveedor("");
        setCantidad("");
        setMensajeError("");
        setMostrarAlertaError(false);

        // Ocultara la alerta luego de 3 seg

        setTimeout(() => {
          setMostrarAlertaExitosa(false);
        }, 3000);
        // Actualizar la lista de compras desde el backend
        await actualizarCompras();
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

    // console.log(nombreProducto);
  };

  const obtenerEntradas = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/Entradas");
      const data = await response.json();
      setEntradas(data);
    } catch (error) {
      console.error("Error al obtener Entradas", error);
    }
  };

  useEffect(() => {
    obtenerEntradas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/reporte-compras",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechaInicio, fechaFin }),
        }
      );
      console.log(response); // Imprime la respuesta completa del servidor en la consola del navegador
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Imprime los datos de la respuesta del servidor en la consola del navegador
        if (data.length === 0) {
          setModalVisible2(true);
        } else {
          setReporteCompras(data);
        }
      } else {
        console.error("Error al generar el reporte de ventas");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const actualizarCompras = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/Entradas");
      if (response.ok) {
        const data = await response.json();
        // setReporteCompras(data);/*esto es para los reportes */
        setCompras(data);
      } else {
        console.error("Error al obtener las ventas");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    actualizarCompras();
  }, []);
  const mostrarModalSinRegistros = () => {
    setModalVisible2(true);
  };

  function drawFooter(doc, pageNumber) {
    const footerText = `Página ${pageNumber}`;
    const x = doc.internal.pageSize.getWidth() / 2;
    const y = doc.internal.pageSize.getHeight() - 10;

    // Ajustar el tamaño de fuente y el estilo
    doc.setFontSize(8);
    doc.setFont("normal");

    doc.text(footerText, x, y, { align: "center" });
  }

  const handleDownloadPDF = () => {
    const table = document.querySelector("#table");
    const columns = Array.from(
      table.querySelectorAll("th:not(:last-child)")
    ).map((headerCell) => headerCell.innerText);
    const data = Array.from(table.querySelectorAll("tr"))
      .slice(1)
      .map((row) =>
        Array.from(row.querySelectorAll("td")).map((cell) => cell.innerText)
      );

    const doc = new jsPDF();

    // Agregar imagen de encabezado
    const headerImagePath = "./logo11.jpg"; // Reemplaza "ruta-de-la-imagen" con la ruta real de la imagen
    const imgWidth = doc.internal.pageSize.getWidth(); // Ancho de la imagen igual al ancho de la página
    const imgHeight = 50; // Altura de la imagen (puedes ajustarla según tus necesidades)
    const x = 0; // Posición horizontal de la imagen (comienza desde el borde izquierdo)
    const y = 10; // Posición vertical de la imagen
    doc.addImage(headerImagePath, "JPEG", x, y, imgWidth, imgHeight); // Agregar imagen al PDF

    // Fecha
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10); // Ajustar el tamaño de fuente
    doc.setFont("helvetica", "bold"); // Establecer el estilo de fuente en negrita

    const fechaText = "Fecha:";
    const fechaX = 10; // Posición horizontal del texto "Fecha:"
    const fechaTextWidth =
      (doc.getStringUnitWidth(fechaText) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const fechaActualX = fechaX + fechaTextWidth + 2; // Ajustar el espacio entre el texto y la fecha actual
    doc.text(fechaText, fechaX, imgHeight + 18); // Colocar el texto "Fecha:"
    doc.text(currentDate, fechaActualX, imgHeight + 18); // Colocar la fecha actual

    doc.setFont("helvetica", "normal"); // Restaurar el estilo de fuente normal

    // Texto centrado en la parte superior de la tabla
    const textoSuperior = "Reporte de compras";
    const textoSuperiorX = doc.internal.pageSize.getWidth() / 2;
    const textoSuperiorY = imgHeight + 25; // Ajustar la posición vertical del texto superior
    doc.setFontSize(12); // Ajustar el tamaño de fuente para el texto superior
    doc.text(textoSuperior, textoSuperiorX, textoSuperiorY, {
      align: "center",
    });

    doc.autoTable({
      head: [columns],
      body: data,
      startY: imgHeight + 30, // Ajustar la posición vertical de los datos
      didDrawCell: function (data) {
        // Dibujar bordes de las celdas
        const { table, row, column } = data;
        if (row === 0) {
          // Bordes de la fila de encabezado
          doc.setFillColor(230, 230, 230); // Color de fondo para el encabezado
          doc.rect(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            "S"
          );
        }
        // Bordes de las celdas
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
      },
    });

    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();

    // Iterar sobre cada página y agregar el pie de página
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i); // Establecer la página actual
      drawFooter(doc, i); // Agregar el pie de página
    }

    doc.save("compras.pdf");
  };

  const subtotal = cantidad * precio;

  const iva = subtotal * 0.15;

  const total = subtotal + iva;

  const eliminarCompra = async (idCompra) => {
    try {
      const compraExistente = compras.find(
        (compra) => compra.IdEntrada === idCompra
      );

      if (!compraExistente) {
        throw new Error("No se encontró la compra en la lista de compras.");
      }

      const { value } = await MySwal.fire({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de que deseas eliminar esta compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });

      if (value) {
        const response = await fetch(
          `http://localhost:5000/api/EliminarEntrada/${idCompra}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const producto = productos.find(
            (producto) => producto.Nombre === compraExistente.NombreProducto
          );

          const cantidadEliminada = compraExistente.Cantidad;
          const nuevoStock = producto.Stock - cantidadEliminada;

          const nuevosProductos = productos.map((p) => {
            if (p.Nombre === compraExistente.NombreProducto) {
              return { ...p, Stock: nuevoStock };
            }
            return p;
          });
          setProductos(nuevosProductos);

          setCompras(compras.filter((compra) => compra.IdEntrada !== idCompra));

          // Utilizar SweetAlert para mostrar la alerta de éxito al eliminar la compra
          MySwal.fire("Eliminado", "La compra ha sido eliminada.", "success");
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
      MySwal.fire(
        "Error",
        "Ocurrió un error al eliminar la compra. Por favor, inténtalo nuevamente.",
        "error"
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 bg-gray-200 gap-1 p-5">
        <div className="md:col-span-1 col-span-1 bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Generar compra</h2>
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

          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="country"
              >
                Proveedor
              </label>
              <select
                id="country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={nombreProveedor}
                onChange={handleNombreProveedorChange}
              >
                <option>-- Seleccionar --</option>
                {proveedores.map((proveedor) => (
                  <option
                    value={proveedor.NombreProveedor}
                    key={proveedor.IdProveedor}
                  >
                    {proveedor.NombreProveedor}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="city"
              >
                Producto
              </label>
              <select
                id="city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={nombreProducto}
                onChange={handleNombreProductoChange}
              >
                <option>-- Seleccionar --</option>
                {productos.map((producto) => (
                  <option value={producto.Nombre} key={producto.IdProducto}>
                    {producto.Nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="name"
              >
                Precio Compra
              </label>
              <input
                type="number"
                value={precio}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="mb-8">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="name"
                >
                  Subtotal
                </label>
                <input
                  value={subtotal}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-8">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="name"
                >
                  Total
                </label>
                <input
                  value={total}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Realizar compra
            </button>
          </form>
        </div>
        <div className="md:col-span-3 bg-white p-5 rounded-lg shadow-lg overflow-y-auto">
          <h2 className="font-semibold text-xl mb-6">Generar Reporte de Compras</h2>
          <div className="App-page mt-4">
            <div className="App-container">
              <form onSubmit={handleSubmit} className="p-5 flex items-center justify-center">
                <div className="flex flex-wrap items-center justify-center">
                  <div className="w-full lg:w-1/4 mb-2 sm:mr-2">
                    <label
                      className="text-gray-700 font-semibold mb-2"
                      htmlFor="startDate"
                    >
                      Fecha de inicio
                      <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full px-4 uppercase py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full lg:w-1/4 mb-2 sm:mr-4">
                    <label
                      className="text-gray-700 font-semibold mb-2"
                      htmlFor="endDate"
                    >
                      Fecha de fin
                      <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="w-full uppercase px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
                        required
                      />
                    </label>
                  </div>
                  <div className="flex mt-4 items-center justify-center gap-2">
                    <button
                      type="submit"
                      className="block bg-blue-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                      Generar reporte
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      id="btnPdf"
                      type="button"
                      download="ventas.pdf"
                      className="bg-blue-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded ms-5"
                    >
                      Generar PDF
                    </button>
                  </div>
                </div>
              </form>
              {/* se esta modificando para que contenga las compras asi estaba: reporteCompras */}
              {compras.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="App-auto w-full" id="table">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center border">
                      <tr>
                        <th scope="col" className="py-3 border">
                          #
                        </th>
                        <th scope="col" className="px-5 py-3 border">
                          Producto
                        </th>
                        <th scope="col" className="px-7 py-3 border">
                          Proveedor
                        </th>
                        <th scope="col" className="px-2 py-2 border">
                          Cantidad
                        </th>
                        <th scope="col" className="px-2 py-2 border">
                          Precio
                        </th>
                        <th scope="col" className="py-2 px-3 border">
                          Subtotal
                        </th>
                        <th scope="col" className="py-2 px-4 border">
                          IVA
                        </th>
                        <th scope="col" className="px-6 py-3 border">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 border">
                          Fecha Compra
                        </th>
                        <th scope="col" className="px-6 py-3 border">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* igual aca para rellenar seran con compra antes estaba: reporte.Compras */}
                      {compras.map((compra) => (
                        <tr
                          key={compra.IdEntrada}
                          compra={compra}
                        // eliminarCompra={eliminarCompra}
                        >
                          <td className="border px-4 py-2 text-center">
                            {compra.IdEntrada}
                          </td>
                          <td className="border px-4 py-2">
                            {compra.NombreProducto}
                          </td>
                          <td className="border px-4 py-2">
                            {compra.NombreProveedor}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {compra.Cantidad}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {compra.PrecioCompra}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {compra.SubtotalCompra} C$
                          </td>
                          
                          <td className="border px-4 py-2 text-center">
                            {compra.TotalDineroGastado} C$
                          </td>

                          <td className="border px-2 py-2 text-center">
                            {compra.IVA} C$
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {new Date (compra.FechaEntrada).toLocaleDateString()}
                          </td>
                          <td className="border px-5 py-4 flex items-center justify-center">
                            <button
                              className="flex items-center bg-red-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              // este funciona
                              // onClick={() => {
                              //   setCompraSeleccionada(compra);
                              //   abrirConfirmModal();
                              // }}
                              onClick={() => eliminarCompra(compra.IdEntrada)}
                            >
                              <IoMdTrash className="w-15" />
                            </button>

                            <button className="flex items-center ml-5 bg-green-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <BiEdit className="w-15" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              <Modal
                isOpen={modalVisible2}
                onRequestClose={() => setModalVisible2(false)}
                className="App-modal"
                overlayClassName="App-modal-overlay"
              >
                <p id="message">
                  No se encontraron registros para la fecha seleccionada.
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
                  onClick={() => setModalVisible2(false)}
                >
                  Cerrar
                </button>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
