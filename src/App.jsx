import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./pages/HomeScreen";
import { ErrorScreen } from "./pages/ErrorScreen";
import { Footer } from "./components/Footer";
import { ProductsScreen } from "./pages/ProductsScreen";

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/buscar/productos/:productoId" element={<ProductsScreen />} />
          <Route path="*" element={<ErrorScreen message="Error 404" />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};
