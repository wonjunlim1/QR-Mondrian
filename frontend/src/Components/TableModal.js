import { decryptUrlParams } from "../utils/encryption";
import { useParams } from "react-router-dom";
import styles from "./TableModal.module.css";
import deleteIcon from "../Assets/Images/delete.svg";

const TableModal = ({ onClose, orders, id, setEventCounter }) => {
  // Initializing variables
  const acceptedOrdersData = orders;
  const tableId = id;
  const orderId = orders[0].order_id;

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
  const onCompleteButtonClick = async () => {
    setEventCounter((prevCounter) => prevCounter + 1);
    const data = {
      close_order: [
        {
          order_id: orderId,
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
      onClose();
    } catch (error) {
      console.log(error);
      onClose();
    }
  };

  // Return null while data is loading
  if (!acceptedOrdersData) {
    return <div></div>;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <b className={styles.modalHeaderTitle}>현재 주문 내역</b>
        <button className={styles.iconWrapper} onClick={onClose}>
          <div className={styles.icon}>
            <img className={styles.iconChild} alt="" src={deleteIcon} />
          </div>
        </button>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.orderWrapper}>
          <div className={styles.orderTitleArea}>
            <div className={styles.orderTitleLabel}>테이블 {tableId}</div>
            <div className={styles.divider} />
          </div>
          <div className={styles.orderContentWrapper}>
            <div className={styles.orderContentColumn}>
              {acceptedOrdersData.map((menu, index) => (
                <div className={styles.orderContent} key={index}>
                  <div className={styles.mainMenuWrapper}>
                    <div className={styles.mainMenuLabel}>{menu.name}</div>
                    <div className={styles.mainMenuPrice}>
                      {menu.price.toLocaleString()}원
                    </div>
                  </div>
                  <div className={styles.optionMenuWrapper}>
                    {menu.option_menus.map((option, optionIndex) => (
                      <div
                        className={styles.optionMenuWrapperChild}
                        key={optionIndex}
                      >
                        <div className={styles.optionMenuLabel}>
                          {option.name}
                        </div>
                        <div className={styles.optionMenuPrice}>
                          {option.price.toLocaleString()}원
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
              {acceptedOrdersData
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
          {/* Button area should probably be updated depending on the actual functionality you want */}
          <div className={styles.buttonArea}>
            <button
              className={styles.buttonCompleted}
              onClick={onCompleteButtonClick}
            >
              <b className={styles.buttonCompletedLabel}>수락</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableModal;