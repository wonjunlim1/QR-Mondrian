import React, { useState } from 'react'; 
import jwt_decode from 'jwt-decode';
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';

import styles from './LoginPage.module.css';
import logo_image from '../../Assets/Images/qr_logo.png';

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userPoolId = process.env.REACT_APP_USER_POOL_ID;
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('hello');
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
        const isHQUser = decodedToken['cognito:groups'].includes('headquarters')
        navigate('/order_w',  { state: { isHQUser } });
       
      },
      onFailure: (err) => {
        console.error(err);
        // TODO: handle failed sign in, e.g. show error message to user
      },
    });
  };

  return (
    <div className={styles.loginPage}>
      <img src={logo_image} alt="Logo" className={styles.logoImage} /> 
      <div className={styles.fieldWrapper}>
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
      </div>
      <button  
        onClick={handleLogin}
        className={styles.styledButton}
      >
        로그인
      </button>
    </div>
  );
};

export default LoginPage;