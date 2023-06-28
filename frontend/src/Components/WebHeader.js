import { useCallback } from "react";
import styles from "./WebHeader.module.css";
const WebHeader = () => {
  const onHeaderContainerClick = useCallback(() => {
    // Please sync "Button" to the project
  }, []);

  const onTabMenuItemClick = useCallback(() => {
    // Please sync "Button" to the project
  }, []);

  // Render the component
  return (
    <div className={styles.gnb} onClick={onHeaderContainerClick}>
      <div className={styles.fixedarea}>
        <div className={styles.tabmenugroup}>
          <a
            className={styles.tabmenuitem}
            href="http://www.naver.com"
            onClick={onTabMenuItemClick}
          >
            <b className={styles.b}>메뉴</b>
          </a>
          <a
            className={styles.tabmenuitem1}
            href="http://www.naver.com"
            target="_blank"
          >
            <b className={styles.b}>주문</b>
          </a>
          <a className={styles.tabmenuitem2} href="http://www.naver.com">
            <b className={styles.b}>데이터</b>
          </a>
        </div>
        <div className={styles.textbutton}>
          <b className={styles.b3}>로그아웃</b>
        </div>
      </div>
    </div>
  );
};

export default WebHeader;