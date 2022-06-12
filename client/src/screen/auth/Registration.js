import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeTokenByValue } from '../../services/LocalStorageService';

//! Import RTK Generated Register Hook
import { useRegisterUserMutation } from '../../redux/api/auth/userAuthApi';

const Registration = () => {
  //? alert component state
  const [error, setError] = useState({
    status: false,
    msg: '',
    type: '',
  });

  const navigate = useNavigate();

  //! RTK Generated Register Hook , "registerUser" is name of endpoint in userAuthApi.js
  const [registerUser, { isLoading, isError }] = useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password_confirmation: data.get('password_confirmation'),
      tc: data.get('tc'),
    };
    if (
      actualData.name &&
      actualData.email &&
      actualData.password &&
      actualData.password_confirmation &&
      actualData.tc !== null
    ) {
      if (actualData.password === actualData.password_confirmation) {
        console.log(actualData);
        // =================================================================================
        //! User Register Using RTK Query Method
        const res = await registerUser(actualData);
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
          // =================================================================================
        }
      } else {
        setError({
          status: true,
          msg: "Password and Confirm Password Doesn't Match",
          type: 'error',
        });
      }
    } else {
      setError({ status: true, msg: 'All Fields are Required', type: 'error' });
    }
  };
  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        id="registration-form"
        onSubmit={handleSubmit}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          name="name"
          label="Name"
        />
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="password_confirmation"
          name="password_confirmation"
          label="Confirm Password"
          type="password"
        />
        <FormControlLabel
          control={<Checkbox value={true} color="primary" name="tc" id="tc" />}
          label="I agree to term and condition."
        />
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, px: 5 }}
          >
            Join
          </Button>
        </Box>
        {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ''}
      </Box>
    </>
  );
};

export default Registration;

