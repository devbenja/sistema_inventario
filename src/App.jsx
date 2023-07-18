import React from "react";
import { Home } from "./Home";
import { Register } from "./Register";
import { Clientes } from "./Clientes";
import { Proveedores } from "./Proveedores";
import { Productos } from "./Productos";
import { Compras } from "./Compras";
import { Ventas } from "./Ventas";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { AuthProvider } from "./context/authContext";
import { ProtecteRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          {/* Ruta inicial - Login */}
          <Route path="/" element={<Login />} />
          {/* Rutas protegidas */}
          <Route
            path="/Home"
            element={
              <ProtecteRoute>
                <Home />
              </ProtecteRoute>
            }
          />
          <Route
            path="/Create"
            element={
              <ProtecteRoute>
                <Register />
              </ProtecteRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/Register" element={<Register />} />
          <Route
            path="/Clientes"
            element={
              <ProtecteRoute>
                <Clientes />
              </ProtecteRoute>
            }
          />
          <Route
            path="/Proveedores"
            element={
              <ProtecteRoute>
                <Proveedores />
              </ProtecteRoute>
            }
          />
          <Route
            path="/Productos"
            element={
              <ProtecteRoute>
                <Productos />
              </ProtecteRoute>
            }
          />
          <Route
            path="/Compras"
            element={
              <ProtecteRoute>
                <Compras />
              </ProtecteRoute>
            }
          />
          <Route
            path="/Ventas"
            element={
              <ProtecteRoute>
                <Compras />
              </ProtecteRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
