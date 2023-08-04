import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import OrderQueueModal from "../../Components/OrderQueueModal";
import PortalPopup from "../../Components/PortalPopup";
import TableModal from "../../Components/TableModal";
import WebHeader from "../../Components/WebHeader";
import styles from "./OrderPage.module.css";
import { encryptUrlParams, decryptUrlParams } from "../../utils/encryption";

const OrderPage = () => {
  // Navigation and location utility from React Router
  const navigate = useNavigate();
  const location = useLocation();

  // If the state was passed in the route, use it, otherwise default to false
  const isHQUser = location.state ? location.state.isHQUser : false;
  const isBranchUser = location.state ? location.state.isBranchUser : false;

  // Extracting params from URL
  const { restaurant_id: encodedRestaurantId, branch_id: encodedBranchId } =
    useParams();

  // Decoding params
  const restaurantId = decryptUrlParams(encodedRestaurantId);
  const branchId = decryptUrlParams(encodedBranchId);

  // Initializing states
  const [isOrderQueueModalPopupOpen, setOrderQueueModalPopupOpen] =
    useState(false);
  const [isTableModalPopupOpen, setTableModalPopupOpen] = useState(false);
  const [acceptedOrdersData, setAcceptedOrdersData] = useState(null);
  const [pendingOrderCount, setPendingOrderCount] = useState(null);
  const [acceptedOrderCount, setAcceptedOrderCount] = useState(null);
  const [mainRefresh, setMainRefresh] = useState(false);
  const [selectedTableOrders, setSelectedTableOrders] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  //Handle OrderQueueModalPopUp open
  const openOrderQueueModalPopup = useCallback(() => {
    setOrderQueueModalPopupOpen(true);
  }, []);

  //Handle OrderQueueModalPopUp close
  const closeOrderQueueModalPopup = useCallback(() => {
    setMainRefresh(!mainRefresh);
    setOrderQueueModalPopupOpen(false);
  }, [mainRefresh]);

  //Handle TableModalPopUp open
  const openTableModalPopup = useCallback((orders, id) => {
    setSelectedTableOrders(orders);
    setSelectedTableId(id);
    setTableModalPopupOpen(true);
  }, []);

  //Handle TableModalPopUp close
  const closeTableModalPopup = useCallback(() => {
    setMainRefresh(!mainRefresh);
    setTableModalPopupOpen(false);
  }, [mainRefresh]);

  /** Effect Hooks */

  // Effect to redirect user based on user type
  useEffect(() => {
    if (isHQUser) {
      navigate(
        `/menu_w/${encryptUrlParams(restaurantId)}/${encryptUrlParams(
          branchId
        )}`,
        {
          state: { isHQUser, isBranchUser },
        }
      );
    } else if (!isHQUser && !isBranchUser) {
      navigate(`/login_w`);
    }
  }, [navigate, isHQUser, isBranchUser, restaurantId, branchId]);

  // Effect to fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(
          `${serverAddress}/order_w/${restaurantId}/${branchId}`
        );
        const jsonData = await response.json();
        const combinedOrderData = jsonData.data.Accepted.reduce(
          (acc, order) => {
            const { table_number, sub_orders, order_id } = order;
            const tableMenus = sub_orders.flatMap((subOrder) =>
              subOrder.main_menus.map((menu) => ({ ...menu, order_id }))
            );
            acc[table_number] = acc[table_number]
              ? acc[table_number].concat(tableMenus)
              : tableMenus;
            return acc;
          },
          {}
        );
        const finalOrderData = Object.fromEntries(
          Object.entries(combinedOrderData).sort(
            ([tableNumberA], [tableNumberB]) => {
              return tableNumberA - tableNumberB;
            }
          )
        );
        setAcceptedOrdersData(finalOrderData);
        setAcceptedOrderCount(jsonData.data.Accepted.length);
        setPendingOrderCount(
          jsonData.data.Pending.reduce(
            (acc, order) => acc + order.sub_orders.length,
            0
          )
        );
      } catch (error) {
        console.log("Error fetching menu data:", error);
      }
    };

    fetchOrderData();
  }, [serverAddress, restaurantId, branchId, mainRefresh]);

  // Return null while data is loading
  if (!acceptedOrdersData) {
    return <div></div>;
  }

  return (
    <>
      <div className={styles.web}>
        <WebHeader
          isHQUser={isHQUser}
          isBranchUser={isBranchUser}
          restaurantId={restaurantId}
          branchId={branchId}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <div className={styles.headerWrapper}>
              <div className={styles.headerTitleWrapper}>
                <b className={styles.headerTitleLabel}>총 테이블 수</b>
                <b className={styles.headerTitleValue}>
                  {acceptedOrderCount ? acceptedOrderCount : 0}
                </b>
              </div>
              <div
                className={styles.buttonWrapper}
                onClick={openOrderQueueModalPopup}
              >
                <div className={styles.badge}>
                  <div className={styles.buttonValue}>
                    {pendingOrderCount ? pendingOrderCount : 0}
                  </div>
                </div>
                <div className={styles.buttonLabel}>신규주문</div>
              </div>
            </div>
            <div className={styles.tableList}>
              <div className={styles.tableRow}>
                {Object.keys(acceptedOrdersData).map((tableId, index) => (
                  <div
                    key={index}
                    className={styles.tableCard}
                    onClick={() =>
                      openTableModalPopup(acceptedOrdersData[tableId], tableId)
                    }
                  >
                    <div className={styles.tableContentWrapper}>
                      <b className={styles.tableContentTitle}>
                        테이블 {tableId}
                      </b>
                      <div className={styles.orderContentWrapper}>
                        {acceptedOrdersData[tableId]
                          .slice(0, 4)
                          .map((order, orderIndex) => (
                            <div
                              className={styles.orderContent}
                              key={orderIndex}
                            >
                              <div className={styles.menuAreaWrapper}>
                                <div className={styles.menuArea}>
                                  <div className={styles.menuLabel}>
                                    {order.name}
                                  </div>
                                  <div className={styles.optionLabel}>
                                    옵션 {order.option_menus.length}개
                                  </div>
                                </div>
                                <div className={styles.orderPrice}>
                                  {(
                                    order.price +
                                    order.option_menus.reduce(
                                      (acc, curr) => acc + curr.price,
                                      0
                                    )
                                  ).toLocaleString()}
                                  원
                                </div>
                              </div>
                            </div>
                          ))}
                        {acceptedOrdersData[tableId].length > 4 && (
                          <div className={styles.extraLabel}>
                            그 외 {acceptedOrdersData[tableId].length - 4}개
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.orderTotalPrice}>
                      총 주문금액{" "}
                      {acceptedOrdersData[tableId]
                        .reduce(
                          (total, order) =>
                            total +
                            order.price +
                            order.option_menus.reduce(
                              (acc, curr) => acc + curr.price,
                              0
                            ),
                          0
                        )
                        .toLocaleString()}
                      원
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOrderQueueModalPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeOrderQueueModalPopup}
        >
          <OrderQueueModal
            onClose={closeOrderQueueModalPopup}
            setMainRefresh={setMainRefresh}
          />
        </PortalPopup>
      )}
      {isTableModalPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeTableModalPopup}
        >
          <TableModal
            onClose={closeTableModalPopup}
            orders={selectedTableOrders}
            id={selectedTableId}
            setMainRefresh={setMainRefresh}
          />
        </PortalPopup>
      )}
    </>
  );
};

export default OrderPage;