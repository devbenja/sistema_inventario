import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { IoMdTrash } from "react-icons/io";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./App.css";
export const Compras = () => {
  const MySwal = withReactContent(Swal);

  const [ventaHabilitada, setVentaHabilitada] = useState(false);
  const [totalPagado, setTotalPagado] = useState(0);
  const [vuelto, setVuelto] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);
  const [productosEnTabla, setProductosEnTabla] = useState([]);
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
  useEffect(() => {
    console.log("Productos en tabla actualizados:", productosEnTabla);
  }, [productosEnTabla]);

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
  const handleTotalChange = (event) => {
    setTotal(event.target.value);
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

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/Productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
    }
  };

  //! ...
  const handleRealizarCompra = async () => {
    try {
      const totalVenta = productosEnTabla.reduce(
        (total, producto) => total + parseFloat(producto.total),
        0
      );

      // console.log("Datos a enviar al backend:", {
      //   nombreProveedor,
      //   total: totalVenta,
      //   productosEnVenta: productosEnTabla,
      //   totalPagado: totalPagado,
      //   vuelto: vuelto,
      // });

      if (totalPagado < totalVenta) {
        MySwal.fire("Pago insuficiente", "", "error");
        return;
      }

      const response = await fetch("http://localhost:5000/api/GenerarEntrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreProveedor,
          totalVenta: totalVenta,
          productosEnVenta: productosEnTabla,
          totalPagado: totalPagado,
          vuelto: vuelto,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        MySwal.fire(
          "Realización de Compra",
          "Compra realizada correctamente",
          "success"
        );
        setMensajeExitoso(data.mensaje);
        setMostrarAlertaExitosa(true);

        setTimeout(() => {
          setMostrarAlertaExitosa(false);
        }, 3000);

        // Limpiar los campos de entrada después de crear la venta
        setNombreProveedor("");
        setProductosEnTabla([]);
        setTotalPagado("");
        setVuelto("");
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

  useEffect(() => {
    obtenerProveedores();
    obtenerProductos();
  }, []);

  useEffect(() => {
    const cantidadValue = parseFloat(cantidad);
    const precioValue = parseFloat(precio);
    const descuentoValue = parseFloat(descuento);

    const subtotalValue = cantidadValue * precioValue;

    // Calcular el IVA
    const ivaValue = subtotalValue * 0.15;

    // Calcular el subtotal incluyendo el IVA
    const subtotalMasIvaValue = subtotalValue + ivaValue;

    // Calcular el total con el descuento aplicado
    const totalDescuentoValue =
      subtotalMasIvaValue * (1 - descuentoValue / 100);

    setSubtotal(subtotalValue);
    setIva(ivaValue);
    setTotal(totalDescuentoValue);
    setTotalMasIva(subtotalMasIvaValue);

    // Calcular el vuelto
    const totalVenta = totalDescuentoValue;
  }, [cantidad, precio, totalPagado, descuento]);

  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [totalMasIva, setTotalMasIva] = useState(0);

  const handleTotalPagadoChange = (event) => {
    const totalPagadoValue = parseFloat(event.target.value);
    setTotalPagado(totalPagadoValue);
  };

  const handleAgregarProducto = async () => {
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

        setTimeout(() => {
          setMensajeError("");

          setMostrarAlertaError(false);
        }, 3000);
        return;
      }

      const productoSeleccionado = productos.find(
        (producto) => producto.Nombre === nombreProducto
      );

      // Verificar si el producto existe
      if (!productoSeleccionado) {
        setMensajeError("Producto no encontrado");
        setMostrarAlertaError(true);
        setMensajeExitoso("");
        setMostrarAlertaExitosa(false);

        setTimeout(() => {
          setMensajeError("");
          setMostrarAlertaError(false);
        }, 3000);
        return;
      }

      // Realizar la solicitud para obtener el stock del producto
      const response = await fetch(
        `http://localhost:5000/api/VerificarStock/${nombreProducto}`
      );

      // Verificar si la respuesta es exitosa (código 200)
      if (!response.ok) {
        throw new Error("Error al obtener el stock del producto");
      }

      const data = await response.json();

      const stock = data.stock;

      if (stock >= parseInt(cantidad)) {
        const subtotal = cantidad * precio;

        // Si el stock es suficiente, agregar o actualizar el producto en la tabla
        const productoExistente = productosEnTabla.find(
          (producto) => producto.nombre === nombreProducto
        );

        // if (productoExistente) {
        //   // Si el producto ya existe en la tabla, actualizamos los datos
        //   const nuevaCantidad =
        //     parseInt(productoExistente.cantidad) + parseInt(cantidad);

        //   const nuevoSubtotal = nuevaCantidad * precio;
        //   const nuevoTotal =
        //     nuevoSubtotal * (1 + iva / 100) * (1 - descuento / 100);

        //   const productoActualizado = {
        //     ...productoExistente,
        //     cantidad: nuevaCantidad,
        //     subtotal: nuevoSubtotal,
        //     total: nuevoTotal,
        //     nombreProveedor: nombreProveedor,
        //     // totalPagado: totalPagado,
        //     // vuelto: vuelto,
        //   };

        //   // Actualizar el producto existente en la lista
        //   setProductosEnTabla((prevProductos) =>
        //     prevProductos.map((producto) =>
        //       producto.nombre === nombreProducto
        //         ? productoActualizado
        //         : producto
        //     )
        //   );
        if (productoExistente) {
          const nuevaCantidad =
            parseInt(productoExistente.cantidad) + parseInt(cantidad);

          const nuevoSubtotal = nuevaCantidad * precio;

          // Calculamos el nuevo IVA usando el nuevo subtotal
          const nuevoIva = nuevoSubtotal * 0.15;

          // Calculamos el nuevo total sumando el nuevo subtotal y el nuevo IVA,
          // y aplicando el descuento si es necesario
          const nuevoTotal =
            nuevoSubtotal +
            nuevoIva -
            (nuevoSubtotal + nuevoIva) * (descuento / 100);

          const productoActualizado = {
            ...productoExistente,
            cantidad: nuevaCantidad,
            subtotal: nuevoSubtotal,
            iva: nuevoIva, // Actualizamos el valor del IVA
            total: nuevoTotal,
            nombreProveedor: nombreProveedor,
          };

          // Actualizar el producto existente en la lista
          setProductosEnTabla((prevProductos) =>
            prevProductos.map((producto) =>
              producto.nombre === nombreProducto
                ? productoActualizado
                : producto
            )
          );
        } else {
          // Si el producto no existe en la tabla, lo agregamos
          const nuevoProducto = {
            idProducto: productos.find(
              (producto) => producto.Nombre === nombreProducto
            ).IdProducto,
            nombre: nombreProducto,
            cantidad: cantidad,
            precio: precio,
            descuento: descuento,
            iva: iva,
            subtotal: subtotal,
            total: total,
            nombreProveedor: nombreProveedor,
            // totalPagado: totalPagado,
            // vuelto: vuelto,
          };
          setProductosEnTabla((prevProductos) => [
            ...prevProductos,
            nuevoProducto,
          ]);
        }

        setNombreProducto("");
        setCantidad("");
        setPrecio("");
        setDescuento(0);

        // console.log("Productos en tabla actualizados:", productosEnTabla);
      } else {
        MySwal.fire(
          "Error",
          "No hay suficientes productos en el stock",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al obtener el stock del producto:", error);
    }
  };

  useEffect(() => {
    // Calcular el total de la venta actual en la tabla
    const totalVenta = productosEnTabla.reduce((total, producto) => {
      return total + parseFloat(producto.total);
    }, 0);

    // Calcular el vuelto restando el totalPagado del total de la venta
    const vueltoValue = totalPagado - totalVenta;
    setVuelto(vueltoValue);
  }, [productosEnTabla, totalPagado]);

  useEffect(() => {
    setVentaHabilitada(productosEnTabla.length > 0);
  }, [productosEnTabla]);

  const calcularTotalVenta = () => {
    let totalVenta = 0;
    productosEnTabla.forEach((producto) => {
      totalVenta += parseFloat(producto.total);
    });
    return totalVenta;
  };

  const mensajeNoProductos = (
    <div className="mt-4 text-center text-gray-600">
      No hay productos agregados.
    </div>
  );

  const eliminarProducto = (indice) => {
    setProductosEnTabla((prevProductos) =>
      prevProductos.filter((_, index) => index !== indice)
    );
  };
  return (
    <div>
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-200 gap-1 p-5">
        <div className="md:col-span-1 col-span-1 bg-white p-5 rounded-lg shadow-lg">
          <h2 className="font-semibold text-xl mb-6">Generar Compra</h2>

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
          <form>
            <div className="flex gap-2">
              <div className="mb-4 w-1/2">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="country"
                >
                  Proveedor
                </label>
                <select
                  required
                  id="country"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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
              <div className="mb-4 w-1/2">
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
                  <option>-- Seleccionar --</option>
                  {productos.map((producto) => (
                    <option value={producto.Nombre} key={producto.IdProducto}>
                      {producto.Nombre}
                    </option>
                  ))}
                </select>
              </div>
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
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
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
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="descuento"
                >
                  Descuento (%)
                </label>
                <input
                  value={descuento}
                  onChange={(e) => setDescuento(parseFloat(e.target.value))}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="mb-8">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="iva"
                >
                  IVA
                </label>
                <input
                  value={iva}
                  readOnly
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="name"
                >
                  Subtotal
                </label>
                <input
                  value={subtotal}
                  readOnly
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="total"
              >
                Total
              </label>
              <input
                value={total}
                onChange={handleTotalChange}
                readOnly
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAgregarProducto}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
              >
                Agregar producto
              </button>

              <button
                type="button"
                disabled={!ventaHabilitada} // Deshabilita el botón cuando ventaHabilitada es false
                onClick={handleRealizarCompra}
                className={`${
                  ventaHabilitada
                    ? "bg-green-500 hover:bg-blue-700"
                    : "bg-gray-400 pointer-events-none"
                } text-white font-semibold py-2 px-4 rounded w-full`}
              >
                Realizar Compra
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2 col-span-2 bg-white p-5 rounded-lg shadow-lg ">
          {/* Agregar la lista y enlaces aquí */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Compras Realizadas</h2>
              <Link
                to="/ComprasRealizadas"
                className="text-blue-500 hover:underline"
              >
                Ver todas las Compras realizadas
              </Link>
            </div>
          </div>
          {/* Fin de la lista y enlaces */}
          <table className="App-auto w-full" id="table">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center border">
              <tr>
                <th scope="col" className="py-3 border">
                  Codigo
                </th>
                <th scope="col" className="py-3 border">
                  Nombre Producto
                </th>

                <th scope="col" className="py-3 border">
                  Cantidad
                </th>
                <th scope="col" className="py-3 border">
                  Precio
                </th>
                <th scope="col" className="py-3 border">
                  Subtotal
                </th>
                <th scope="col" className="py-3 border">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-y-4">
              {productosEnTabla.map((producto, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">
                    {producto.idProducto}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {producto.nombre}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {producto.cantidad}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {producto.precio}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {producto.subtotal}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className=" h-full bg-red-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => eliminarProducto(index)}
                      title="Eliminar Producto"
                    >
                      <IoMdTrash className="w-15" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mensaje cuando no hay productos */}
          <div className="mb-2 font-bold">
            {productosEnTabla.length === 0 && mensajeNoProductos}
          </div>
          {/* Total de venta */}
          {productosEnTabla.length > 0 && (
            <div className="mt-4 flex justify-center items-center">
              <div className="inline-block">
                <label className="block text-gray-700 font-bold mb-2">
                  Total de Compra:
                </label>
              </div>
              <p className="text-lg font-semibold inline-block mb-2 ms-2">
                {calcularTotalVenta()} C$
              </p>
            </div>
          )}
          <hr />
          {/* Campo de entrada para el Total Pagado */}
          {productosEnTabla.length > 0 && (
            <div className="flex gap-2">
              <div className="mt-4 flex justify-center items-center">
                <div className="inline-block">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Total Pagado por el Cliente:
                  </label>
                  <input
                    type="number"
                    value={totalPagado}
                    onChange={handleTotalPagadoChange}
                    required
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Vuelto */}
              <div className="mt-4 flex justify-center items-center">
                <div className="inline-block">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Cambio:
                  </label>
                  <input
                    type="number"
                    value={vuelto}
                    readOnly
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Campo de entrada para el Total Pagado */}
        </div>
      </div>
    </div>
  );
};
