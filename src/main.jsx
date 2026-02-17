import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(

    <BrowserRouter>
     <SearchProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ProductProvider>
                <App/>
              </ProductProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>

);
