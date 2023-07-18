import styles from "./TableModal.module.css";
import deleteIcon from "../Assets/Images/delete.svg";

const TableModal = ({ onClose, orders, setEventCounter }) => {
  // Initializing states
  const acceptedOrdersData = orders;

  /** Event Handlers */

  // Function to handle click on button
  const onButtonClick = async (id, action) => {
    setEventCounter((prevCounter) => prevCounter + 1);
  };

  // Return null while data is loading
  if (!acceptedOrdersData) {
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
        {acceptedOrdersData
          .flatMap((order) =>
            order.sub_orders.map((subOrder) => ({
              table_number: order.table_number,
              subOrder,
            }))
          )
          .map(({ table_number, subOrder }, index) => (
            <div className={styles.orderWrapper} key={index}>
              <div className={styles.orderTitleArea}>
                <div className={styles.orderTitleLabel}>
                  테이블 {table_number}
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
                          {menu.price.toLocaleString()}원
                        </div>
                      </div>
                      <div className={styles.optionMenuWrapper}>
                        {menu.option_menus.map((option) => (
                          <div className={styles.optionMenuWrapperChild}>
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
          ))}

        {acceptedOrdersData.flatMap((order) => order.sub_orders).length % 2 !==
          0 && (
          <div
            className={styles.orderWrapper}
            style={{ visibility: "hidden" }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default TableModal;