import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";

import styles from "./LoginPage.module.css";
import logoImage from "../../Assets/Images/qr_logo.png";

function LoginPage() {
  // Navigation utility from React Router
  const navigate = useNavigate();

  // Initializing states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Cognito variable assignments
  const userPoolId = process.env.REACT_APP_USER_POOL_ID;
  const clientId = process.env.REACT_APP_CLIENT_ID;

  /** Event Handlers */

  // Function to hangle logins
  const handleLogin = (event) => {
    event.preventDefault();
    const userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });

    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const decodedToken = jwt_decode(result.getAccessToken().getJwtToken());
        const isHQUser =
          decodedToken["cognito:groups"].includes("headquarters");
        const isBranchUser = decodedToken["cognito:groups"].includes("branch");

        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.error(err);
          } else {
            const nameAttribute = attributes.find(
              (attribute) => attribute.getName() === "name"
            );
            const identifier = nameAttribute ? nameAttribute.getValue() : null;
            const [restaurantId, branchId] = identifier.split("/");
            if (isHQUser) {
              navigate(`/menu_w/${restaurantId}/${branchId}`, {
                state: { isHQUser, isBranchUser },
              });
            } else if (isBranchUser) {
              navigate(`/order_w/${restaurantId}/${branchId}`, {
                state: { isHQUser, isBranchUser },
              });
            }
          }
        });
      },
      onFailure: (err) => {
        console.error(err);
      },
    });
  };

  // Render the component
  return (
    <div className={styles.loginPage}>
      <img src={logoImage} alt="Logo" className={styles.logoImage} />
      <form onSubmit={handleLogin} className={styles.fieldWrapper}>
        <p className={styles.inputLabel}>ID</p>
        <input
          type="text"
          className={styles.inputField}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <p className={styles.inputLabel}>비밀번호</p>
        <input
          type="password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className={styles.styledButton}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default LoginPage;