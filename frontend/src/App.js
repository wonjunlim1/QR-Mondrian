import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import WebLoginPage from "./Pages/Web/LoginPage";
import WebOrderPage from "./Pages/Web/OrderPage";
import WebMenuPage from "./Pages/Web/MenuPage";
import MobileMenuPage from "./Pages/Mobile/MenuPage";
import MobileMenuDetailPage from "./Pages/Mobile/MenuDetailPage";
import MobileCartPage from "./Pages/Mobile/CartPage";

function PageHandler() {
  // Navigation and location utility from React Router
  const location = useLocation();

  // Location variable assignments
  const { pathname, key } = location;

  /** Effect Hooks */

  // Effect to scroll to the top when the user first lands on the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);

  // Effect to change page titles and meta descriptions according to the routes
  useEffect(() => {
    let title = "";
    let metaDescription = "";
    let mainPath = pathname.split("/")[1];
    let pathLength = pathname.split("/").length;

    if (mainPath === "menu_m" && pathLength === 5) {
      title = "Menu";
      metaDescription = "This is the Mobile Menu Page";
    } else if (mainPath === "menu_m" && pathLength > 5) {
      title = "Menu Details";
      metaDescription = "This is the Mobile Menu Details Page";
    } else if (mainPath === "cart_m") {
      title = "Cart";
      metaDescription = "This is the Mobile Cart Page";
    } else if (mainPath === "login_w") {
      title = "Login";
      metaDescription = "This is the Web Login Page";
    } else if (mainPath === "order_w") {
      title = "Order";
      metaDescription = "This is the Web Order Page";
    } else if (mainPath === "menu_w") {
      title = "Menu";
      metaDescription = "This is the Web Menu Page";
    } else {
      title = "SPQR";
      metaDescription = "";
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);
}

// Routes for the App
function App() {
  return (
    <Router>
      <PageHandler />
      <Routes>
        <Route
          path="/menu_m/:restaurant_id/:branch_id/:table_number"
          element={<MobileMenuPage />}
        />
        <Route
          path="/menu_m/:restaurant_id/:branch_id/:table_number/:menu_id"
          element={<MobileMenuDetailPage />}
        />
        <Route
          path="/cart_m/:restaurant_id/:branch_id/:table_number"
          element={<MobileCartPage />}
        />
        <Route path="/login_w" element={<WebLoginPage />} />
        <Route
          path="/order_w/:restaurant_id/:branch_id/"
          element={<WebOrderPage />}
        />
        <Route
          path="/menu_w/:restaurant_id/:branch_id/"
          element={<WebMenuPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;