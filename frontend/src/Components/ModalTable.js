import styles from "./ModalTable.module.css";
const ModalTable = ({ onClose }) => {
  return (
    <div className={styles.modaltable}>
      <div className={styles.header}>
        <b className={styles.title}>TABLE 주문 내역</b>
        <button className={styles.icon} onClick={onClose}>
          <div className={styles.xL}>
            <img className={styles.xLChild} alt="" src="/group-1.svg" />
          </div>
        </button>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.orderWrappear}>
          <div className={styles.titlearea}>
            <div className={styles.label}>테이블 1</div>
            <div className={styles.divider} />
          </div>
          <div className={styles.div1}>
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
          </div>
        </div>
        <div className={styles.scrollthumb} />
      </div>
    </div>
  );
};

export default ModalTable;