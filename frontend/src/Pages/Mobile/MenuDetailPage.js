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

  const currentTempId = location.state ? location.state.temp_id : 0;
  console.log(currentTempId);
  const {
    restaurant_id: restaurantId,
    branch_id: branchId,
    table_number: tableNumber,
    menu_id: menuId,
  } = useParams();

  const changeQuantity = (num) => {
    const newQuantity = quantity + num;
    if (newQuantity >= 1) {
      // Or replace 0 with the minimum value you want
      setQuantity(newQuantity);
      let newTotal = partialTotal * newQuantity;
      setTotal(newTotal);
      //console.log(total);
    }
  };

  const handleCheck = (categoryIndex, optionIndex) => {
    setMenuDetailData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));

      const option =
        newData.option_categories[categoryIndex].option_menus[optionIndex];
      option.checked = !option.checked;

      let newTotal = menuDetailData.price;
      newData.option_categories.forEach((category) => {
        category.option_menus.forEach((option) => {
          if (option.checked) {
            newTotal += option.price;
          }
        });
      });

      setPartialTotal(newTotal);
      setTotal(newTotal * quantity);
      //console.log(newData);
      return newData;
    });
  };

  useEffect(() => {
    const fetchMenuDetailData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/menu_m/${restaurantId}/${branchId}/${tableNumber}/${menuId}`
        );
        const jsonData = await response.json();
        const modifiedData = jsonData.data["menu details"];
        modifiedData.option_categories = modifiedData.option_categories.map(
          (category) => ({
            ...category,
            option_menus: category.option_menus.map((option) => ({
              ...option,
              checked: false,
            })),
          })
        );
        if (currentTempId !== 0) {
          const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
          const cartItem = existingCart.find(
            (item) => item.temp_id === currentTempId
          );
          if (cartItem) {
            cartItem.option_menus.forEach((option) => {
              const category =
                modifiedData.option_categories[option.option_category_idx];
              if (category) {
                const menuOption = category.option_menus[option.option_idx];
                if (menuOption) {
                  menuOption.checked = true;
                }
              }
            });
          }
        }

        let newTotal = modifiedData.price;
        modifiedData.option_categories.forEach((category) => {
          category.option_menus.forEach((option) => {
            if (option.checked) {
              newTotal += option.price;
            }
          });
        });

        setMenuDetailData(modifiedData);
        setPartialTotal(newTotal);
        setTotal(newTotal * quantity);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };
    fetchMenuDetailData();
  }, [restaurantId, branchId, tableNumber, menuId, quantity, currentTempId]);

  const onSubmitButtonClick = useCallback(
    (currentMenuData, currentQuantity) => {
      // Retrieve the existing data from local storage
      let existingCart = localStorage.getItem("cart");

      let temp_id = 1;

      if (existingCart) {
        existingCart = JSON.parse(existingCart);
        if (
          Array.isArray(existingCart) &&
          existingCart.length > 0 &&
          currentTempId === 0
        ) {
          // Find the largest temp_id
          const maxTempId = Math.max(
            ...existingCart.map((item) => item.temp_id)
          );
          // Set temp_id to be one more than the largest existing temp_id
          temp_id = maxTempId + 1;
        }
      }
      if (currentTempId !== 0) {
        temp_id = currentTempId;
      }

      const newCart = [];
      //console.log(currentQuantity);
      //console.log(currentMenuData);

      for (let i = 0; i < currentQuantity; i++) {
        const checkedOptions = currentMenuData.option_categories.flatMap(
          (category, categoryIndex) =>
            category.option_menus
              .map((option, optionIndex) => ({
                option,
                optionIndex,
                categoryIndex,
              }))
              .filter(({ option }) => option.checked)
              .map(({ option, optionIndex, categoryIndex }) => ({
                option_id: option.id,
                option_name: option.name,
                option_price: option.price,
                option_category_idx: categoryIndex,
                option_idx: optionIndex,
              }))
        );
        newCart.push({
          temp_id: temp_id,
          menu_id: currentMenuData.id,
          menu_name: currentMenuData.name,
          menu_price: currentMenuData.price,
          image_url: currentMenuData.image_url,
          option_menus: checkedOptions,
        });
      }
      console.log(newCart);

      // Parse the existing data to convert it back to an object
      existingCart = existingCart ? existingCart : [];

      if (currentTempId !== 0 && existingCart) {
        existingCart = existingCart.filter(
          (item) => item.temp_id !== currentTempId
        );
      }

      // Now let's add the new data to existing data
      let finalCart = [...existingCart, ...newCart];

      // Store the updated data back in local storage
      localStorage.setItem("cart", JSON.stringify(finalCart));
      let check_cart = localStorage.getItem("cart");
      console.log(check_cart);
      //localStorage.removeItem("cart");
      console.log(currentTempId);
      if (currentTempId !== 0) {
        navigate(`/cart_m/${restaurantId}/${branchId}/${tableNumber}`);
      } else {
        navigate(-1);
      }
    },
    [navigate, currentTempId, restaurantId, branchId, tableNumber]
  );

  const onBackIconClick = useCallback(() => {
    navigate(-1); // Use -1 to go back to the previous page
  }, [navigate]);

  const onCartIconClick = useCallback(() => {
    navigate(`/cart_m/${restaurantId}/${branchId}/${tableNumber}/`);
  }, [navigate, restaurantId, branchId, tableNumber]);

  if (!menuDetailData) {
    return <div>Loading...</div>;
  }

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
              {menuDetailData.description && (
                <div className={styles.description}>
                  {menuDetailData.description}
                </div>
              )}
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