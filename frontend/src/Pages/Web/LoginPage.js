import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button'; 
import jwt_decode from 'jwt-decode';
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';

const logo = '/Assets/Images/qr_logo.png';

// Styled components
const StyledDiv = styled('div')(({ theme }) => ({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  borderRadius: `16px`,
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `column`,
  alignItems: 'center',
  padding: `24px`,
  boxSizing: `border-box`,
  height: '100vh',
  justifyContent: 'center',
}));

const FieldWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start', 
  width: '352px', 
}));

const LogoImage = styled('img')(({ theme }) => ({
  width: '352px',
  height: '352px',
  marginBottom: '16px',
}));

const InputLabel = styled('p')(({ theme }) => ({
  color: '#AAB0BB',
  fontFamily: 'Pretendard-Regular',
  fontSize: '14px',
  marginBottom: '4px', 
}));

const InputField = styled('input')(({ theme }) => ({
  border: '1px solid rgb(193,197,205)',
  borderRadius: '4px',
  width: '318px', 
  height: '22px',
  marginBottom: '8x',
  padding: '8px 16px 8px 16px',
  fontFamily: 'Pretendard-Regular',
  fontSize: '16px',
  '&&:focus': {
    outline: 'none', 
    borderColor: '#001B27',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: '352px', 
  marginTop: '26px',
  height: '40px', 
  color: '#ffffff',
  fontFamily: 'Pretendard-Bold', 
  fontSize: '16px',
  backgroundColor: '#003A54', 
  '&&:hover': {
    backgroundColor: '#002A3D', 
  },
  '&&:focus': {
    outline: 'none', 
    borderColor: '#001B27',
  },
}));

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userPoolId = 'ap-northeast-2_DUBc9Z9vB';
  const clientId = '32o2uldsj0sd01riffclu7l12v';
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
        console.log('access token: ' + result.getAccessToken().getJwtToken());
        const decodedToken = jwt_decode(result.getAccessToken().getJwtToken());
        const isHQUser = decodedToken['cognito:groups'].includes('headquarters')
        console.log(decodedToken['cognito:groups']);
        console.log(isHQUser);
        navigate('/order',  { state: { isHQUser } });
       
      },
      onFailure: (err) => {
        console.error(err);
        // TODO: handle failed sign in, e.g. show error message to user
      },
    });
  };

  return (
    <StyledDiv>
      <LogoImage src={logo} alt="Logo" /> {/* Using the imported logo image */}
      <FieldWrapper>
        <InputLabel>ID</InputLabel>
        <InputField 
          type="text" 
          placeholder="" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <InputLabel>비밀번호</InputLabel>
        <InputField 
          type="password" 
          placeholder="" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </FieldWrapper>
      <StyledButton variant="contained" color="primary" onClick={handleLogin}>
        로그인
      </StyledButton>
    </StyledDiv>
  );
};

export default LoginPage;
