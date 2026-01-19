import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth/signup.css';

const SIGNUP_IMAGE = '/src/assets/banner/cambodiaMountain.jpg';
const logoImage = '/src/assets/logo/morodok-logo.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [error, setError] = useState('');
  
  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.agree) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Unexpected response from server: ${text.substring(0, 200)}`);
      }

      if (!res.ok) throw new Error(data.message || 'Failed to register');

      // --- SESSION MANAGEMENT ---
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Save timestamp so the 2-hour timeout works immediately after signup
      localStorage.setItem('loginTimestamp', Date.now().toString());

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-image-side">
          <img src={SIGNUP_IMAGE} alt="Sign Up Image" />
        </div>

        <div className="signup-form-side">
          <div
            className="signup-brand"
            onClick={() => (navigate('/'))}
            style={{ cursor: 'pointer' }}
          >
            <img src={logoImage} alt="Morodok Eco Logo" className="logo-image" />
            Morodok Eco
          </div>

          <div className="signup-header">
            <h1>Create Account</h1>
            <p>Join our community of eco-conscious travelers</p>
          </div>

          {error && <p className="form-error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="pass-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <div 
                  className="pass-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <div className="pass-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <div 
                  className="pass-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="terms-checkbox">
              <label className="check-container">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                />
                <span className="check-box-custom"></span>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn-create-account">
              Create Account
            </button>
          </form>

          <div className="signup-footer">
            <p className="login-redirect">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <div className="divider-row">
              <span className="divider-text">or continue with</span>
            </div>

            <div className="social-options">
              <button className="btn-social">
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
                Google
              </button>
              <button className="btn-social">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;