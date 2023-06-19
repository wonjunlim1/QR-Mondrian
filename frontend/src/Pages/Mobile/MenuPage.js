import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./MenuPage.module.css";
import cartIcon from "../../Assets/Images/cart-white.svg";

const MenuPage = () => {
  // Navigation utility from React Router
  const navigate = useNavigate();

  // Initializing states
  const [menuData, setMenuData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const menuCategoryRefs = useRef([]);
  const [isAutomaticScroll, setIsAutomaticScroll] = useState(false);
  const debounceTimeoutRef = useRef(null);

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

  // Function to handle click on category pill
  const onCategoryClick = (index) => {
    setIsAutomaticScroll(true); // Set manual scroll to false
    window.scrollTo({
      top: menuCategoryRefs.current[index].offsetTop - 183,
      behavior: "smooth",
    });

    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setIsAutomaticScroll(false);
    }, 2000);
    setSelectedCategory(index);
  };

  /** Effect Hooks */

  // Effect to fetch menu data once the component mounts
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

  // Effect to enable highlight change while user scrolls
  useEffect(() => {
    if (isAutomaticScroll) return;

    const handleScroll = () => {
      const { current } = menuCategoryRefs;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const index = current.findIndex(
        (categoryRef) =>
          scrollTop >= categoryRef.offsetTop - 183 &&
          scrollTop < categoryRef.offsetTop - 183 + categoryRef.offsetHeight
      );

      if (index !== -1) {
        setSelectedCategory(index);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAutomaticScroll]);

  // Return null while data is loading
  if (!menuData) {
    return <div></div>;
  }

  // Render the component
  return (
    <div className={styles.mobile}>
      <div className={styles.headerFixed}>
        <div className={styles.headerSpace}></div>
        <div className={styles.header}>
          <div className={styles.restaurantLogo}>
            <img
              className={styles.restaurantLogoChild}
              alt=""
              src={restaurantLogoImage}
            />
          </div>
          <div className={styles.tableNumberWrapper}>
            <b className={styles.tableNumberLabel}>테이블 번호</b>
            <b className={styles.tableNumber}>{tableNumber}</b>
          </div>
          <div className={styles.icon} onClick={() => onCartIconClick()}>
            <img className={styles.iconChild} alt="" src={cartIcon} />
          </div>
        </div>
      </div>
      <div className={styles.categoryScrollBarWrapperFixed}>
        <div className={styles.categoryScrollBarWrapper}>
          <div className={styles.categoryScrollBar}>
            {menuData.map((menuCategory, index) => (
              <div
                key={menuCategory.category_name}
                onClick={() => onCategoryClick(index)}
                className={
                  selectedCategory === index
                    ? styles.categoryPillSelected
                    : styles.categoryPill
                }
              >
                <div className={styles.menuCategoryLabel}>
                  {menuCategory.category_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.layout}>
        {menuData.map((menuCategory, index) => (
          <div
            key={menuCategory.category_name}
            className={styles.menuCategoryWrapper}
            ref={(el) => (menuCategoryRefs.current[index] = el)}
          >
            <div className={styles.categoryTitleWrapper}>
              <b className={styles.categoryTitle}>
                {menuCategory.category_name}
              </b>
            </div>
            {menuCategory.main_menus.map((menu) => (
              <div
                key={menu.id}
                className={styles.menuItemWrapper}
                onClick={() => onMenuClick(menu.id)}
              >
                {menu.image_url && (
                  <img
                    className={styles.menuImage}
                    alt={menu.name}
                    loading="lazy"
                    src={menu.image_url}
                  />
                )}
                <div className={styles.menuContent}>
                  <b className={styles.menuName}>{menu.name}</b>
                  {menu.description && (
                    <div className={styles.menuDescription}>
                      {menu.description}
                    </div>
                  )}
                  <b className={styles.menuPrice}>
                    {menu.price.toLocaleString()}원
                  </b>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;