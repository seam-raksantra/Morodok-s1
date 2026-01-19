import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth/login.css';

const LOGIN_IMAGE = '/src/assets/banner/angkorWat.jpg';
const logoImage = '/src/assets/logo/morodok-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // 1. Save the auth token
      localStorage.setItem('token', data.token);
      localStorage.setItem('loginTimestamp', Date.now().toString());

      // 2. PERSISTENCE CHECK: 
      // Look for permanent profile data saved in this browser for this specific email
      const permanentKey = `profile_data_${data.user.email}`;
      const savedProfile = localStorage.getItem(permanentKey);

      if (savedProfile) {
        // Restore the fully updated profile (with DOB, Phone, etc.)
        localStorage.setItem('user', savedProfile);
      } else {
        // First time login on this browser, use default data from server
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // 3. Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-full-container">
        <div className="login-content-area">

          <div
            className="login-brand-header"
            onClick={() => (navigate('/'))}
            style={{ cursor: 'pointer' }}
          >
            <img src={logoImage} alt="Morodok Eco Logo" className="logo-image" />
            Morodok Eco
          </div>

          <div className="login-title-box">
            <h1>Welcome our beloved tourist</h1>
            <p>Sign in to continue your eco-adventure</p>
          </div>

          {error && <p className="form-error">{error}</p>}

          <form className="login-form-main" onSubmit={handleSubmit}>

            <div className="input-block">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-block">
              <label htmlFor="password">Password</label>
              <div className="pass-field" style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <div 
                  className="toggle-view" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer' 
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="form-utilities">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot" className="forgot-text">Forgot password?</Link>
            </div>

            <button type="submit" className="login-action-btn">
              Sign In
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

          <div className="hr-divider">
            <span className="line" />
            <span className="text">or continue with</span>
            <span className="line" />
          </div>

          <div className="social-row">
            <button className="pill-btn">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
              Google
            </button>

            <button className="pill-btn">
              <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" />
              Facebook
            </button>
          </div>
        </div>

        <div className="login-visual-side">
          <img src={LOGIN_IMAGE} alt="Angkor Wat" />
        </div>
      </div>
    </div>
  );
};

export default Login;