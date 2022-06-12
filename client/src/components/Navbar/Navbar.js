import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getTokenByValue } from '../../services/LocalStorageService';
const Navbar = () => {
  const token = getTokenByValue();
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Geek-Shop
            </Typography>

            <Button
              component={NavLink}
              to="/"
              style={({ isActive }) => {
                return { backgroundColor: isActive ? '#6d1b7b' : '' };
              }}
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Home
            </Button>

            <Button
              component={NavLink}
              to="/contact"
              style={({ isActive }) => {
                return { backgroundColor: isActive ? '#6d1b7b' : '' };
              }}
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Contact
            </Button>

            {!token && (
              <Button
                component={NavLink}
                to="/login"
                style={({ isActive }) => {
                  return { backgroundColor: isActive ? '#6d1b7b' : '' };
                }}
                sx={{ color: 'white', textTransform: 'none' }}
              >
                Login/Registration
              </Button>
            )}
            {token && (
              <Button
                component={NavLink}
                to="/dashboard"
                style={({ isActive }) => {
                  return { backgroundColor: isActive ? '#6d1b7b' : '' };
                }}
                sx={{ color: 'white', textTransform: 'none' }}
              >
                dashboard
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Navbar;

