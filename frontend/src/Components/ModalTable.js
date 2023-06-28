import styles from "./ModalTable.module.css";
const ModalTable = ({ onClose }) => {
  return (
    <div className={styles.modalTable}>
      <div className={styles.orderinfo}>
        <div className={styles.titlearea}>
          <div className={styles.label}>테이블 1</div>
          <div className={styles.divider} />
        </div>
        <div className={styles.div}>
          <div className={styles.ordercolumn}>
            <div className={styles.order}>
              <div className={styles.info}>
                <div className={styles.label1}>메뉴 이름</div>
                <div className={styles.price}>10,000원</div>
              </div>
              <div className={styles.optionGroup}>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>1,000원</div>
                </div>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>2,000원</div>
                </div>
              </div>
            </div>
            <div className={styles.order}>
              <div className={styles.info}>
                <div className={styles.label1}>떡볶이 그라탕...</div>
                <div className={styles.price}>10,000원</div>
              </div>
              <div className={styles.optionGroup1}>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>1,000원</div>
                </div>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>2,000원</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ordercolumn}>
            <div className={styles.order}>
              <div className={styles.info}>
                <b className={styles.label7}>메뉴 이름</b>
                <b className={styles.price1}>10,000원</b>
              </div>
              <div className={styles.optionGroup}>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>1,000원</div>
                </div>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>2,000원</div>
                </div>
              </div>
            </div>
            <div className={styles.order}>
              <div className={styles.info}>
                <b className={styles.label7}>메뉴 이름</b>
                <b className={styles.price1}>10,000원</b>
              </div>
              <div className={styles.optionGroup}>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>1,000원</div>
                </div>
                <div className={styles.optionInfo}>
                  <div className={styles.label2}>옵션 이름</div>
                  <div className={styles.price1}>2,000원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.info4}>
          <div className={styles.label13}>총 주문 금액</div>
          <div className={styles.price12}>10,000원</div>
        </div>
        <div className={styles.buttongroup}>
          <button className={styles.button}>
            <b className={styles.label14}>수락</b>
          </button>
          <button className={styles.button1}>
            <img className={styles.plusIcon} alt="" src="/plus.svg" />
            <div className={styles.label15}>품절로 판매불가</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTable;