import React from "react";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  const [initialMenuData, setInitialMenuData] = useState(null);
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
        `${serverAddress}/menu_w/${restaurantId}/${branchId}/category`,
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
      setCategoryInputValue("");
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle click on edit submit button
  const onEditSubmitButtonClick = async () => {
    const initialData = initialMenuData.map((category, categoryIndex) => ({
      id: category.id,
      name: category.category_name,
      display_order: categoryIndex + 1,
      main_menus: category.main_menus.map((menu, menuIndex) => ({
        id: menu.id,
        name: menu.name,
        display_order: menuIndex + 1,
      })),
    }));
    const newData = menuData.map((category, categoryIndex) => ({
      id: category.id,
      name: category.category_name,
      display_order: categoryIndex + 1,
      main_menus: category.main_menus.map((menu, menuIndex) => ({
        id: menu.id,
        name: menu.name,
        display_order: menuIndex + 1,
      })),
    }));

    const initialDataCategoryMap = new Map(
      initialData.map((item) => [
        item.id,
        { display_order: item.display_order, name: item.name },
      ])
    );
    const newDataCategoryMap = new Map(
      newData.map((item) => [
        item.id,
        { display_order: item.display_order, name: item.name },
      ])
    );

    let categoryDiffList = [];

    for (let [id, data] of initialDataCategoryMap) {
      if (newDataCategoryMap.get(id).display_order !== data.display_order) {
        categoryDiffList.push({
          id: id,
          display_order: newDataCategoryMap.get(id).display_order,
          name: newDataCategoryMap.get(id).name,
        });
      }
    }

    let menuDiffList = [];

    initialData.forEach((initialDataCategory, i) => {
      const newDataCategory = newData[i];

      // convert both arrays to maps for easy lookup
      const initialDataMenuMap = new Map(
        initialDataCategory.main_menus.map((item) => [
          item.id,
          { display_order: item.display_order, name: item.name },
        ])
      );
      const newDataMenuMap = new Map(
        newDataCategory.main_menus.map((item) => [
          item.id,
          { display_order: item.display_order, name: item.name },
        ])
      );

      for (let [id, data] of initialDataMenuMap) {
        if (
          newDataMenuMap.has(id) &&
          newDataMenuMap.get(id).display_order !== data.display_order
        ) {
          menuDiffList.push({
            id: id,
            display_order: newDataMenuMap.get(id).display_order,
            name: newDataMenuMap.get(id).name,
          });
        }
      }
    });
    if (categoryDiffList.length === 0 && menuDiffList.length === 0) {
      navigate(
        `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
          branchId
        )}`,
        {
          state: { isHQUser, isBranchUser },
        }
      );
    }
    const data = {
      category_edit: categoryDiffList.map(({ id, display_order }) => ({
        id,
        display_order,
      })),
      menu_edit: menuDiffList.map(({ id, display_order }) => ({
        id,
        display_order,
      })),
    };
    try {
      const response = await fetch(
        `${serverAddress}/menu_w/${restaurantId}/${branchId}/display_order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);
      navigate(
        `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
          branchId
        )}`,
        {
          state: { isHQUser, isBranchUser },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle drag on items
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    console.log(draggableId);
    if (type === "category") {
      const newMenuData = Array.from(menuData);
      const [removed] = newMenuData.splice(source.index, 1);
      newMenuData.splice(destination.index, 0, removed);
      setMenuData(newMenuData);
      return;
    }
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const startCategory = menuData.find(
      (category) =>
        `${category.id}-${category.category_name}` === source.droppableId
    );
    const endCategory = menuData.find(
      (category) =>
        `${category.id}-${category.category_name}` === destination.droppableId
    );
    if (startCategory === endCategory) {
      const newMenus = Array.from(startCategory.main_menus);
      newMenus.splice(source.index, 1);
      newMenus.splice(
        destination.index,
        0,
        startCategory.main_menus[source.index]
      );
      const newCategory = {
        ...startCategory,
        main_menus: newMenus,
      };
      const newMenuData = menuData.map((category) =>
        category.category_name === newCategory.category_name
          ? newCategory
          : category
      );
      setMenuData(newMenuData);
    } else {
      window.alert("다른 메뉴 구분으로는 이동이 불가합니다");
      /**
      const startMenus = Array.from(startCategory.main_menus);
      const [removed] = startMenus.splice(source.index, 1);
      const newStart = {
        ...startCategory,
        main_menus: startMenus,
      };
      const endMenus = Array.from(endCategory.main_menus);
      endMenus.splice(destination.index, 0, removed);
      const newEnd = {
        ...endCategory,
        main_menus: endMenus,
      };
      setMenuData(
        menuData.map((category) =>
          category.category_name === newStart.category_name
            ? newStart
            : category.category_name === newEnd.category_name
            ? newEnd
            : category
        )
      );
       */
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
        if (initialMenuData === null) {
          setInitialMenuData(jsonData.data.menu);
        }
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, [
    serverAddress,
    restaurantId,
    branchId,
    dummyTableNumber,
    eventCounter,
    initialMenuData,
  ]);

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
              <h1 className={styles.titleLabel}>메뉴 구분 추가</h1>
            </div>
            <input
              className={styles.inputWrapper}
              type="text"
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-categories" type="category">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.dragWrapper}
                >
                  {menuData.map((menuCategory, index) => (
                    <Draggable
                      key={`${menuCategory.id}-${menuCategory.category_name}`}
                      draggableId={`${menuCategory.id}-${menuCategory.category_name}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={styles.layout}
                          id="category_card"
                        >
                          <div
                            className={styles.categoryTitleWrapper}
                            id="category_card_title"
                          >
                            <h2 className={styles.categoryTitleLabel}>
                              {menuCategory.category_name}
                            </h2>
                            <div
                              className={styles.iconWrapper}
                              {...provided.dragHandleProps}
                            >
                              <div className={styles.icon}>
                                <img alt="" src={dragIcon} />
                              </div>
                            </div>
                          </div>
                          <Droppable
                            droppableId={`${menuCategory.id}-${menuCategory.category_name}`}
                            type="menu"
                            direction="horizontal"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={styles.menuRow}
                                id="menu_card_row"
                              >
                                {menuCategory.main_menus.map(
                                  (menuItem, index) => (
                                    <Draggable
                                      key={`${menuItem.id}-${menuItem.name}`}
                                      draggableId={`${menuItem.id}-${menuItem.name}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={styles.menuCard}
                                          id="menu_card_body"
                                        >
                                          <div
                                            className={styles.menuCardLayout}
                                            id="menu_card_buttons"
                                          >
                                            <div
                                              className={
                                                styles.iconGroupWrapper
                                              }
                                            >
                                              <div
                                                {...provided.dragHandleProps}
                                                className={styles.iconWrapper}
                                              >
                                                <div className={styles.icon}>
                                                  <img alt="" src={dragIcon} />
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div
                                            className={styles.menuInfoLayout}
                                            id="menu_card"
                                          >
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

                                            <div
                                              className={styles.menuContent}
                                              id="menu_card_text"
                                            >
                                              <div className={styles.menuInfo}>
                                                <h1
                                                  className={styles.menuName}
                                                  id="menu_name"
                                                >
                                                  {menuItem.name}
                                                </h1>

                                                {menuItem.description && (
                                                  <h2
                                                    className={
                                                      styles.menuDescription
                                                    }
                                                    id="menu_explain"
                                                  >
                                                    {menuItem.description}
                                                  </h2>
                                                )}
                                              </div>

                                              <h2
                                                className={styles.menuPrice}
                                                id="menu_cost"
                                              >
                                                {menuItem.price.toLocaleString()}
                                                원
                                              </h2>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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