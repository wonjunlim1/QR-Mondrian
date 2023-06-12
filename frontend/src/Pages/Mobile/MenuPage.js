import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./MenuPage.module.css";
import cartIcon from "../../Assets/Images/cart-white.svg";

const MenuPage = () => {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);

  const {
    restaurant_id: restaurantId,
    branch_id: branchId,
    table_number: tableNumber,
  } = useParams();

  const restaurantLogoImage = `https://spqr-menu.s3.ap-northeast-2.amazonaws.com/${restaurantId}/logo.jpg`;

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

  const onMenuClick = useCallback(
    (id) => {
      navigate(`/menu_m/${restaurantId}/${branchId}/${tableNumber}/${id}`);
    },
    [navigate, restaurantId, branchId, tableNumber]
  );
  const onCartIconClick = useCallback(() => {
    navigate(`/cart_m/${restaurantId}/${branchId}/${tableNumber}`);
  }, [navigate, restaurantId, branchId, tableNumber]);
  console.log(menuData);
  if (!menuData) {
    return <div>Loading...</div>;
  }

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
          {menuData.map((menuCategory) => (
            <div
              key={menuCategory.category_name}
              className={styles.tabmenuitemPill}
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
                <img
                  className={styles.menuimageIcon}
                  alt={menu.name}
                  loading="lazy"
                  src={menu.image_url}
                />
                <div className={styles.menuinfo}>
                  <b className={styles.name}>{menu.name}</b>
                  <div className={styles.description}>{menu.description}</div>
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
