import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./CartPage.module.css";
import backIcon from "../../Assets/Images/arrow-back.svg";
import deleteIcon from "../../Assets/Images/delete.svg";
import pendingIcon from "../../Assets/Images/pending.svg";
import acceptedIcon from "../../Assets/Images/accepted.svg";
import rejectedIcon from "../../Assets/Images/rejected.svg";
import minusIcon from "../../Assets/Images/minus.svg";
import plusIcon from "../../Assets/Images/plus.svg";
import { encryptUrlParams, decryptUrlParams } from "../../utils/decoder";

const CartPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  // Initializing states
  const [pastOrdersData, setPastOrdersData] = useState(null);
  const [pastOrdersPrice, setPastOrdersPrice] = useState(0);
  const [currentCartData, setCurrentCartData] = useState([]);
  const [currentCartPrice, setCurrentCartPrice] = useState(0);
  const [pastOrdersDataCalled, setPastOrdersDataCalled] = useState(false);

  // Check if last page was editting a menu
  const fromEditMenu = location.state ? location.state.editMenu : false;

  // Extracting params from URL
  const {
    restaurant_id: encodedRestaurantId,
    branch_id: encodedBranchId,
    table_number: encodedTableNumber,
  } = useParams();

  // Decoding params
  const restaurantId = decryptUrlParams(encodedRestaurantId);
  const branchId = decryptUrlParams(encodedBranchId);
  const tableNumber = decryptUrlParams(encodedTableNumber);

  /** Event Handlers */

  // Callback function to navigate back
  const onBackIconClick = useCallback(() => {
    if (fromEditMenu) {
      navigate(
        `/menu_m/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
          branchId
        )}/${encryptUrlParams(tableNumber)}`
      );
    } else {
      navigate(-1);
    }
  }, [navigate, restaurantId, branchId, tableNumber, fromEditMenu]);

  // Callback function to delete specific item from the current order data
  const onItemDeleteIconClick = useCallback(
    // Filter out the item that matches the passed id
    // Update the current order data state
    // Update the total order price
    (temp_id) => {
      const updatedData = currentCartData.filter(
        (item) => item.temp_id !== temp_id
      );

      setCurrentCartData(updatedData);

      localStorage.setItem("cart", JSON.stringify(updatedData));

      const totalPrice = updatedData.reduce((total, item) => {
        const itemTotal =
          (item.menu_price +
            item.option_menus.reduce((a, b) => a + b.option_price, 0)) *
          item.menu_quantity;
        return total + itemTotal;
      }, 0);
      setCurrentCartPrice(totalPrice);
    },
    [currentCartData]
  );

  // Callback function to modify an item from the current order data
  const onModifyButtonClick = useCallback(
    // Redirect to menu details page with temporary id state
    (temp_id, menu_id) => {
      navigate(
        `/menu_m/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
          branchId
        )}/${encryptUrlParams(tableNumber)}/${encryptUrlParams(menu_id)}`,
        { state: { temp_id } }
      );
    },
    [navigate, restaurantId, branchId, tableNumber]
  );

  // Callback function to change quantity in local cart
  const changeQuantity = useCallback(
    (num, temp_id) => {
      // Find the item with the given temp_id
      let item = currentCartData.find((item) => item.temp_id === temp_id);
      if (item) {
        item.menu_quantity += num;
        if (item.menu_quantity < 1) {
          item.menu_quantity = 1; // Ensure the quantity never drops below 1
        }
        // Create a new array for the updated cart data
        let updatedData = currentCartData.map((cartItem) => {
          if (cartItem.temp_id === temp_id) {
            return item;
          } else {
            return cartItem;
          }
        });
        // Update the cart data in the state and the local storage
        setCurrentCartData(updatedData);
        localStorage.setItem("cart", JSON.stringify(updatedData));
        // Update the total price
        const totalPrice = updatedData.reduce((total, cartItem) => {
          const itemTotal =
            (cartItem.menu_price +
              cartItem.option_menus.reduce((a, b) => a + b.option_price, 0)) *
            cartItem.menu_quantity;
          return total + itemTotal;
        }, 0);
        setCurrentCartPrice(totalPrice);
      }
    },
    [currentCartData]
  );

  console.log(JSON.parse(localStorage.getItem("cart")) || []);

  // Callback function to submit the order
  const onSubmitButtonClick = useCallback(async () => {
    // Check and get current order data from local storage
    // Transform the data and send a POST request to the server
    // Clear the cart data in the local storage
    // Redirect to the restaurant menu page

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartData.length > 0) {
      let main_menus = [];

      cartData.forEach((item) => {
        for (let i = 0; i < item.menu_quantity; i++) {
          main_menus.push({
            id: item.menu_id,
            price: item.menu_price,
            option_menus: item.option_menus.map((option) => ({
              id: option.option_id,
              price: option.option_price,
            })),
          });
        }
      });

      const transformedCartData = {
        current_order: [
          {
            restaurant_id: restaurantId,
            branch_id: branchId,
            table_number: tableNumber,
            main_menus: main_menus,
          },
        ],
      };

      try {
        const response = await fetch(
          `http://localhost:8080/cart_m/${restaurantId}/${branchId}/${tableNumber}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transformedCartData),
          }
        );
        localStorage.removeItem("cart");
        navigate(
          `/menu_m/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
            branchId
          )}/${encryptUrlParams(tableNumber)}`
        );
        console.log(response);
      } catch (error) {}
    }
  }, [navigate, restaurantId, branchId, tableNumber]);

  /** Effect Hooks */

  // Effect to fetch past orders data when restaurant id, branch id or table number change
  useEffect(() => {
    // Call the async function to fetch the past orders data
    const fetchPastOrdersData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/cart_m/${restaurantId}/${branchId}/${tableNumber}`
        );
        const jsonData = await response.json();
        const flattenedPastOrders = jsonData.data["past_orders"]
          ? jsonData.data["past_orders"].flatMap((subOrderArray) =>
              subOrderArray.map((subOrder) => {
                subOrder.main_menus = subOrder.main_menus.map((menu) => {
                  return { ...menu, order_status: subOrder.order_status };
                });
                return subOrder;
              })
            )
          : [];

        setPastOrdersData(flattenedPastOrders);

        const totalPrice = flattenedPastOrders.reduce((acc, order) => {
          return (
            acc +
            order.main_menus.reduce((menuAcc, menu) => {
              return (
                menuAcc +
                menu.price +
                (menu.option_menus
                  ? menu.option_menus.reduce(
                      (optionAcc, option) => optionAcc + option.price,
                      0
                    )
                  : 0)
              );
            }, 0)
          );
        }, 0);

        setPastOrdersPrice(totalPrice);

        setPastOrdersDataCalled(true);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchPastOrdersData();
  }, [restaurantId, branchId, tableNumber]);

  // Effect to check and update current order data when the component mounts
  useEffect(() => {
    // Get cart data from local storage
    // Parse and set the current order data and total price
    const check_cart = localStorage.getItem("cart");
    if (check_cart) {
      let parsedCart = JSON.parse(check_cart);
      parsedCart.sort((a, b) => a.temp_id - b.temp_id);
      setCurrentCartData(parsedCart);
      const totalPrice = parsedCart.reduce((total, item) => {
        const itemTotal =
          (item.menu_price +
            item.option_menus.reduce((a, b) => a + b.option_price, 0)) *
          item.menu_quantity;
        return total + itemTotal;
      }, 0);
      setCurrentCartPrice(totalPrice);
    }
  }, []);

  // Return loading state while fetching past orders data
  if (!pastOrdersDataCalled) {
    return <div></div>;
  }

  // Render the component
  return (
    <div className={styles.mobile}>
      <div className={styles.content}>
        <div className={styles.headerSpace}></div>
        <div className={styles.header}>
          <div className={styles.icon}>
            <img
              className={styles.backIcon}
              alt=""
              src={backIcon}
              onClick={onBackIconClick}
            />
          </div>
          <b className={styles.headerText}>장바구니</b>
          <div />
        </div>
        <div className={styles.layout}>
          <div className={styles.divCurrentCart}>
            <div className={styles.titleAreaWrapper}>
              <div className={styles.titleArea}>
                <b className={styles.titleCurrentCart}>현재 주문서</b>
                <b
                  className={styles.priceCurrentCart}
                >{`총 ${currentCartPrice.toLocaleString()}원`}</b>
              </div>
              <div className={styles.mainDivider} />
            </div>
            {currentCartData.map((item, idx, array) => (
              <div
                key={item.temp_id}
                className={styles.divCurrentCartItemWrapper}
              >
                <div className={styles.divItemWrapper}>
                  <div className={styles.divCurrentCartItemHeader}>
                    <b className={styles.currentCartItemName}>
                      {item.menu_name}
                    </b>
                    <img
                      className={styles.deleteIcon}
                      alt="delete"
                      src={deleteIcon}
                      onClick={() => onItemDeleteIconClick(item.temp_id)}
                    />
                  </div>
                  <div className={styles.divCurrentCartContent}>
                    {item.image_url && (
                      <img
                        className={styles.menuImage}
                        alt={item.menu_name}
                        src={item.image_url}
                      />
                    )}
                    <div className={styles.divCurrentCartPriceWrapper}>
                      <div className={styles.divItemPriceWrapper}>
                        <div className={styles.priceBlack}>
                          <div className={styles.priceBulletBlack} />
                          <div className={styles.priceLabel}>
                            {`가격 : ${item.menu_price.toLocaleString()}원`}
                          </div>
                        </div>
                        <div className={styles.priceGrey}>
                          <div className={styles.priceBulletBlack} />
                          <div className={styles.priceLabel}>
                            {`옵션 수(${
                              item.option_menus.length
                            }개) : ${item.option_menus
                              .reduce((a, b) => a + b.option_price, 0)
                              .toLocaleString()}원`}
                          </div>
                        </div>
                      </div>
                      <b className={styles.itemTotalPriceBlack}>
                        {`${(
                          item.menu_quantity *
                          (item.menu_price +
                            item.option_menus.reduce(
                              (a, b) => a + b.option_price,
                              0
                            ))
                        ).toLocaleString()}원`}
                      </b>
                    </div>
                  </div>
                  <div className={styles.divOptionChange}>
                    <div
                      className={styles.optionChangeButton}
                      onClick={() =>
                        onModifyButtonClick(item.temp_id, item.menu_id)
                      }
                    >
                      <b className={styles.buttonLabel}>옵션변경</b>
                    </div>
                    <div className={styles.quantityChangeWrapper}>
                      <div
                        className={styles.quantityChangeButton}
                        onClick={() => changeQuantity(-1, item.temp_id)}
                      >
                        <div className={styles.quantityChangeButtonChild} />
                        <img
                          className={styles.quantityChangeIcon}
                          alt=""
                          src={minusIcon}
                        />
                      </div>
                      <div className={styles.quantityChangeLabelWrapper}>
                        <div className={styles.quantityChangeLabel}>
                          {item.menu_quantity}
                        </div>
                      </div>
                      <div
                        className={styles.quantityChangeButton}
                        onClick={() => changeQuantity(1, item.temp_id)}
                      >
                        <div className={styles.quantityChangeButtonChild} />
                        <img
                          className={styles.quantityChangeIcon}
                          alt=""
                          src={plusIcon}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {idx < array.length - 1 && (
                  <div className={styles.subDivider} />
                )}
              </div>
            ))}
          </div>
          <div className={styles.divPastOrders}>
            <div className={styles.titleAreaWrapper}>
              <div className={styles.titleArea}>
                <b className={styles.title}>지난 주문서</b>
                <b className={styles.pricePastOrders}>
                  총 {pastOrdersPrice.toLocaleString()}원
                </b>
              </div>
              <div className={styles.mainDivider} />
            </div>
            {pastOrdersData.length > 0 && (
              <div className={styles.divPastOrdersItemWrapper}>
                {pastOrdersData.map((order, orderIndex) =>
                  order.main_menus.map((menu, menuIndex, array) => (
                    <React.Fragment key={`${order.sub_order_id}-${menuIndex}`}>
                      <div className={styles.divItemWrapper}>
                        <div className={styles.divPastOrdersItemHeader}>
                          <b className={styles.pastOrdersItemName}>
                            {menu.name}
                          </b>
                          <div
                            className={
                              order.order_status === "Pending"
                                ? styles.labelPending
                                : order.order_status === "Accepted"
                                ? styles.labelAccepted
                                : order.order_status === "Rejected"
                                ? styles.labelRejected
                                : ""
                            }
                          >
                            {order.order_status === "Accepted" && (
                              <img
                                className={styles.statusIcon}
                                alt=""
                                src={acceptedIcon}
                              />
                            )}
                            {order.order_status === "Rejected" && (
                              <img
                                className={styles.statusIcon}
                                alt=""
                                src={rejectedIcon}
                              />
                            )}
                            {order.order_status === "Pending" && (
                              <img
                                className={styles.statusIcon}
                                alt=""
                                src={pendingIcon}
                              />
                            )}
                            <b className={styles.status}>
                              {order.order_status === "Pending"
                                ? "주문 확인 중"
                                : order.order_status === "Accepted"
                                ? "주문 확인"
                                : order.order_status === "Rejected"
                                ? "주문 거절"
                                : ""}
                            </b>
                          </div>
                        </div>
                        <div className={styles.divPastOrdersPriceWrapper}>
                          <div className={styles.divItemPriceWrapper}>
                            <div key={menu.name} className={styles.priceGrey}>
                              <div className={styles.priceBulletGrey} />
                              <div className={styles.priceLabel}>
                                가격 : {menu.price.toLocaleString()}원
                              </div>
                            </div>
                            {menu.option_menus.map((option) => (
                              <div
                                key={option.name}
                                className={styles.priceGrey}
                              >
                                <div className={styles.priceBulletGrey} />
                                <div className={styles.priceLabel}>{`${
                                  option.name
                                } : ${option.price.toLocaleString()}원`}</div>
                              </div>
                            ))}
                          </div>
                          <b className={styles.itemTotalPriceGrey}>
                            {(
                              menu.price +
                              menu.option_menus.reduce(
                                (total, option) => total + option.price,
                                0
                              )
                            ).toLocaleString()}
                            원
                          </b>
                        </div>
                      </div>
                      {(orderIndex < pastOrdersData.length - 1 ||
                        menuIndex < array.length - 1) && (
                        <div className={styles.subDivider} />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.totalPriceWrapper}>
          <div className={styles.priceLabel}>
            <span>현재 주문 금액 : </span>
            <b>{`${currentCartPrice.toLocaleString()}원`}</b>
          </div>
          <div className={styles.priceLabelSmall}>
            <span>총 주문 금액 : </span>
            <b>{`${(
              currentCartPrice + pastOrdersPrice
            ).toLocaleString()}원`}</b>
          </div>
        </div>
        <div className={styles.submitButton} onClick={onSubmitButtonClick}>
          <b className={styles.buttonLabel}>주문하기</b>
        </div>
      </div>
    </div>
  );
};

export default CartPage;