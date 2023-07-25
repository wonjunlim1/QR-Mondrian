import React from "react";
import { useState, useCallback } from "react";
import { Select, MenuItem } from "@mui/material";
import styles from "./Web.module.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Web = () => {
  const [optionCardWrappers, setOptionCardWrappers] = useState([
    { id: 0, options: [] },
  ]);
  const removeOptionCardWrapper = (cardId) => {
    setOptionCardWrappers(
      optionCardWrappers.filter((card) => card.id !== cardId)
    );
  };
  const [value, setValue] = React.useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const onGNBContainerClick = useCallback(() => {
    // Please sync "Button" to the project
  }, []);
  const onTabMenuItemClick = useCallback(() => {
    // Please sync "Button" to the project
  }, []);

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

  return (
    <div className={styles.web}>
      <div className={styles.gnb} onClick={onGNBContainerClick}>
        <div className={styles.fixedarea}>
          <div className={styles.tabmenugroup}>
            <a
              className={styles.tabmenuitem}
              href="http://www.naver.com"
              onClick={onTabMenuItemClick}
            >
              <b className={styles.b}>메뉴</b>
            </a>
            <a
              className={styles.tabmenuitem1}
              href="http://www.naver.com"
              target="_blank"
            >
              <b className={styles.b}>주문</b>
            </a>
            <a className={styles.tabmenuitem1} href="http://www.naver.com">
              <b className={styles.b}>데이터</b>
            </a>
          </div>
          <div className={styles.textbutton}>
            <b className={styles.value}>로그아웃</b>
          </div>
        </div>
      </div>
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
            <b className={styles.title}>메뉴 수정하기</b>
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
                  <div className={styles.label}>사진 수정</div>
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
                      maxLength
                      minLength
                    />
                  </div>
                  <div className={styles.textfield}>
                    <h2 className={styles.label1} id="menu_price">
                      메뉴 가격
                    </h2>
                    <input
                      className={styles.container}
                      type="text"
                      maxLength
                      minLength
                    />
                  </div>
                </div>
                <div className={styles.layout1}>
                  <div className={styles.select} id="select">
                    <h2 className={styles.label1}>메뉴 구분</h2>
                    <Select
                      value={value}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        width: "100%", // Change this to adjust the width of the dropdown
                        height: "40px", // Change this to adjust the height of the dropdown
                        // You can add more styles if you need to
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
                            maxHeight: 40 * 4.5, // where ITEM_HEIGHT is the height of each MenuItem
                            width: "20ch", // this will adjust the width of the dropdown menu
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <h2 className={styles.placeholder}>Placeholder</h2>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </div>
                  <div className={styles.textfield2}>
                    <div className={styles.label4}>메뉴 설명</div>
                    <input
                      className={styles.container}
                      type="text"
                      maxLength
                      minLength
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

export default Web;