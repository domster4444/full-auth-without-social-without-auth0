import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginReg from './screen/auth/LoginReg';
import ResetPassword from './screen/auth/ResetPassword';
import SendPasswordResetEmail from './screen/auth/SendPasswordResetEmail';
import Contact from './screen/Contact';
import Dashboard from './screen/Dashboard';
import Home from './screen/Home';
import Layout from './screen/Layout';
import { getTokenByValue } from './services/LocalStorageService';

function App() {
  const token = getTokenByValue();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<LoginReg />} />
            <Route
              path="sendpasswordresetemail"
              element={<SendPasswordResetEmail />}
            />
            <Route
              path="/api/users/reset/:id/:token"
              element={<ResetPassword />}
            />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

