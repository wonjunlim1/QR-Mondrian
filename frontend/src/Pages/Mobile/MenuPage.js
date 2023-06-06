import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./MenuPage.module.css";
import cart_icon from '../../Assets/Images/cart-white.svg';

//Gets currentPath to update logo and table number
const currentPath = window.location.pathname;
const pathList = currentPath.split("/");
const restaurantLogoImage = `https://spqr-menu.s3.ap-northeast-2.amazonaws.com/${pathList[2]}/logo.jpg`;
const tableNumber = pathList[4];

// Here is the JSON data
const jsonData = {
  "status": 200,
  "success": true,
  "message": "Get mobile Menu Success",
  "data": {
    "menu": [
      // ... rest of the data
    ]
  }
};

const MenuPage = () => {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);
  
  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add(styles.animate);
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);

  useEffect(() => {
    setMenuData(jsonData.data.menu);
  }, []);

  const onMenuClick = useCallback((id) => {
    navigate(`/menu_m/${id}`);
  }, [navigate]);

  /*if (!menuData) {
    return <div>Loading...</div>;
  };*/
  

  return (
    <div className={styles.mobile}>
      <div className={styles.gnbMobile}>
      </div>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.logoChild} alt="" src={restaurantLogoImage}/>
        </div>
        <div className={styles.tablenumber}>
          <b className={styles.label}>테이블 번호</b>
          <b className={styles.number}>{tableNumber}</b>
        </div>
        <div className={styles.icon}>
          <img className={styles.cartWhiteIcon} alt="" src={cart_icon}/>
        </div>
      </div>
      <div className={styles.tabmenugroup} data-animate-on-scroll>
        <div className={styles.tabmenuitemPillParent} data-animate-on-scroll>
          <div className={styles.tabmenuitemPill}>
            <b className={styles.label1}>단일 메뉴</b>
          </div>
          <div className={styles.tabmenuitemPill1}>
            <div className={styles.label1}>메뉴구분2</div>
          </div>
          <div className={styles.tabmenuitemPill1}>
            <div className={styles.label1}>메뉴구분3</div>
          </div>
          <div className={styles.tabmenuitemPill1}>
            <div className={styles.label1}>메뉴구분4</div>
          </div>
        </div>
      </div>
      <div className={styles.layout}>
        {menuData.map((menuCategory) => (
          <div key={menuCategory.category_name} className={styles.menuCard}>
            <div className={styles.titlearea}>
              <b className={styles.title}>{menuCategory.category_name}</b>
            </div>
            {menuCategory.main_menus.map((menu) => (
              <button key={menu.id} className={styles.divMenu} onClick={() => onMenuClick(menu.id)}>
                <img
                  className={styles.menuimageIcon}
                  alt={menu.name}
                  loading="lazy"
                  src={menu.image_url}
                />
                <div className={styles.menuinfo}>
                  <b className={styles.name}>{menu.name}</b>
                  <div className={styles.description}>{menu.description}</div>
                  <b className={styles.price}>{menu.price}원</b>
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