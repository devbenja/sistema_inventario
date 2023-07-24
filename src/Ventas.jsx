import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoMdTrash } from "react-icons/io";
import { FiFile } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./App.css";
export const Ventas = () => {
  const MySwal = withReactContent(Swal);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporteVentas, setReporteVentas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [salidas, setSalidas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [mensajeExitoso, setMensajeExitoso] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarAlertaExitosa, setMostrarAlertaExitosa] = useState(false);
  const [mostrarAlertaError, setMostrarAlertaError] = useState(false);
  const [ventas, setVentas] = useState([]);

  const [precio, setPrecio] = useState("");

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
  };
  const handleNombreClienteChange = (event) => {
    setNombreCliente(event.target.value);
  };

  const handleNombreProductoChange = async (event) => {
    const nombreProducto = event.target.value;

    setNombreProducto(nombreProducto);

    try {
      const url = `http://localhost:5000/api/ProductoPrecioVenta?nombre=${nombreProducto}`;
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
      const clienteSeleccionado = clientes.find(
        (cliente) => cliente.NombreCliente === nombreCliente
      );
      // Veririficar si existe el cliente
      if (!clienteSeleccionado) {
        setMensajeError("Cliente no encontrado");
        setMostrarAlertaError(true);
        setMensajeExitoso("");
        setMostrarAlertaExitosa(false);

        // Eliminar el mensaje de error y limpiar el formulario después de 3 segundos
        setTimeout(() => {
          setMensajeError("");
          setNombreProducto("");
          setNombreCliente("");
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
          setNombreCliente("");
          setCantidad("");
          setMostrarAlertaError(false);
        }, 3000);
        return;
      }

      const stockDisponible = productoSeleccionado.Stock;

      // Comparar la cantidad ingresada con el stock disponible
      if (cantidad > stockDisponible) {
        setMensajeError("No hay suficientes productos en stock");
        setMostrarAlertaError(true);
        setMensajeExitoso("");
        setMostrarAlertaExitosa(false);
        setTimeout(() => {
          setMensajeError("");
          setNombreProducto("");
          setNombreCliente("");
          setCantidad("");
          setMostrarAlertaError(false);
        }, 3000);
        return;
      }
      // Realizar la venta
      const response = await fetch("http://localhost:5000/api/GenerarSalida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreProducto,
          nombreCliente,
          cantidad,
          totalMasIva,
          subtotal,
          precio,
          iva,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Venta exitosa
        Swal.fire(
          "Realizaciòn de Venta",
          "Venta realizada correctamente",
          "success"
        );
        setMensajeExitoso(data.mensaje);
        setMostrarAlertaExitosa(true);

        // Actualizar el stock en la lista de productos
        const stockActualizado = stockDisponible - cantidad;
        const productoIndex = productos.findIndex(
          (producto) => producto.NombreProducto === nombreProducto
        );
        if (productoIndex !== -1) {
          productos[productoIndex].Stock = stockActualizado;
        }

        // Ocultar la alerta de éxito después de 3 segundos
        setTimeout(() => {
          setMostrarAlertaExitosa(false);

          // Verificar si el stock es menor o igual a 10
          if (stockActualizado <= 10) {
            Swal.fire(
              "Información de Stock",
              "Necesitas comprar mas productos",
              "warning"
            );
            setMensajeError("¡Necesitas comprar más productos!");
            setMostrarAlertaError(true);
            setMensajeExitoso("");
            setMostrarAlertaExitosa(false);
            setTimeout(() => {
              setMensajeError("");
              setNombreProducto("");
              setNombreCliente("");
              setCantidad("");
              setMostrarAlertaError(false);
            }, 3000);
          }
        }, 3000);

        // Limpiar los campos de entrada después de crear la venta
        setNombreProducto("");
        setNombreCliente("");
        setCantidad("");
        setMensajeError("");
        setMostrarAlertaError(false);

        // Actualizar lista de ventas
        await actualizarVentas();
      } else {
        // Error al realizar la venta
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
    // Asegurar que `fechaFin` sea el inicio del día siguiente al límite final
    const fechaFinAjustada = new Date(fechaFin);
    fechaFinAjustada.setDate(fechaFinAjustada.getDate() + 1);
    fechaFinAjustada.setHours(0, 0, 0, 0);

    try {
      const response = await fetch("http://localhost:5000/api/reporte-ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaInicio,
          fechaFin: fechaFinAjustada.toISOString(),
        }),
      });
      // console.log(response); // Imprime la respuesta completa del servidor en la consola del navegador
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.length === 0) {
          // Mostrar SweetAlert con el mensaje de advertencia
          Swal.fire({
            icon: "warning",
            title: "No se encontraron registros",
            // text: "No hay registros para la fecha seleccionada.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        } else {
          setVentas(data);
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
        setVentas(data);
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

  //! new
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
    const textoSuperior = "Reporte de Ventas";
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

    doc.save("ventas.pdf");
  };

  const subtotal = cantidad * precio;

  const iva = subtotal * 0.15;

  const totalMasIva = subtotal + iva;

  const eliminarVenta = async (idVenta) => {
    try {
      const ventaExistente = ventas.find((venta) => venta.IdSalida === idVenta);

      if (!ventaExistente) {
        throw new Error("No se encontró la venta en la lista de ventas.");
      }

      const { value } = await MySwal.fire({
        title: "Confirmar eliminación",
        text: "¿Estás seguro de que deseas eliminar esta venta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      });

      if (value) {
        const response = await fetch(
          `http://localhost:5000/api/EliminarSalida/${idVenta}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const producto = productos.find(
            (producto) => producto.Nombre === ventaExistente.NombreProducto
          );

          const cantidadDevuelta = ventaExistente.Cantidad;
          const nuevoStock = producto.Stock + cantidadDevuelta; // Se regresa la cantidad al stock

          const nuevosProductos = productos.map((p) => {
            if (p.Nombre === ventaExistente.NombreProducto) {
              return { ...p, Stock: nuevoStock };
            }
            return p;
          });
          setProductos(nuevosProductos);

          setVentas(ventas.filter((venta) => venta.IdVenta !== idVenta));

          // Utilizar SweetAlert para mostrar la alerta de éxito al eliminar la venta
          MySwal.fire("Eliminado", "La venta ha sido eliminada.", "success");
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      MySwal.fire(
        "Error",
        "Ocurrió un error al eliminar la venta. Por favor, inténtalo nuevamente.",
        "error"
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 bg-gray-200 gap-1 p-5">
        <div className="md:col-span-1 col-span-1 bg-white p-5 rounded-lg shadow-lg">
          <h2 className="font-semibold text-xl mb-6">Generar venta</h2>

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
                Cliente
              </label>
              <select
                required
                id="country"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={nombreCliente}
                onChange={handleNombreClienteChange}
              >
                <option>-- Selecciona un Cliente --</option>
                {clientes.map((cliente) => (
                  <option value={cliente.NombreCliente} key={cliente.IdCliente}>
                    {cliente.NombreCliente}
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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={nombreProducto}
                onChange={handleNombreProductoChange}
                required
              >
                <option>-- Selecciona una producto --</option>
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
                Precio Compra
              </label>
              <input
                type="number"
                value={precio}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
                inputmode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
              <div className="">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="name"
                >
                  Total
                </label>
                <input
                  value={totalMasIva}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Realizar Venta
            </button>
          </form>
        </div>

        <div className="md:col-span-3 bg-white p-5 rounded-lg shadow-lg overflow-y-auto">
          <h2 className="font-semibold text-xl">Generar Reporte de Ventas</h2>
          <div className="App-page mt-2">
            <div className="App-container">
              <form
                onSubmit={handleSubmit}
                className="p-5 flex items-center justify-center"
              >
                <div className="flex flex-wrap items-center justify-center">
                  <div className="w-full lg:w-1/4 mb-2 sm:mr-2">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="startDate"
                    >
                      Fecha de inicio
                      <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                      />{" "}
                      {/* className="App-input" */}
                    </label>
                  </div>
                  <div className="w-full lg:w-1/4 mb-2 sm:mr-4">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="endDate"
                    >
                      Fecha de fin
                      <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 "
                        required
                      />
                    </label>
                  </div>
                  <div className="flex mt-2 items-center justify-center gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
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
                      Generar pdf
                    </button>
                  </div>
                </div>
              </form>
              {/* <div style={{ maxHeight: "400px", overflowY: "auto" }}> */}
              {ventas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="App-auto w-full" id="table">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                      <tr>
                        <th scope="col" className="py-3">
                          #
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Producto
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Cliente
                        </th>
                        <th scope="col" className="py-3">
                          Cantidad
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Precio Venta
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Subtotal
                        </th>
                        <th scope="col" className="px-6 py-3">
                          IVA
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Fecha Salida
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((venta) => (
                        <tr key={venta.IdSalida} venta={venta}>
                          <td className="border px-4 py-2">{venta.IdSalida}</td>
                          <td className="border px-4 py-2 ">
                            {venta.NombreProducto}
                          </td>
                          <td className="border px-4 py-2 ">
                            {venta.NombreCliente}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {venta.Cantidad}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {venta.PrecioVenta} C$
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {venta.SubtotalVenta} C$
                          </td>
                          <td className="border px-4 py-2 ">{venta.IVA} C$</td>
                          <td className="border px-4 py-2 text-center">
                            {venta.TotalDineroIngresado} C$
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {new Date(venta.FechaSalida).toLocaleDateString()}
                          </td>
                          <td className="border px-4 py-2 flex items-center justify-center">
                            <button
                              className="flex items-center bg-red-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={() => eliminarVenta(venta.IdSalida)}
                            >
                              <IoMdTrash className="w-15" />
                            </button>

                            <button className="flex items-center ml-5 bg-green-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <FiFile className="w-15" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
          <div className="overflow-x-auto mt-8"></div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
