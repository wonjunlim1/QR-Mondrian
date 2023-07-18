import React from "react";
import { useEffect, useState } from "react";
//import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import WebHeader from "../../Components/WebHeader";
import { encryptUrlParams, decryptUrlParams } from "../../utils/encryption";
import styles from "./MenuDisplayOrderEditPage.module.css";
import dragIcon from "../../Assets/Images/drag.svg";

const MenuDisplayOrderEditPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  // Initializing states
  const [menuData, setMenuData] = useState(null);
  const [eventCounter, setEventCounter] = useState(0);
  const [categoryInputValue, setCategoryInputValue] = useState("");

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

  /** Event Handlers */

  // Function to handle click on category add button
  const onAddNewCategoryButtonClick = async () => {
    const maxDisplayOrder = Math.max(
      ...menuData.map((item) => item.display_order)
    );
    const data = {
      create_menu_category: {
        category_name: categoryInputValue,
        display_order: maxDisplayOrder + 1,
      },
    };
    try {
      const response = await fetch(
        `${serverAddress}/menu_w/${restaurantId}/${branchId}/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);
      setEventCounter(eventCounter + 1);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle click on edit submit button
  const onEditSubmitButtonClick = async () => {
    const data = {};
    navigate(
      `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(branchId)}`,
      {
        state: { isHQUser, isBranchUser },
      }
    );
    try {
      const response = await fetch(
        `${serverAddress}/menu_w/${restaurantId}/${branchId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  /** Effect Hooks */

  // Effect to redirect user according to their authorization
  useEffect(() => {
    if (isBranchUser && !isHQUser) {
      navigate(
        `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
          branchId
        )}`,
        {
          state: { isHQUser, isBranchUser },
        }
      );
    } else if (!isHQUser && !isBranchUser) {
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
        console.log(jsonData.data.menu);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, [serverAddress, restaurantId, branchId, dummyTableNumber, eventCounter]);

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
          <div className={styles.titleArea} id="title_div">
            <div className={styles.titleWrapper}>
              <h1 className={styles.titleLabel}>메뉴 카테고리 추가</h1>
            </div>
            <input
              className={styles.inputWrapper}
              type="text"
              maxLength="10"
              minLength="5"
              value={categoryInputValue}
              onChange={(e) => setCategoryInputValue(e.target.value)}
            />
            <button
              className={styles.buttonWrapper}
              onClick={onAddNewCategoryButtonClick}
            >
              <div className={styles.buttonLabel}>추가하기</div>
            </button>
          </div>
          {menuData.map((menuCategory, index) => (
            <div key={index} className={styles.layout} id="category_card">
              <div
                className={styles.categoryTitleWrapper}
                id="category_card_title"
              >
                <h2 className={styles.categoryTitleLabel}>
                  {menuCategory.category_name}
                </h2>
                <div className={styles.iconWrapper}>
                  <div className={styles.icon}>
                    <img alt="" src={dragIcon} />
                  </div>
                </div>
              </div>
              <div className={styles.menuRow} id="menu_card_row">
                {menuCategory.main_menus.map((menuItem, index) => (
                  <div
                    className={styles.menuCard}
                    key={index}
                    id="menu_card_body"
                  >
                    <div
                      className={styles.menuCardLayout}
                      id="menu_card_buttons"
                    >
                      <div className={styles.iconGroupWrapper}>
                        <div className={styles.iconWrapper}>
                          <div className={styles.icon}>
                            <img alt="" src={dragIcon} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.menuInfoLayout} id="menu_card">
                      {menuItem.image_url && (
                        <img
                          className={
                            menuItem.menu_status
                              ? styles.menuImage
                              : styles.menuImageInactive
                          }
                          alt=""
                          src={menuItem.image_url}
                          loading="lazy"
                        />
                      )}

                      <div className={styles.menuContent} id="menu_card_text">
                        <div className={styles.menuInfo}>
                          <h1 className={styles.menuName} id="menu_name">
                            {menuItem.name}
                          </h1>

                          {menuItem.description && (
                            <h2
                              className={styles.menuDescription}
                              id="menu_explain"
                            >
                              {menuItem.description}
                            </h2>
                          )}
                        </div>

                        <h2 className={styles.menuPrice} id="menu_cost">
                          {menuItem.price.toLocaleString()}원
                        </h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          className={styles.submitButtonWrapper}
          id="current_menu_down"
          onClick={onEditSubmitButtonClick}
        >
          <button className={styles.submitButton}>
            <b className={styles.submitButtonLabel}>수정 완료</b>
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuDisplayOrderEditPage;