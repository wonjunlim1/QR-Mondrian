import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import WebHeader from "../../Components/WebHeader";
import { decryptUrlParams } from "../../utils/encryption";
import styles from "./MenuPage.module.css";
import deleteIcon from "../../Assets/Images/delete.svg";
import dragIcon from "../../Assets/Images/drag.svg";
import editIcon from "../../Assets/Images/edit.svg";
import pauseIcon from "../../Assets/Images/pause.svg";
import playIcon from "../../Assets/Images/play.svg";
import plusIcon from "../../Assets/Images/plus.svg";

const MenuPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  // If the state was passed in the route, use it, otherwise default to false
  const isHQUser = location.state ? location.state.isHQUser : false;
  const isBranchUser = location.state ? location.state.isBranchUser : false;

  // Extracting params from URL
  const { restaurant_id: encodedRestaurantId, branch_id: encodedBranchId } =
    useParams();

  // Decoding params
  const restaurantId = decryptUrlParams(encodedRestaurantId);
  const branchId = decryptUrlParams(encodedBranchId);

  return (
    <>
      <div className={styles.web}>
        <WebHeader
          isHQUser={isHQUser}
          isBranchUser={isBranchUser}
          restaurantId={restaurantId}
          branchId={branchId}
        />
        <div className={styles.bodylayout} id="current_menu_body">
          <div className={styles.titlearea} id="title_div">
            <div className={styles.title}>
              <h1 className={styles.title1}>현재 메뉴</h1>
            </div>
            <button className={styles.button}>
              <div className={styles.label}>메뉴 순서 변경</div>
            </button>
          </div>
          <div className={styles.layout} id="category_card">
            <div className={styles.titlearea1} id="category_card_title">
              <h2 className={styles.title1}>파스타</h2>
              <button className={styles.icon3}>
                <button className={styles.xS}>
                  <img alt="" src={deleteIcon} />
                </button>
              </button>
              <button className={styles.dragIndicator} src={dragIcon}>
                <img alt="" src={dragIcon} />
              </button>
            </div>
            <div className={styles.row} id="menu_card_row">
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
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src={dragIcon}
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
              <div className={styles.menuCard} id="menu_card_body">
                <div className={styles.layout1} id="menu_card_buttons">
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/vector2.svg"
                        />
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector3.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon4}
                          alt=""
                          src="/vector4.svg"
                        />
                        <img
                          className={styles.vectorIcon5}
                          alt=""
                          src="/vector4.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector.svg"
                        />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector1.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
              <div className={styles.menuCard} id="menu_card_body">
                <div className={styles.layout1} id="menu_card_buttons">
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/vector2.svg"
                        />
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector3.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon4}
                          alt=""
                          src="/vector4.svg"
                        />
                        <img
                          className={styles.vectorIcon5}
                          alt=""
                          src="/vector4.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector.svg"
                        />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector1.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.row} id="menu_card_row">
              <div className={styles.menuCard} id="menu_card_body">
                <div className={styles.layout1} id="menu_card_buttons">
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/vector2.svg"
                        />
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector3.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon4}
                          alt=""
                          src="/vector4.svg"
                        />
                        <img
                          className={styles.vectorIcon5}
                          alt=""
                          src="/vector4.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector.svg"
                        />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector1.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.layout11} id="category_card">
            <div className={styles.titlearea1}>
              <b className={styles.title1}>메뉴 구분2</b>
              <div className={styles.icon11}>
                <button className={styles.xS}>
                  <img className={styles.vectorIcon} alt="" src="/vector.svg" />
                  <img
                    className={styles.vectorIcon}
                    alt=""
                    src="/vector1.svg"
                  />
                </button>
              </div>
              <img
                className={styles.dragIndicatorIcon}
                alt=""
                src="/drag-indicator.svg"
              />
            </div>
            <div className={styles.row2}>
              <div className={styles.menuCard} id="menu_card_body">
                <div className={styles.layout1} id="menu_card_buttons">
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/vector2.svg"
                        />
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector3.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon4}
                          alt=""
                          src="/vector4.svg"
                        />
                        <img
                          className={styles.vectorIcon5}
                          alt=""
                          src="/vector4.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector.svg"
                        />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector1.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
              <div className={styles.menuCard} id="menu_card_body">
                <div className={styles.layout1} id="menu_card_buttons">
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/vector2.svg"
                        />
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector3.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon4}
                          alt=""
                          src="/vector4.svg"
                        />
                        <img
                          className={styles.vectorIcon5}
                          alt=""
                          src="/vector4.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector.svg"
                        />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector1.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
              <div className={styles.menuCard} id="menu_card_body">
                <div className={styles.layout1} id="menu_card_buttons">
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/vector2.svg"
                        />
                        <img
                          className={styles.vectorIcon3}
                          alt=""
                          src="/vector3.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon4}
                          alt=""
                          src="/vector4.svg"
                        />
                        <img
                          className={styles.vectorIcon5}
                          alt=""
                          src="/vector4.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon3}>
                      <button className={styles.xS}>
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector.svg"
                        />
                        <img
                          className={styles.vectorIcon}
                          alt=""
                          src="/vector1.svg"
                        />
                      </button>
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout2} id="menu_card">
                  <img
                    className={styles.menuimageIcon}
                    alt=""
                    src="/menuimage.svg"
                  />
                  <div className={styles.menuinfo} id="menu_card_text">
                    <div className={styles.div}>
                      <h1 className={styles.menuname} id="menu_name">
                        메뉴 이름
                      </h1>
                      <h2 className={styles.description} id="menu_explain">
                        메뉴 설명 Lorem ipsum dolor sit amet, cotetur
                        onsecteturcte ...
                      </h2>
                    </div>
                    <h2 className={styles.value1} id="menu_cost">
                      20,000원
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.menuCard8} id="menu_card_body_stopped">
                <div className={styles.titlearea} id="menu_card_buttons">
                  <div className={styles.label1} id="menu_stop">
                    <b className={styles.b5}>메뉴 중지</b>
                  </div>
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <img
                        className={styles.editIcon}
                        alt=""
                        src="/edit1.svg"
                      />
                    </button>
                    <button className={styles.icon3}>
                      <img className={styles.editIcon} alt="" src="/play.svg" />
                    </button>
                    <button className={styles.icon3}>
                      <img className={styles.editIcon} alt="" src="/x-s.svg" />
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout19}>
                  <img
                    className={styles.menuimageIcon8}
                    alt=""
                    src="/menuimage3.svg"
                  />
                  <div className={styles.menuinfo8}>
                    <div className={styles.div}>
                      <b className={styles.menuname1}>떡볶이 그라탕</b>
                      <div className={styles.description5}>
                        맛있는 떡볶이 그라탕맛있는 떡볶이 그라탕맛있는 떡볶이
                        그라탕맛있는 떡볶이...
                      </div>
                    </div>
                    <b className={styles.value2}>20,000원</b>
                  </div>
                </div>
              </div>
              <div className={styles.menuCard8} id="menu_card_body_stopped">
                <div className={styles.titlearea} id="menu_card_buttons">
                  <div className={styles.label1} id="menu_stop">
                    <b className={styles.b5}>메뉴 중지</b>
                  </div>
                  <div className={styles.icongroup}>
                    <button className={styles.icon3}>
                      <img
                        className={styles.editIcon}
                        alt=""
                        src="/edit1.svg"
                      />
                    </button>
                    <button className={styles.icon3}>
                      <img className={styles.editIcon} alt="" src="/play.svg" />
                    </button>
                    <button className={styles.icon3}>
                      <img className={styles.editIcon} alt="" src="/x-s.svg" />
                    </button>
                    <button className={styles.icon4}>
                      <img
                        className={styles.dragIndicatorIcon}
                        alt=""
                        src="/drag-indicator.svg"
                      />
                    </button>
                  </div>
                </div>
                <div className={styles.layout19}>
                  <img
                    className={styles.menuimageIcon8}
                    alt=""
                    src="/menuimage3.svg"
                  />
                  <div className={styles.menuinfo8}>
                    <div className={styles.div}>
                      <b className={styles.menuname1}>떡볶이 그라탕</b>
                      <div className={styles.description5}>
                        맛있는 떡볶이 그라탕맛있는 떡볶이 그라탕맛있는 떡볶이
                        그라탕맛있는 떡볶이...
                      </div>
                    </div>
                    <b className={styles.value2}>20,000원</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
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