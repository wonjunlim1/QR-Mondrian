import styles from "./OrderQueueModal.module.css";
import deleteIcon from "../Assets/Images/delete.svg";

const OrderQueueModal = ({ onClose, pendingOrdersData }) => {
  console.log(pendingOrdersData);
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
            <div key={subOrder.sub_order_id} className={styles.orderWrapper}>
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
                  {subOrder.main_menus.reduce((total, menu) => {
                    const menuPrice = menu.price;
                    const optionPrices = menu.option_menus.reduce(
                      (totalOptions, option) => totalOptions + option.price,
                      0
                    );
                    return total + menuPrice + optionPrices;
                  }, 0)}
                  원
                </div>
              </div>
              <div className={styles.buttonArea}>
                <button className={styles.buttonAccepted}>
                  <b className={styles.buttonAcceptedLabel}>수락</b>
                </button>
                <button className={styles.buttonRejected}>
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