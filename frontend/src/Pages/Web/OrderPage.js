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

  const [isOrderQueueModalPopupOpen, setOrderQueueModalPopupOpen] =
    useState(false);
  const [isModalTablePopupOpen, setModalTablePopupOpen] = useState(false);

  const openOrderQueueModalPopup = useCallback(() => {
    setOrderQueueModalPopupOpen(true);
  }, []);

  const closeOrderQueueModalPopup = useCallback(() => {
    setOrderQueueModalPopupOpen(false);
  }, []);

  const openModalTablePopup = useCallback(() => {
    setModalTablePopupOpen(true);
  }, []);

  const closeModalTablePopup = useCallback(() => {
    setModalTablePopupOpen(false);
  }, []);

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

  return (
    <>
      <div className={styles.web}>
        <WebHeader
          isHQUser={isHQUser}
          isBranchUser={isBranchUser}
          restaurantId={restaurantId}
          branchId={branchId}
        />
        <div className={styles.bodylayout}>
          <div className={styles.fixedarea}>
            <div className={styles.titlearea}>
              <div className={styles.title}>
                <b className={styles.title1}>총 테이블 수</b>
                <div className={styles.value}>4</div>
              </div>
              <button
                className={styles.button}
                onClick={openOrderQueueModalPopup}
              >
                <div className={styles.badge}>
                  <b className={styles.b}>2</b>
                </div>
                <div className={styles.label}>신규주문</div>
              </button>
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
          <OrderQueueModal onClose={closeOrderQueueModalPopup} />
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