import { Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../auth/ChangePassword';
import { removeToken } from '../../services/LocalStorageService';
import { useGetLoggedUserQuery } from '../../redux/api/auth/userAuthApi';
import { getTokenByValue } from '../../services/LocalStorageService';
import { useState, useEffect } from 'react';
const Dashboard = () => {
  const token = getTokenByValue();
  const { isLoading, isError, isSuccess, data } = useGetLoggedUserQuery({
    token,
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.data.user.email,
        name: data.data.user.name,
      });
    }
  }, [data, isSuccess]);

  console.log(data);
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('Logout Clicked');
    removeToken();
    navigate('/login');
  };
  return (
    <>
      <CssBaseline />
      <Grid container>
        <Grid
          item
          sm={4}
          sx={{ backgroundColor: 'gray', p: 5, color: 'white' }}
        >
          <h1>Dashboard</h1>
          <Typography variant="h5">
            Email: {userData ? userData.email : ''}
          </Typography>
          <Typography variant="h6">
            Name: {userData ? userData.name : ''}
          </Typography>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={handleLogout}
            sx={{ mt: 8 }}
          >
            Logout
          </Button>
        </Grid>
        <Grid item sm={8}>
          <ChangePassword />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

