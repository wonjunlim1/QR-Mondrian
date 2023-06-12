import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./MenuDetailPage.module.css";
import cartIcon from "../../Assets/Images/cart-black.svg";
import minusIcon from "../../Assets/Images/minus.svg";
import plusIcon from "../../Assets/Images/plus.svg";
import arrowIcon from "../../Assets/Images/arrow-back.svg";

const MenuDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuDetailData, setMenuDetailData] = useState(null);
  const [partialTotal, setPartialTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={styles.mobile}>
      <div className={styles.gnbMobileParent}>
        <div className={styles.gnbSpace}></div>
        <div className={styles.gnbMobile}>
          <button className={styles.icon} onClick={onBackIconClick}>
            <img className={styles.arrowLeftIcon} alt="" src={arrowIcon} />
          </button>
          <div className={styles.icon1} onClick={onCartIconClick}>
            <img className={styles.arrowLeftIcon} alt="" src={cartIcon} />
          </div>
        </div>
        <div className={styles.bodylayout}>
          <div className={styles.menuinfo}>
            <img
              className={styles.menuimageIcon}
              alt={menuDetailData.name}
              src={menuDetailData.image_url}
            />
            <div className={styles.menuinfo1}>
              <b className={styles.label}>{menuDetailData.name}</b>
              <div className={styles.description}>
                {menuDetailData.description}
              </div>
              <div className={styles.price}>
                <b className={styles.label1}>가격</b>
                <b className={styles.value}>
                  {menuDetailData.price.toLocaleString()}원
                </b>
              </div>
            </div>
          </div>

          {menuDetailData.option_categories.map((category, index) => (
            <div key={index} className={styles.divOption}>
              <b className={styles.label2}>{category.option_category_name}</b>
              <div className={styles.optionlist}>
                {category.option_menus.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.radiooptions}>
                    <div className={styles.radiooptions1}>
                      <input
                        className={styles.unchecked2}
                        type="checkbox"
                        checked={option.checked}
                        onChange={() => handleCheck(index, optionIndex)}
                      />
                    </div>
                    <div className={styles.labelcontainer}>
                      <div className={styles.optionlabelname}>
                        {option.name}
                      </div>
                      <div className={styles.optionlabelprice}></div>+
                      {option.price.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.div}>
            <b className={styles.optionlabelquantity}>수량</b>
            <div className={styles.nuberinput}>
              <button
                onClick={() => changeQuantity(-1)}
                className={styles.button}
              >
                <div className={styles.buttonChild} />
                <img className={styles.minusIcon} alt="" src={minusIcon} />
              </button>
              <div className={styles.counter}>
                <div className={styles.div1}>{quantity}</div>
              </div>
              <button
                onClick={() => changeQuantity(1)}
                className={styles.button}
              >
                <div className={styles.buttonItem} />
                <img className={styles.minusIcon} alt="" src={plusIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.div2}>
        <b className={styles.label1}>총 {total.toLocaleString()}원</b>
        <button
          className={styles.button2}
          onClick={() => onSubmitButtonClick(menuDetailData, quantity)}
        >
          <b className={styles.label5}>장바구니에 추가</b>
        </button>
      </div>
    </div>
  );
};

export default MenuDetailPage;
