import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Select, MenuItem } from "@mui/material";
import styles from "./MenuAddPage.module.css";
import WebHeader from "../../Components/WebHeader";
import { encryptUrlParams, decryptUrlParams } from "../../utils/encryption";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dragIcon from "../../Assets/Images/drag.svg";
import menuImageIcon from "../../Assets/Images/menu-placeholder.svg";
import deleteIcon from "../../Assets/Images/delete.svg";
import minusIcon from "../../Assets/Images/minus-web.svg";
import plusIcon from "../../Assets/Images/plus.svg";
import backIcon from "../../Assets/Images/arrow-back.svg";

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
  const [nextOptionId, setNextOptionId] = useState(0);

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

  // Function to handle click on back icon
  const onBackIconClick = useCallback(() => {
    navigate(-1, {
      state: { isHQUser, isBranchUser },
    });
  }, [navigate, isHQUser, isBranchUser]);

  // Function to handle change function for inputs
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

  // Function to handle click on edit submit button
  const onSubmitButtonClick = async () => {
    const data = {};
    navigate(
      `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(branchId)}`,
      {
        state: { isHQUser, isBranchUser },
      }
    );
    try {
      const response = await fetch(
        `${serverAddress}/menu_w/${restaurantId}/${branchId}/TBD`,
        {
          method: "TBD",
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

  const addOptionRow = (cardId) => {
    console.log(optionCardWrappers);
    setOptionCardWrappers(
      optionCardWrappers.map((card) =>
        card.id === cardId
          ? { ...card, options: [...card.options, { id: nextOptionId }] }
          : card
      )
    );
    setNextOptionId((prevId) => prevId + 1);
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
      <div className={styles.contentWrapper} id="body">
        <div className={styles.layout}>
          <div className={styles.titleArea}>
            <button className={styles.icon}>
              <img
                className={styles.backIcon}
                alt=""
                src={backIcon}
                onClick={onBackIconClick}
              />
            </button>
            <b className={styles.titleLabel}>메뉴 추가하기</b>
          </div>
          <div className={styles.bodyLayout}>
            <div className={styles.menuWrapper} id="image_input_body">
              <div className={styles.menuImageWrapper} id="image_body">
                <img
                  className={styles.menuImageIcon}
                  alt=""
                  src={menuImageIcon}
                />
                <button className={styles.menuAddButton}>
                  <div className={styles.buttonLabel}>사진 추가</div>
                </button>
              </div>
              <div className={styles.menuValueWrapper} id="input_body">
                <div className={styles.menuValueRow}>
                  <div className={styles.textField}>
                    <h2 className={styles.textFieldLabel} id="menu_name">
                      메뉴 이름
                    </h2>
                    <input
                      className={styles.textFieldContainer}
                      type="text"
                      name="menuNameValue"
                      value={state.menuNameValue}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.textField}>
                    <h2 className={styles.textFieldLabel} id="menu_price">
                      메뉴 가격
                    </h2>
                    <input
                      className={styles.textFieldContainer}
                      type="number"
                      name="menuPriceValue"
                      value={state.menuPriceValue}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className={styles.menuValueRow}>
                  <div className={styles.selectArea} id="select">
                    <h2 className={styles.textFieldLabel}>메뉴 구분</h2>
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
                  <div className={styles.textField}>
                    <div className={styles.textFieldLabel}>메뉴 설명</div>
                    <input className={styles.textFieldContainer} type="text" />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.optionWrapper}>
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
                      className={styles.optionWrapper}
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
                              <div
                                className={styles.optionCard}
                                id="option_card"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className={styles.dragHorizontalIconWrapper}
                                >
                                  <img
                                    className={styles.dragIcon}
                                    alt=""
                                    src={dragIcon}
                                  />
                                </div>

                                <div className={styles.optionCardContent}>
                                  <div
                                    className={styles.optionCategoryWrapper}
                                    id="option_classification"
                                  >
                                    <div className={styles.textField}>
                                      <div className={styles.textFieldLabel}>
                                        옵션 구분
                                      </div>
                                      <input
                                        className={styles.textFieldContainer}
                                        type="text"
                                      />
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeOptionCardWrapper(card.id)
                                      }
                                      className={styles.deleteIconWrapper}
                                    >
                                      <img
                                        className={styles.deleteIcon}
                                        alt=""
                                        src={deleteIcon}
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
                                        className={styles.optionItemWrapper}
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
                                                  className={
                                                    styles.optionItemRow
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.textFieldOption
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.textFieldLabel
                                                      }
                                                    >
                                                      옵션 이름
                                                    </div>
                                                    <input
                                                      className={
                                                        styles.textFieldContainer
                                                      }
                                                      type="text"
                                                    />
                                                  </div>
                                                  <div
                                                    className={
                                                      styles.textFieldOption
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.textFieldLabel
                                                      }
                                                    >
                                                      옵션 가격
                                                    </div>
                                                    <input
                                                      className={
                                                        styles.textFieldContainer
                                                      }
                                                      type="number"
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
                                                    className={
                                                      styles.minusIconArea
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.minusIconWrapper
                                                      }
                                                    />
                                                    <img
                                                      className={
                                                        styles.minusIcon
                                                      }
                                                      alt=""
                                                      src={minusIcon}
                                                    />
                                                  </button>
                                                  <div
                                                    {...provided.dragHandleProps}
                                                    className={
                                                      styles.dragVerticalIconWrapper
                                                    }
                                                  >
                                                    <img
                                                      className={
                                                        styles.dragIcon
                                                      }
                                                      alt=""
                                                      src={dragIcon}
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
                                    className={styles.optionAddButton}
                                  >
                                    <img
                                      className={styles.plusIcon}
                                      alt=""
                                      src={plusIcon}
                                    />
                                    <div className={styles.buttonLabel}>
                                      옵션 추가
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <button
                  onClick={addOptionWrapper}
                  className={styles.optionCardAdd}
                >
                  <div className={styles.plusIconWrapper}>
                    <img className={styles.plusIcon} alt="" src={plusIcon} />
                    <div className={styles.buttonLabel}>옵션 구분 추가</div>
                  </div>
                </button>
              </DragDropContext>
            </div>
          </div>
          <button className={styles.submitButton} onClick={onSubmitButtonClick}>
            <b className={styles.submitButtonLabel}>추가하기</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuAddPage;