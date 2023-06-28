import React from "react";
import { useLocation } from "react-router-dom";

import { useState, useCallback } from "react";
import Modal from "../../Components/Modal";
import PortalPopup from "../../Components/PortalPopup";
import ModalTable from "../../Components/ModalTable";
import WebHeader from "../../Components/WebHeader";
import styles from "./OrderPage.module.css";

const OrderPage = () => {
  const location = useLocation();

  // If the state was passed in the route, use it, otherwise default to false
  const isHQUser = location.state ? location.state.isHQUser : false;
  //const isBranchUser = location.state ? location.state.isBranchUser : false;

  const [isModalPopupOpen, setModalPopupOpen] = useState(false);
  const [isModalTablePopupOpen, setModalTablePopupOpen] = useState(false);

  const openModalPopup = useCallback(() => {
    setModalPopupOpen(true);
  }, []);

  const closeModalPopup = useCallback(() => {
    setModalPopupOpen(false);
  }, []);

  const openModalTablePopup = useCallback(() => {
    setModalTablePopupOpen(true);
  }, []);

  const closeModalTablePopup = useCallback(() => {
    setModalTablePopupOpen(false);
  }, []);

  return (
    <>
      <div className={styles.web}>
        <WebHeader />
        <div className={styles.bodylayout}>
          <div className={styles.fixedarea}>
            <div className={styles.titlearea}>
              <div className={styles.title}>
                <b className={styles.title1}>총 테이블 수</b>
                <div className={styles.value}>4</div>
              </div>
              <button className={styles.button} onClick={openModalPopup}>
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
      {isModalPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeModalPopup}
        >
          <Modal onClose={closeModalPopup} />
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