import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function GoogleLoginBtn() {
  const navigate = useNavigate();
  const {checkAuth} = useAuthStore();
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/users/google-login`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );
      console.log('Google login success:', res.data);
      checkAuth();
      navigate('/');
      // redirect to dashboard or homepage
    } catch (err) {
      console.error('Google login failed:', err.response?.data || err.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log('Google login error')}
    />
  );
}

export default GoogleLoginBtn;
