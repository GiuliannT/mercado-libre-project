import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./pages/HomeScreen";
import { ErrorScreen } from "./pages/ErrorScreen";
import { Footer } from "./components/Footer";
import { ProductsScreen } from "./pages/ProductsScreen";
import { ProductSelectedScreen } from "./pages/ProductSelectedScreen";

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/buscar/productos/:productosId" element={<ProductsScreen />} />
          <Route path="/producto/:productoId" element={<ProductSelectedScreen />} />
          <Route path="*" element={<ErrorScreen message="Error 404" />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};
