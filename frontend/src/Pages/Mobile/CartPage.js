import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./CartPage.module.css";
import arrowIcon from "../../Assets/Images/arrow-back.svg";
import deleteIcon from "../../Assets/Images/delete.svg";
import pendingIcon from "../../Assets/Images/pending.svg";
import acceptedIcon from "../../Assets/Images/accepted.svg";
import rejectedIcon from "../../Assets/Images/rejected.svg";

const CartPage = () => {
  const navigate = useNavigate();
  const [pastOrdersData, setPastOrdersData] = useState(null);
  const [pastOrdersPrice, setPastOrdersPrice] = useState(0);
  const [pastOrdersDataGetCalled, setPastOrdersDataGetCalled] = useState(false);
  const [currentOrdersData, setCurrentOrdersData] = useState([]);
  const [currentOrdersPrice, setCurrentOrdersPrice] = useState(0);

  const {
    restaurant_id: restaurantId,
    branch_id: branchId,
    table_number: tableNumber,
  } = useParams();

  const onArrowIconClick = useCallback(() => {
    navigate(-1); // Use -1 to go back to the previous page
  }, [navigate]);

  const onDeleteIconClick = useCallback(
    (temp_id) => {
      const updatedData = currentOrdersData.filter(
        (item) => item.temp_id !== temp_id
      );

      setCurrentOrdersData(updatedData);

      localStorage.setItem("cart", JSON.stringify(updatedData));

      const totalPrice = updatedData.reduce((total, item) => {
        const itemTotal =
          item.menu_price +
          item.option_menus.reduce((a, b) => a + b.option_price, 0);
        return total + itemTotal;
      }, 0);
      setCurrentOrdersPrice(totalPrice);
    },
    [currentOrdersData]
  );

  const onModifyButtonClick = useCallback(
    (temp_id, menu_id) => {
      console.log(temp_id);
      navigate(
        `/menu_m/${restaurantId}/${branchId}/${tableNumber}/${menu_id}`,
        { state: { temp_id } }
      );
    },
    [navigate, restaurantId, branchId, tableNumber]
  );

  const onSubmitButtonClick = useCallback(async () => {
    // Get the cart data from local storage
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if cart is not empty
    if (cartData.length > 0) {
      // Transform the cart data to the new format
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

      // Send a POST request with the transformed data
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
        console.log(transformedCartData);
        console.log(response);
        localStorage.removeItem("cart");
        navigate(`/menu_m/${restaurantId}/${branchId}/${tableNumber}`);

        // Handle response...
      } catch (error) {
        // Handle error...
      }
    }
  }, [navigate, restaurantId, branchId, tableNumber]);

  useEffect(() => {
    const fetchPastOrdersData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/cart_m/${restaurantId}/${branchId}/${tableNumber}`
        );
        const jsonData = await response.json();
        const flattenedPastOrders = jsonData.data["past_orders"]
          ? jsonData.data["past_orders"].flatMap((subOrderArray) =>
              subOrderArray.map((subOrder) => {
                // map each main_menu to include order_status from its parent sub_order
                subOrder.main_menus = subOrder.main_menus.map((menu) => {
                  return { ...menu, order_status: subOrder.order_status };
                });
                return subOrder;
              })
            )
          : [];

        setPastOrdersData(flattenedPastOrders);

        // Calculate the total price after fetching the data
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

        // Update the total price state
        setPastOrdersPrice(totalPrice);

        setPastOrdersDataGetCalled(true);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchPastOrdersData();
  }, [restaurantId, branchId, tableNumber]);

  useEffect(() => {
    const check_cart = localStorage.getItem("cart");
    if (check_cart) {
      const parsedCart = JSON.parse(check_cart);
      setCurrentOrdersData(parsedCart);
      const totalPrice = parsedCart.reduce((total, item) => {
        const itemTotal =
          item.menu_price +
          item.option_menus.reduce((a, b) => a + b.option_price, 0);
        return total + itemTotal;
      }, 0);
      setCurrentOrdersPrice(totalPrice);
    }
  }, []);

  if (!pastOrdersDataGetCalled) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.mobile}>
      <div className={styles.gnbMobileParent}>
        <div className={styles.gnbSpace}></div>
        <div className={styles.gnbMobile}>
          <div className={styles.icon}>
            <img
              className={styles.arrowLeftIcon}
              alt=""
              src={arrowIcon}
              onClick={onArrowIconClick}
            />
          </div>
          <b className={styles.b}>장바구니</b>
          <div />
        </div>
        <div className={styles.layout}>
          <div className={styles.div}>
            <div className={styles.titlearea}>
              <div className={styles.titlearea1}>
                <b className={styles.title}>현재 주문서</b>
                <b
                  className={styles.price}
                >{`총 ${currentOrdersPrice.toLocaleString()}원`}</b>
              </div>
              <div className={styles.divider} />
            </div>
            {currentOrdersData.map((item, idx, array) => (
              <div key={item.temp_id} className={styles.div1}>
                <div className={styles.order}>
                  <div className={styles.div2}>
                    <b className={styles.name}>{item.menu_name}</b>
                    <img
                      className={styles.arrowLeftIcon}
                      alt="delete"
                      src={deleteIcon}
                      onClick={() => onDeleteIconClick(item.temp_id)}
                    />
                  </div>
                  <div className={styles.div3}>
                    <img
                      className={styles.menuimageIcon}
                      alt={item.menu_name}
                      src={item.image_url}
                    />
                    <div className={styles.price1}>
                      <div className={styles.div4}>
                        <div className={styles.price2}>
                          <div className={styles.priceChild} />
                          <div className={styles.label}>
                            {`가격 : ${item.menu_price.toLocaleString()}원`}
                          </div>
                        </div>
                        <div className={styles.price3}>
                          <div className={styles.priceChild} />
                          <div className={styles.label}>
                            {`옵션 수(${
                              item.option_menus.length
                            }개) : ${item.option_menus
                              .reduce((a, b) => a + b.option_price, 0)
                              .toLocaleString()}원`}
                          </div>
                        </div>
                      </div>
                      <b className={styles.totalprice}>
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
                  <div className={styles.div5}>
                    <div
                      className={styles.button}
                      onClick={() =>
                        onModifyButtonClick(item.temp_id, item.menu_id)
                      }
                    >
                      <b className={styles.label4}>옵션변경</b>
                    </div>
                  </div>
                </div>
                {idx < array.length - 1 && <div className={styles.divider1} />}
              </div>
            ))}
          </div>
          <div className={styles.div12}>
            <div className={styles.titlearea}>
              <div className={styles.titlearea1}>
                <b className={styles.title}>지난 주문서</b>
                <b className={styles.price11}>
                  총 {pastOrdersPrice.toLocaleString()}원
                </b>
              </div>
              <div className={styles.divider} />
            </div>
            {pastOrdersData.length > 0 && (
              <div className={styles.div13}>
                {pastOrdersData.map((order, orderIndex) =>
                  order.main_menus.map((menu, menuIndex, array) => (
                    <React.Fragment key={`${order.sub_order_id}-${menuIndex}`}>
                      <div className={styles.order}>
                        <div className={styles.div14}>
                          <b className={styles.name2}>{menu.name}</b>
                          <div
                            className={
                              order.order_status === "Pending"
                                ? styles.label16
                                : order.order_status === "Accepted"
                                ? styles.label10
                                : order.order_status === "Rejected"
                                ? styles.label13
                                : ""
                            }
                          >
                            {order.order_status === "Accepted" && (
                              <img
                                className={styles.checkCircleIcon}
                                alt=""
                                src={acceptedIcon}
                              />
                            )}
                            {order.order_status === "Rejected" && (
                              <img
                                className={styles.alertTriangleIcon}
                                alt=""
                                src={rejectedIcon}
                              />
                            )}
                            {order.order_status === "Pending" && (
                              <img
                                className={styles.alertTriangleIcon}
                                alt=""
                                src={pendingIcon}
                              />
                            )}
                            <b className={styles.state}>
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
                        <div className={styles.price12}>
                          <div className={styles.div4}>
                            <div key={menu.name} className={styles.price3}>
                              <div className={styles.priceChild5} />
                              <div className={styles.label}>
                                가격 : {menu.price.toLocaleString()}원
                              </div>
                            </div>
                            {menu.option_menus.map((option) => (
                              <div key={option.name} className={styles.price3}>
                                <div className={styles.priceChild5} />
                                <div className={styles.label}>{`${
                                  option.name
                                } : ${option.price.toLocaleString()}원`}</div>
                              </div>
                            ))}
                          </div>
                          <b className={styles.totalprice2}>
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
                        <div className={styles.divider1} />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.div20}>
        <div className={styles.price21}>
          <div className={styles.label}>
            <span>현재 주문 금액 : </span>
            <b>{`${currentOrdersPrice.toLocaleString()}원`}</b>
          </div>
          <div className={styles.label20}>
            <span>총 주문 금액 : </span>
            <b>{`${(
              currentOrdersPrice + pastOrdersPrice
            ).toLocaleString()}원`}</b>
          </div>
        </div>
        <div className={styles.button4} onClick={onSubmitButtonClick}>
          <b className={styles.label4}>주문하기</b>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
