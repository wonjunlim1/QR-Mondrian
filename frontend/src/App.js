import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import WebLoginPage from './Pages/Web/LoginPage';  
import WebOrderPage from './Pages/Web/OrderPage';  
import MobileMenuPage from './Pages/Mobile/MenuPage';

function PageHandler() {
  const location = useLocation();
  const { pathname, key } = location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/menu_m/:restaurant_id/:branch_id/:table_number":
        title = "Menu";
        metaDescription = "This is the Mobile Menu Page";
        break;
      case "/login_w":
        title = "Login";
        metaDescription = "This is the Web Login Page";
        break;
      case "/order_w/:restaurant_id":
        title = "";
        metaDescription = "";
        break;
      default:
          title = "SPQR";
          metaDescription = "";
          break;
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


function App() {
  return (
    <Router>
      <PageHandler />
      <Routes>
        <Route path="/login_w" element={<WebLoginPage />} />
        <Route path="/order_w" element={<WebOrderPage />} />
        <Route path="/menu_m/:restaurant_id/:branch_id/:table_number" element={<MobileMenuPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;