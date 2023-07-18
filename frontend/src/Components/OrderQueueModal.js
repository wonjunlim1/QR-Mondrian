import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decryptUrlParams } from "../utils/encryption";
import styles from "./OrderQueueModal.module.css";
import deleteIcon from "../Assets/Images/delete.svg";

const OrderQueueModal = ({ onClose }) => {
  // Initializing states
  const [pendingOrdersData, setPendingOrdersData] = useState(null);
  const [buttonClickCounter, setButtonClickCounter] = useState(0);

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  // Extracting params from URL
  const { restaurant_id: encodedRestaurantId, branch_id: encodedBranchId } =
    useParams();

  // Decoding params
  const restaurantId = decryptUrlParams(encodedRestaurantId);
  const branchId = decryptUrlParams(encodedBranchId);

  /** Event Handlers */

  // Function to handle click on button
  const onButtonClick = async (id, action) => {
    console.log(id);
    setButtonClickCounter(buttonClickCounter + 1);
    const data = {
      update_sub_order: [
        {
          sub_order_id: id,
          order_status: action,
        },
      ],
    };
    try {
      const response = await fetch(
        `${serverAddress}/order_w/${restaurantId}/${branchId}`,
        {
          method: "PUT",
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

  // Effect to fetch menu data once the component mounts
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(
          `${serverAddress}/order_w/${restaurantId}/${branchId}`
        );
        const jsonData = await response.json();
        setPendingOrdersData(jsonData.data.Pending);
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchOrderData();
  }, [serverAddress, restaurantId, branchId, buttonClickCounter]);

  // Return null while data is loading
  if (!pendingOrdersData) {
    return <div></div>;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <b className={styles.modalHeaderTitle}>신규 주문 내역</b>
        <button className={styles.iconWrapper} onClick={onClose}>
          <div className={styles.icon}>
            <img className={styles.iconChild} alt="" src={deleteIcon} />
          </div>
        </button>
      </div>
      <div className={styles.contentWrapper}>
        {pendingOrdersData.map((order) =>
          order.sub_orders.map((subOrder) => (
            <div className={styles.orderWrapper}>
              <div className={styles.orderTitleArea}>
                <div className={styles.orderTitleLabel}>
                  테이블 {order.table_number}
                </div>
                <div className={styles.divider} />
              </div>
              <div className={styles.orderContentWrapper}>
                <div className={styles.orderContentColumn}>
                  {subOrder.main_menus.map((menu) => (
                    <div className={styles.orderContent}>
                      <div className={styles.mainMenuWrapper}>
                        <div className={styles.mainMenuLabel}>{menu.name}</div>
                        <div className={styles.mainMenuPrice}>
                          {menu.price}원
                        </div>
                      </div>
                      <div className={styles.optionMenuWrapper}>
                        {menu.option_menus.map((option) => (
                          <div className={styles.optionMenuWrapperChild}>
                            <div className={styles.optionMenuLabel}>
                              {option.name}
                            </div>
                            <div className={styles.optionMenuPrice}>
                              {option.price}원
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.orderPriceArea}>
                <div className={styles.orderPriceLabel}>총 주문 금액</div>
                <div className={styles.orderPrice}>
                  {subOrder.main_menus
                    .reduce((total, menu) => {
                      const menuPrice = menu.price;
                      const optionPrices = menu.option_menus.reduce(
                        (totalOptions, option) => totalOptions + option.price,
                        0
                      );
                      return total + menuPrice + optionPrices;
                    }, 0)
                    .toLocaleString()}
                  원
                </div>
              </div>
              <div className={styles.buttonArea}>
                <button
                  className={styles.buttonAccepted}
                  onClick={() =>
                    onButtonClick(subOrder.sub_order_id, "Accepted")
                  }
                >
                  <b className={styles.buttonAcceptedLabel}>수락</b>
                </button>
                <button
                  className={styles.buttonRejected}
                  onClick={() =>
                    onButtonClick(subOrder.sub_order_id, "Rejected")
                  }
                >
                  <div className={styles.buttonRejectedLabel}>품절</div>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderQueueModal;