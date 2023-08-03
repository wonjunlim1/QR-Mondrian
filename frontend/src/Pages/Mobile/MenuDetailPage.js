import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./MenuDetailPage.module.css";
import cartIcon from "../../Assets/Images/cart-black.svg";
import minusIcon from "../../Assets/Images/minus.svg";
import plusIcon from "../../Assets/Images/plus.svg";
import backIcon from "../../Assets/Images/arrow-back.svg";
import { encryptUrlParams, decryptUrlParams } from "../../utils/encryption";

const MenuDetailPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  // Initializing states
  const [menuDetailData, setMenuDetailData] = useState(null);
  const [partialTotal, setPartialTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Check if user comes from edit page
  const currentTempId = location.state ? location.state.temp_id : 0;

  // Setting cart count
  const cart = JSON.parse(localStorage.getItem("cart"));
  const cartCount = (cart && cart.length) || 0;

  // Extracting params from URL
  const {
    restaurant_id: encodedRestaurantId,
    branch_id: encodedBranchId,
    table_number: encodedTableNumber,
    menu_id: encodedMenuId,
  } = useParams();

  // Decoding params
  const restaurantId = decryptUrlParams(encodedRestaurantId);
  const branchId = decryptUrlParams(encodedBranchId);
  const tableNumber = decryptUrlParams(encodedTableNumber);
  const menuId = decryptUrlParams(encodedMenuId);

  /** Event Handlers */

  // Function to handle click on back icon
  const onBackIconClick = useCallback(() => {
    navigate(-1); // Use -1 to go back to the previous page
  }, [navigate]);

  // Function to handle click on cart icon
  const onCartIconClick = useCallback(() => {
    navigate(
      `/cart_m/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
        branchId
      )}/${encryptUrlParams(tableNumber)}`
    );
  }, [navigate, restaurantId, branchId, tableNumber]);

  // Function to change quantity of the menu item
  const changeQuantity = (num) => {
    const newQuantity = quantity + num;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      let newTotal = partialTotal * newQuantity;
      setTotal(newTotal);
    }
  };

  // Function to handle checked status of each menu option
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

  // Function for handling submit button click
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
        menu_quantity: currentQuantity,
        option_menus: checkedOptions,
      });

      // Parse the existing data to convert it back to an object
      existingCart = existingCart ? existingCart : [];

      if (currentTempId !== 0 && existingCart) {
        existingCart = existingCart.filter(
          (item) => item.temp_id !== currentTempId
        );
      }

      // Add the new data to existing data
      let finalCart = [...existingCart, ...newCart];

      // Store the updated data back in local storage
      localStorage.setItem("cart", JSON.stringify(finalCart));
      if (currentTempId !== 0) {
        navigate(
          `/cart_m/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
            branchId
          )}/${encryptUrlParams(tableNumber)}`,
          {
            state: { editMenu: true },
          }
        );
      } else {
        navigate(-1);
      }
    },
    [navigate, currentTempId, restaurantId, branchId, tableNumber]
  );

  /** Effect Hooks */

  // Effect fetch menu detail data once the component mounts
  useEffect(() => {
    const fetchMenuDetailData = async () => {
      try {
        const response = await fetch(
          `${serverAddress}/menu/${restaurantId}/${branchId}/${tableNumber}/${menuId}`
        );
        const jsonData = await response.json();
        const modifiedData = jsonData.data["menu_details"];
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
          setQuantity(cartItem.menu_quantity);
        }

        setMenuDetailData(modifiedData);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };
    fetchMenuDetailData();
  }, [
    serverAddress,
    restaurantId,
    branchId,
    tableNumber,
    menuId,
    currentTempId,
  ]);

  // Effect to calculate the total price when quantity or menu detail data changes
  useEffect(() => {
    if (menuDetailData) {
      let newTotal = menuDetailData.price;
      menuDetailData.option_categories.forEach((category) => {
        category.option_menus.forEach((option) => {
          if (option.checked) {
            newTotal += option.price;
          }
        });
      });

      setPartialTotal(newTotal);
      setTotal(newTotal * quantity);
    }
  }, [quantity, menuDetailData]);

  // Return null while data is loading
  if (!menuDetailData) {
    return <div></div>;
  }

  // Render the component
  return (
    <div className={styles.mobile}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button className={styles.icon} onClick={onBackIconClick}>
            <img className={styles.iconChild} alt="" src={backIcon} />
          </button>
          <div className={styles.icon} onClick={onCartIconClick}>
            <img className={styles.iconChild} alt="" src={cartIcon} />
            {cartCount > 0 && (
              <div className={styles.cartCount}> {cartCount} </div>
            )}
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.menuWrapper}>
            {menuDetailData.image_url && (
              <img
                className={styles.menuImage}
                alt={menuDetailData.name}
                src={menuDetailData.image_url}
              />
            )}
            <div className={styles.menuContentWrapper}>
              <b className={styles.menuNameLabel}>{menuDetailData.name}</b>
              {menuDetailData.description && (
                <div className={styles.menuDescription}>
                  {menuDetailData.description}
                </div>
              )}
              <div className={styles.menuPriceWrapper}>
                <b className={styles.priceLabel}>가격</b>
                <b className={styles.menuPrice}>
                  {menuDetailData.price.toLocaleString()}원
                </b>
              </div>
            </div>
          </div>

          {menuDetailData.option_categories.map((category, index) => (
            <div key={index} className={styles.divOptions}>
              <b className={styles.optionCategoryLabel}>
                {category.option_category_name}
              </b>
              <div className={styles.optionItemWrapper}>
                {category.option_menus.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.radioOptionWrapper}>
                    <div className={styles.radioOption}>
                      <input
                        className={styles.radioOptionUnchecked}
                        type="checkbox"
                        checked={option.checked}
                        onChange={() => handleCheck(index, optionIndex)}
                      />
                      <div className={styles.optionItemLabel}>
                        {option.name}
                      </div>
                    </div>
                    <div className={styles.optionItemPrice}>
                      {`+${option.price.toLocaleString()}원`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.divQuantity}>
            <b className={styles.quantityWrapper}>수량</b>
            <div className={styles.quantityChangeWrapper}>
              <button
                onClick={() => changeQuantity(-1)}
                className={styles.quantityChangeButtonWrapper}
              >
                <div className={styles.quantityChangeButton} />
                <img
                  className={styles.quantityChangeIcon}
                  alt=""
                  src={minusIcon}
                />
              </button>
              <div className={styles.counter}>
                <div className={styles.quantityLabel}>{quantity}</div>
              </div>
              <button
                onClick={() => changeQuantity(1)}
                className={styles.quantityChangeButtonWrapper}
              >
                <div className={styles.quantityChangeButton} />
                <img
                  className={styles.quantityChangeIcon}
                  alt=""
                  src={plusIcon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <b className={styles.priceLabel}>총 {total.toLocaleString()}원</b>
        <button
          className={styles.submitButton}
          onClick={() => onSubmitButtonClick(menuDetailData, quantity)}
        >
          <b className={styles.submitButtonLabel}>장바구니에 추가</b>
        </button>
      </div>
    </div>
  );
};

export default MenuDetailPage;