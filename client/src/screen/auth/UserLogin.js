import { TextField, Button, Box, Alert } from '@mui/material';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../redux/api/auth/userAuthApi';
import { storeTokenByValue } from '../../services/LocalStorageService';

const UserLogin = () => {
  const [loginUser, { isLoading, isError, isSuccess }] = useLoginUserMutation();
  //? local  api error state
  const [error, setError] = useState({
    status: false,
    msg: '',
    type: '',
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    if (actualData.email && actualData.password) {
      console.log(actualData);
      //  ==============================================================================
      const res = await loginUser(actualData);
      console.log(res);
      if (res.data) {
        if (res.data.status === 'success') {
          //! TODO: TOKEN STORE garnu xa
          storeTokenByValue(res.data.token);

          navigate('/dashboard');
        }
      }
      if (res.error) {
        setError({
          status: true,
          msg: res.error.data.message,
          type: 'error',
        });
      }
      //  ==============================================================================
    } else {
      setError({ status: true, msg: 'All Fields are Required', type: 'error' });
    }
  };
  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        id="login-form"
        onSubmit={handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="Email Address"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
        />
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, px: 5 }}
          >
            Login
          </Button>
        </Box>
        <NavLink to="/sendpasswordresetemail">Forgot Password ?</NavLink>
        {error.status ? (
          <Alert severity={error.type} sx={{ mt: 3 }}>
            {error.msg}
          </Alert>
        ) : (
          ''
        )}
      </Box>
    </>
  );
};

export default UserLogin;

