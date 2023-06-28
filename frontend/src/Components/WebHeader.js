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
    <div className={styles.headerWrapper}>
      <div className={styles.contentArea}>
        <div className={styles.tabMenuGroup}>
          <div
            className={
              currentTab === "Menu"
                ? styles.tabMenuItemActive
                : styles.tabMenuItem
            }
            onClick={() => onTabMenuItemClick("Menu")}
          >
            <b className={styles.boldLabel}>메뉴</b>
          </div>
          {!isHQUser && (
            <div
              className={
                currentTab === "Order"
                  ? styles.tabMenuItemActive
                  : styles.tabMenuItem
              }
              onClick={() => onTabMenuItemClick("Order")}
            >
              <b className={styles.boldLabel}>주문</b>
            </div>
          )}
          <div
            className={
              currentTab === "Data"
                ? styles.tabMenuItemActive
                : styles.tabMenuItem
            }
            onClick={() => onTabMenuItemClick("Data")}
          >
            <b className={styles.boldLabel}>데이터</b>
          </div>
        </div>
        <div className={styles.button} onClick={onLogoutButtonClick}>
          <b className={styles.buttonLabel}>로그아웃</b>
        </div>
      </div>
    </div>
  );
};

export default WebHeader;