import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./MenuPage.module.css";
import cartIcon from "../../Assets/Images/cart-white.svg";

const MenuPage = () => {
  // Navigation utility from React Router
  const navigate = useNavigate();

  // Initializing states
  const [menuData, setMenuData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Extracting params from URL
  const {
    restaurant_id: restaurantId,
    branch_id: branchId,
    table_number: tableNumber,
  } = useParams();

  // Path for restaruant logo image
  const restaurantLogoImage = `https://spqr-menu.s3.ap-northeast-2.amazonaws.com/${restaurantId}/logo.jpg`;

  /** Event Handlers */

  // Function to handle click on menu item
  const onMenuClick = useCallback(
    (id) => {
      navigate(`/menu_m/${restaurantId}/${branchId}/${tableNumber}/${id}`);
    },
    [navigate, restaurantId, branchId, tableNumber]
  );

  // Function to handle click on cart icon
  const onCartIconClick = useCallback(() => {
    navigate(`/cart_m/${restaurantId}/${branchId}/${tableNumber}`);
  }, [navigate, restaurantId, branchId, tableNumber]);
  console.log(menuData);

  /** Effect Hooks */

  // Effect fetch menu data once the component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/menu_m/${restaurantId}/${branchId}/${tableNumber}`
        );
        const jsonData = await response.json();
        setMenuData(jsonData.data.menu);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, [restaurantId, branchId, tableNumber]);

  // Return null while data is loading
  if (!menuData) {
    return <div></div>;
  }

  // Render the component
  return (
    <div className={styles.mobile}>
      <div className={styles.gnbMobile}></div>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.logoChild} alt="" src={restaurantLogoImage} />
        </div>
        <div className={styles.tablenumber}>
          <b className={styles.label}>테이블 번호</b>
          <b className={styles.number}>{tableNumber}</b>
        </div>
        <div className={styles.icon} onClick={() => onCartIconClick()}>
          <img className={styles.cartWhiteIcon} alt="" src={cartIcon} />
        </div>
      </div>
      <div className={styles.tabmenugroup}>
        <div className={styles.tabmenuitemPillParent}>
          {menuData.map((menuCategory, index) => (
            <div
              key={menuCategory.category_name}
              onClick={() => setSelectedCategory(index)} // Set state here
              className={
                selectedCategory === index
                  ? styles.tabmenuitemPill
                  : styles.tabmenuitemPill1
              }
            >
              <b className={styles.label1}>{menuCategory.category_name}</b>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.layout}>
        {menuData.map((menuCategory) => (
          <div key={menuCategory.category_name} className={styles.menuCard}>
            <div className={styles.titlearea}>
              <b className={styles.title}>{menuCategory.category_name}</b>
            </div>
            {menuCategory.main_menus.map((menu) => (
              <button
                key={menu.id}
                className={styles.divMenu}
                onClick={() => onMenuClick(menu.id)}
              >
                {menu.image_url && (
                  <img
                    className={styles.menuimageIcon}
                    alt={menu.name}
                    loading="lazy"
                    src={menu.image_url}
                  />
                )}
                <div className={styles.menuinfo}>
                  <b className={styles.name}>{menu.name}</b>
                  {menu.description && (
                    <div className={styles.description}>{menu.description}</div>
                  )}
                  <b className={styles.price}>
                    {menu.price.toLocaleString()}원
                  </b>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;