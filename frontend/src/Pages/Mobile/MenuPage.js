import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import WebHeader from "../../Components/WebHeader";
import { decryptUrlParams } from "../../utils/encryption";
import styles from "./MenuPage.module.css";
import deleteIcon from "../../Assets/Images/delete.svg";
import dragIcon from "../../Assets/Images/drag.svg";
import editIcon from "../../Assets/Images/edit.svg";
import pauseIcon from "../../Assets/Images/pause.svg";
import playIcon from "../../Assets/Images/play.svg";
import plusIcon from "../../Assets/Images/plus-white.svg";

const MenuPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  // Initializing states
  const [menuData, setMenuData] = useState(null);

  // If the state was passed in the route, use it, otherwise default to false
  const isHQUser = location.state ? location.state.isHQUser : false;
  const isBranchUser = location.state ? location.state.isBranchUser : false;

  // Extracting params from URL
  const { restaurant_id: encodedRestaurantId, branch_id: encodedBranchId } =
    useParams();

  // Decoding params
  const restaurantId = decryptUrlParams(encodedRestaurantId);
  const branchId = decryptUrlParams(encodedBranchId);
  const dummyTableNumber = 0;

  /** Effect Hooks */

  // Effect to redirect user if not logged in
  useEffect(() => {
    if (!isHQUser && !isBranchUser) {
      navigate(`/login_w`);
    }
  }, [navigate, isHQUser, isBranchUser, restaurantId, branchId]);

  // Effect to fetch menu data once the component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          `${serverAddress}/menu/${restaurantId}/${branchId}/${dummyTableNumber}`
        );
        const jsonData = await response.json();
        setMenuData(jsonData.data.menu);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, [serverAddress, restaurantId, branchId, dummyTableNumber]);

  // Return null while data is loading
  if (!menuData) {
    return <div></div>;
  }

  return (
    <>
      <div className={styles.web}>
        <WebHeader
          isHQUser={isHQUser}
          isBranchUser={isBranchUser}
          restaurantId={restaurantId}
          branchId={branchId}
        />
        <div className={styles.contentWrapper} id="current_menu_body">
          <div className={styles.titlearea} id="title_div">
            <div className={styles.title}>
              <h1 className={styles.title1}>현재 메뉴</h1>
            </div>
            <button className={styles.button}>
              <div className={styles.label}>메뉴 순서 변경</div>
            </button>
          </div>
          {menuData.map((menuCategory) => (
            <div
              key={menuCategory.category_name}
              className={styles.layout}
              id="category_card"
            >
              <div className={styles.titlearea1} id="category_card_title">
                <h2 className={styles.title1}>{menuCategory.category_name}</h2>
                <button className={styles.icon3}>
                  <button className={styles.xS}>
                    <img alt="" src={deleteIcon} />
                  </button>
                </button>
              </div>

              {menuCategory.main_menus.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className={styles.row}
                  id="menu_card_row"
                >
                  <div className={styles.menuCard} id="menu_card_body">
                    <div className={styles.layout1} id="menu_card_buttons">
                      <div className={styles.icongroup}>
                        <button className={styles.icon3}>
                          <button className={styles.xS}>
                            <img alt="" src={editIcon} />
                          </button>
                        </button>
                        <button className={styles.icon3}>
                          <button className={styles.xS}>
                            <img alt="" src={pauseIcon} />
                          </button>
                        </button>
                        <button className={styles.icon3}>
                          <button className={styles.xS}>
                            <img alt="" src={deleteIcon} />
                          </button>
                        </button>
                      </div>
                    </div>

                    <div className={styles.layout2} id="menu_card">
                      <img
                        className={styles.menuimageIcon}
                        alt=""
                        src={menuItem.image_url}
                      />

                      <div className={styles.menuinfo} id="menu_card_text">
                        <div className={styles.div}>
                          <h1 className={styles.menuname} id="menu_name">
                            {menuItem.name}
                          </h1>

                          <h2 className={styles.description} id="menu_explain">
                            {menuItem.description}
                          </h2>
                        </div>

                        <h2 className={styles.value1} id="menu_cost">
                          {menuItem.price}원
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <footer className={styles.layout22} id="current_menu_down">
          <button className={styles.floatingbutton}>
            <div className={styles.floatingbuttonChild} />
            <img className={styles.plusLIcon} alt="" src={plusIcon} />
          </button>
        </footer>
      </div>
    </>
  );
};

export default MenuPage;