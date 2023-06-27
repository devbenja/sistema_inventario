import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import { Home } from './Home';
import { Register } from './Register';
import { Clientes } from './Clientes';
import { Proveedores } from './Proveedores';
import { Productos } from './Productos';
import { Compras } from './Compras';
import { Ventas } from './Ventas';

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<>Not found</>} />
          <Route path="/Home" exact element={<Home />} />
          <Route path="/Inicio" element={<Navigate to="/Home" />} />
          <Route path="/Create" element={<Register />} />
          <Route path="/CrearUsuario" element={<Navigate to="/Create" />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/CrearCliente" element={<Navigate to="/Clientes" />} />
          <Route path="/Proveedores" element={<Proveedores />} />
          <Route path="/CrearProveedores" element={<Navigate to="/Proveedores" />} />
          <Route path='/Productos' element={<Productos />} />
          <Route path="/CrearProductos" element={<Navigate to="/Productos" />} />
          <Route path='/Compras' element={<Compras />} />
          <Route path="/CrearCompra" element={<Navigate to="/Compras" />} />
          <Route path='/Ventas' element={<Ventas />} />
          <Route path="/CrearVenta" element={<Navigate to="/Ventas" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


