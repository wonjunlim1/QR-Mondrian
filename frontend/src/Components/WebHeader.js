import { useCallback } from "react";
import styles from "./WebHeader.module.css";
const WebHeader = () => {
  /** Event Handlers */

  // Get info of current user from Cognito User Pool
  const userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
  });
  const currentUser = userPool.getCurrentUser();
  if (currentUser != null) {
    currentUser.getSession(function (err, session) {
      if (err) {
        alert(err);
        return;
      }
      console.log("session validity: " + session.isValid());
    });
  }
  
  // Function to handle click on tab menu item
  const onTabMenuItemClick = useCallback(
    (desination) => {
      if (desination === "Menu") {
        navigate(
          `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
            branchId
          )}`,
          {
            state: { isHQUser, isBranchUser },
          }
        );
      } else if (desination === "Order") {
        navigate(
          `/order_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
            branchId
          )}`,
          {
            state: { isHQUser, isBranchUser },
          }
        );
      } else {
        navigate(
          `/data_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
            branchId
          )}`,
          {
            state: { isHQUser, isBranchUser },
          }
        );
      }
    },
    [navigate, restaurantId, branchId, isHQUser, isBranchUser]
  );

  // Function to handle logout
  const onLogoutButtonClick = useCallback(() => {
    if (currentUser != null) {
      currentUser.signOut();
      navigate("/login_w"); // navigate to login (or another appropriate route) after signing out
    }
  }, [currentUser, navigate]);

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