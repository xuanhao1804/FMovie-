import React, { useState } from 'react'
import Image from '../../assets/image.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import { message } from 'antd'
import './Login.scss'
import { useDispatch } from 'react-redux'
import { loginUser, saveUserData } from '../../reducers/UserReducer'
import newLogo from '/src/assets/images/logo.png'
import cinemaImage from '/src/assets/images/cinema.png'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      const res = await dispatch(loginUser({ email, password }))

      if (!res.payload || !res.payload.account) {
        message.error(res.error?.message || 'Invalid response from server. Please try again.')
        return
      }

      if (!res.payload.account.roles || !Array.isArray(res.payload.account.roles)) {
        message.error('Invalid user data. Please contact support.')
        return
      }

      if (!res.payload.account.roles.includes('admin')) {
        message.error('You are not an admin')
        return
      }

      dispatch(saveUserData(res.payload))
      window.location.href = '/'
    } catch (error) {
      console.error('Login failed:', error)
      message.error('An error occurred during login. Please check your credentials and try again.')
    }
  }

  return (
    <div className="login-main">
      <div className="login-left">
        <img className="cinema-image" src={cinemaImage} alt="Cinema" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img
              className="sidebar-brand-full"
              src={newLogo}
              alt="Logo"
              style={{
                minWidth: '200px',
                height: 'auto',
                borderRadius: '50%',
              }} /* Thêm borderRadius */
            />
          </div>
          <div className="login-center">
            <h2>Adminstrator Fmovie</h2>
            <form>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-buttons">
                <button type="button" onClick={handleLogin}>
                  Đăng nhập
                </button>
              </div>

              <div className="forgot-password-link">
                <a
                  href="/forgot-password"
                  style={{ fontSize: '12px', textDecoration: 'none', color: '#007bff' }}
                >
                  Quên mật khẩu?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
