import React from "react";
import { useLocation } from "react-router-dom";

function OrderPage(props) {
  const location = useLocation();

  // If the state was passed in the route, use it, otherwise default to false
  const isHQUser = location.state ? location.state.isHQUser : false;
  //const isBranchUser = location.state ? location.state.isBranchUser : false;

  return (
    <div>
      {isHQUser ? (
        <div>
          <h1>Welcome, HQ!</h1>
        </div>
      ) : (
        <div>
          <h1>Welcome, Outlet!</h1>
        </div>
      )}
    </div>
  );
}

export default OrderPage;