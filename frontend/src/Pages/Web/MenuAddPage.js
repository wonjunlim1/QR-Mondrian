import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import styles from "./MenuAddPage.module.css";
import WebHeader from "../../Components/WebHeader";
import { encryptUrlParams, decryptUrlParams } from "../../utils/encryption";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const MenuAddPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  // Initializing states
  const [menuData, setMenuData] = useState(null);
  const [state, setState] = useState({
    categorySelectedValue: "",
    menuNameValue: "",
    menuPriceValue: "",
    menuDescriptionValue: "",
  });
  const [optionCardWrappers, setOptionCardWrappers] = useState([
    { id: 0, options: [] },
  ]);

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

  //handle change function for inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "menuPriceValue" && isNaN(Number(value))) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addOptionRow = (cardId) => {
    setOptionCardWrappers(
      optionCardWrappers.map((card) =>
        card.id === cardId
          ? { ...card, options: [...card.options, { id: Math.random() }] }
          : card
      )
    );
  };
  const removeOptionRow = (cardId, optionId) => {
    setOptionCardWrappers(
      optionCardWrappers.map((card) =>
        card.id === cardId
          ? {
              ...card,
              options: card.options.filter((option) => option.id !== optionId),
            }
          : card
      )
    );
  };

  const addOptionWrapper = () => {
    setOptionCardWrappers([
      ...optionCardWrappers,
      { id: optionCardWrappers.length, options: [] },
    ]);
  };

  const removeOptionCardWrapper = (cardId) => {
    setOptionCardWrappers(
      optionCardWrappers.filter((card) => card.id !== cardId)
    );
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (type === "option") {
      const cardId = Number(source.droppableId.split("-")[1]);
      const card = optionCardWrappers.find((card) => card.id === cardId);
      const items = Array.from(card.options);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedCards = optionCardWrappers.map((currentCard) =>
        currentCard.id === cardId
          ? { ...currentCard, options: items }
          : currentCard
      );

      setOptionCardWrappers(updatedCards);
    } else {
      const items = Array.from(optionCardWrappers);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setOptionCardWrappers(items);
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
        const sortedData = jsonData.data.menu.sort(
          (a, b) => a.display_order - b.display_order
        );
        setMenuData(sortedData);
        /** For edit Page
         * setCategorySelectedValue(sortedData[5].category_name);
         */
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
    <div className={styles.web}>
      <WebHeader
        isHQUser={isHQUser}
        isBranchUser={isBranchUser}
        restaurantId={restaurantId}
        branchId={branchId}
      />
      <div className={styles.bodylayout} id="body">
        <div className={styles.fixedarea1}>
          <div className={styles.titlearea}>
            <button className={styles.icon}>
              <img
                className={styles.arrowLeftIcon}
                alt=""
                src="/arrowleft.svg"
              />
            </button>
            <b className={styles.title}>메뉴 추가하기</b>
          </div>
          <div className={styles.layout}>
            <div className={styles.div} id="image_input_body">
              <div className={styles.div1} id="image_body">
                <img
                  className={styles.menuImageIcon}
                  alt=""
                  src="/menu-image.svg"
                />
                <button className={styles.button}>
                  <div className={styles.label}>사진 추가</div>
                </button>
              </div>
              <div className={styles.div2} id="input_body">
                <div className={styles.layout1}>
                  <div className={styles.textfield}>
                    <h2 className={styles.label1} id="menu_name">
                      메뉴 이름
                    </h2>
                    <input
                      className={styles.container}
                      type="text"
                      name="menuNameValue"
                      value={state.menuNameValue}
                      onChange={handleChange}
                      maxlength="30"
                    />
                  </div>
                  <div className={styles.textfield}>
                    <h2 className={styles.label1} id="menu_price">
                      메뉴 가격
                    </h2>
                    <input
                      className={styles.container}
                      type="text"
                      name="menuPriceValue"
                      value={state.menuPriceValue}
                      onChange={handleChange}
                      maxLength="15"
                    />
                  </div>
                </div>
                <div className={styles.layout1}>
                  <div className={styles.select} id="select">
                    <h2 className={styles.label1}>메뉴 구분</h2>
                    <Select
                      name="categorySelectedValue"
                      value={state.categorySelectedValue}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        width: "100%",
                        height: "40px",
                        boxSizing: "border-box",
                        alignSelf: "stretch",
                        top: "5px",
                      }}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                        PaperProps: {
                          style: {
                            maxHeight: 40 * 4.5,
                            width: "20ch",
                          },
                        },
                      }}
                    >
                      {menuData.map((item) => (
                        <MenuItem key={item.id} value={item.category_name}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className={styles.textfield2}>
                    <div className={styles.label4}>메뉴 설명</div>
                    <input
                      className={styles.container}
                      type="text"
                      maxLength="120"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="options"
                direction="horizontal"
                type="card"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles.div3}
                  >
                    {optionCardWrappers.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={`card-${card.id}`}
                        index={index}
                        type="card"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            id={`option_card_${index}`}
                          >
                            <div className={styles.optionCard} id="option_card">
                              <div
                                {...provided.dragHandleProps}
                                className={styles.icon1}
                              >
                                <img
                                  className={styles.dragIndicatorIcon}
                                  alt=""
                                  src="/drag-indicator2.svg"
                                />
                              </div>

                              <div className={styles.layout4}>
                                <div
                                  className={styles.div4}
                                  id="option_classification"
                                >
                                  <div className={styles.textfield}>
                                    <div className={styles.label4}>
                                      옵션 구분
                                    </div>
                                    <input
                                      className={styles.container4}
                                      type="text"
                                      maxLength
                                      minLength
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      removeOptionCardWrapper(card.id)
                                    }
                                    className={styles.xL}
                                  >
                                    <img
                                      className={styles.xLChild}
                                      alt=""
                                      src="/group-12.svg"
                                    />
                                  </button>
                                </div>
                                <Droppable
                                  droppableId={`option-${card.id}`}
                                  direction="vertical"
                                  type="option"
                                >
                                  {(provided) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className={styles.div5}
                                    >
                                      {card.options.map(
                                        (option, optionIndex) => (
                                          <Draggable
                                            key={option.id}
                                            draggableId={`option-${card.id}-${option.id}`}
                                            index={optionIndex}
                                            type="option"
                                          >
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                id={`option_input_row_${optionIndex}`}
                                                className={styles.row}
                                              >
                                                <div
                                                  className={styles.textfield4}
                                                >
                                                  <div
                                                    className={styles.label4}
                                                  >
                                                    옵션 이름
                                                  </div>
                                                  <input
                                                    className={styles.container}
                                                    type="text"
                                                    maxLength
                                                    minLength
                                                  />
                                                </div>
                                                <div
                                                  className={styles.textfield4}
                                                >
                                                  <div
                                                    className={styles.label4}
                                                  >
                                                    옵션 가격
                                                  </div>
                                                  <input
                                                    className={
                                                      styles.container6
                                                    }
                                                    type="text"
                                                    placeholder="16,000"
                                                    maxLength
                                                    minLength
                                                  />
                                                </div>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeOptionRow(
                                                      card.id,
                                                      option.id
                                                    );
                                                  }}
                                                  className={styles.delete}
                                                >
                                                  <div
                                                    className={
                                                      styles.deleteChild
                                                    }
                                                  />
                                                  <img
                                                    className={styles.minusIcon}
                                                    alt=""
                                                    src="/minus2.svg"
                                                  />
                                                </button>
                                                <div
                                                  {...provided.dragHandleProps}
                                                  className={styles.icon2}
                                                >
                                                  <img
                                                    className={
                                                      styles.dragIndicatorIcon1
                                                    }
                                                    alt=""
                                                    src="/drag-indicator2.svg"
                                                  />
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
                                <button
                                  onClick={() => addOptionRow(card.id)}
                                  className={styles.button1}
                                >
                                  <img
                                    className={styles.dragIndicatorIcon}
                                    alt=""
                                    src="/plus1.svg"
                                  />
                                  <div className={styles.label}>옵션 추가</div>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    <button
                      onClick={addOptionWrapper}
                      className={styles.optionCard2}
                    >
                      <div className={styles.plusParent}>
                        <img
                          className={styles.dragIndicatorIcon}
                          alt=""
                          src="/plus3.svg"
                        />
                        <div className={styles.label}>옵션 구분 추가</div>
                      </div>
                    </button>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <button className={styles.button3}>
            <b className={styles.label17}>수정 완료</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuAddPage;