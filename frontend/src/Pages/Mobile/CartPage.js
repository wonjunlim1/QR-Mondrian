import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./CartPage.module.css";
import arrowBackIcon from "../../Assets/Images/arrow-back.svg";
import deleteIcon from "../../Assets/Images/delete.svg";
import pendingIcon from "../../Assets/Images/pending.svg";
import acceptedIcon from "../../Assets/Images/accepted.svg";
import rejectedIcon from "../../Assets/Images/rejected.svg";

const CartPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  // Check if last page was editting a menu
  const fromEditMenu = location.state ? location.state.editMenu : false;

  // Initializing states
  const [pastOrdersData, setPastOrdersData] = useState(null);
  const [pastOrdersPrice, setPastOrdersPrice] = useState(0);
  const [currentCartData, setCurrentCartData] = useState([]);
  const [currentCartPrice, setCurrentCartPrice] = useState(0);
  const [pastOrdersDataCalled, setPastOrdersDataCalled] = useState(false);

  // Extracting params from URL
  const {
    restaurant_id: restaurantId,
    branch_id: branchId,
    table_number: tableNumber,
  } = useParams();

  /** Event Handlers */

  // Callback function to navigate back
  const onBackIconClick = useCallback(() => {
    if (fromEditMenu) {
      navigate(`/menu_m/${restaurantId}/${branchId}/${tableNumber}`);
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
          item.menu_price +
          item.option_menus.reduce((a, b) => a + b.option_price, 0);
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
        `/menu_m/${restaurantId}/${branchId}/${tableNumber}/${menu_id}`,
        { state: { temp_id } }
      );
    },
    [navigate, restaurantId, branchId, tableNumber]
  );

  // Callback function to submit the order
  const onSubmitButtonClick = useCallback(async () => {
    // Check and get current order data from local storage
    // Transform the data and send a POST request to the server
    // Clear the cart data in the local storage
    // Redirect to the restaurant menu page

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartData.length > 0) {
      const main_menus = cartData.map((item) => ({
        id: item.menu_id,
        price: item.menu_price,
        option_menus: item.option_menus.map((option) => ({
          id: option.option_id,
          price: option.option_price,
        })),
      }));

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
        navigate(`/menu_m/${restaurantId}/${branchId}/${tableNumber}`);
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
      const parsedCart = JSON.parse(check_cart);
      setCurrentCartData(parsedCart);
      const totalPrice = parsedCart.reduce((total, item) => {
        const itemTotal =
          item.menu_price +
          item.option_menus.reduce((a, b) => a + b.option_price, 0);
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
              src={arrowBackIcon}
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
                    <img
                      className={styles.menuImage}
                      alt={item.menu_name}
                      src={item.image_url}
                    />
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
                          item.menu_price +
                          item.option_menus.reduce(
                            (a, b) => a + b.option_price,
                            0
                          )
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
                                ? "확인 중"
                                : order.order_status === "Accepted"
                                ? "확인 완료"
                                : order.order_status === "Rejected"
                                ? "거절 됨"
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