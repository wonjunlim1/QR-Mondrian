import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import OrderQueueModal from "../../Components/OrderQueueModal";
import PortalPopup from "../../Components/PortalPopup";
import ModalTable from "../../Components/ModalTable";
import WebHeader from "../../Components/WebHeader";
import styles from "./OrderPage.module.css";
import { decryptUrlParams } from "../../utils/encryption";

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
  const [isModalTablePopupOpen, setModalTablePopupOpen] = useState(false);
  const [acceptedOrdersData, setAcceptedOrdersData] = useState(null);
  const [pendingOrderCount, setPendingOrderCount] = useState(null);
  const [acceptedOrderCount, setAcceptedOrderCount] = useState(null);
  const [eventCounter, setEventCounter] = useState(0);

  //Server address variable assignment
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

  const openOrderQueueModalPopup = useCallback(() => {
    setOrderQueueModalPopupOpen(true);
  }, []);

  const closeOrderQueueModalPopup = useCallback(() => {
    setEventCounter(eventCounter + 1);
    setOrderQueueModalPopupOpen(false);
  }, [eventCounter]);

  const openModalTablePopup = useCallback(() => {
    setModalTablePopupOpen(true);
  }, []);

  const closeModalTablePopup = useCallback(() => {
    setEventCounter(eventCounter + 1);
    setModalTablePopupOpen(false);
  }, [eventCounter]);

  /** Effect Hooks */

  // Effect to redirect user based on user type
  useEffect(() => {
    if (isHQUser) {
      navigate(`/menu_w/${restaurantId}/${branchId}`, {
        state: { isHQUser, isBranchUser },
      });
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
            const { table_number, sub_orders } = order;
            const tableMenus = sub_orders.flatMap(
              (subOrder) => subOrder.main_menus
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
  }, [serverAddress, restaurantId, branchId, eventCounter]);

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
            <div className={styles.cardlist}>
              <div className={styles.row}>
                <div className={styles.tabelCard} onClick={openModalTablePopup}>
                  <div className={styles.div}>
                    <b className={styles.title2}>테이블 1</b>
                    <div className={styles.orderinfo}>
                      <div className={styles.orderlist}>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <div className={styles.label1}>메뉴 이름</div>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <div className={styles.value1}>10,000원</div>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <div className={styles.label1}>메뉴 이름</div>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <div className={styles.value1}>10,000원</div>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <div className={styles.label1}>메뉴 이름</div>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <div className={styles.value1}>10,000원</div>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <div className={styles.label1}>메뉴 이름</div>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <div className={styles.value1}>10,000원</div>
                        </div>
                      </div>
                      <div className={styles.label5}>그 외 N개</div>
                    </div>
                  </div>
                  <div className={styles.value5}>총 주문금액 20,000원</div>
                </div>
                <div className={styles.tabelCard} onClick={openModalTablePopup}>
                  <div className={styles.div}>
                    <b className={styles.title2}>테이블 2</b>
                    <div className={styles.orderinfo}>
                      <div className={styles.orderlist}>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                      </div>
                      <b className={styles.label10}>그 외 N개</b>
                    </div>
                  </div>
                  <b className={styles.value10}>총 주문금액 20,000원</b>
                </div>
                <div className={styles.tabelCard} onClick={openModalTablePopup}>
                  <div className={styles.div}>
                    <b className={styles.title2}>테이블 3</b>
                    <div className={styles.orderinfo}>
                      <div className={styles.orderlist}>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                      </div>
                      <b className={styles.label10}>그 외 N개</b>
                    </div>
                  </div>
                  <b className={styles.value10}>총 주문금액 20,000원</b>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.tabelCard} onClick={openModalTablePopup}>
                  <div className={styles.div}>
                    <b className={styles.title2}>테이블 4</b>
                    <div className={styles.orderinfo}>
                      <div className={styles.orderlist}>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                        <div className={styles.titlearea}>
                          <div className={styles.div1}>
                            <b className={styles.label6}>메뉴 이름</b>
                            <div className={styles.option}>옵션 N개</div>
                          </div>
                          <b className={styles.value6}>10,000원</b>
                        </div>
                      </div>
                      <b className={styles.label10}>그 외 N개</b>
                    </div>
                  </div>
                  <b className={styles.value10}>총 주문금액 20,000원</b>
                </div>
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
            setEventCounter={setEventCounter}
          />
        </PortalPopup>
      )}
      {isModalTablePopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeModalTablePopup}
        >
          <ModalTable onClose={closeModalTablePopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default OrderPage;