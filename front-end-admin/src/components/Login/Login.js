import React, { useEffect, useState } from "react";
import Image from "../../assets/image.png";
// import Logo from "../../assets/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { message } from "antd";
import './Login.scss';
import { useDispatch } from "react-redux";
import { loginUser, saveUserData } from "../../reducers/UserReducer";

const Login = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const dispatch = useDispatch();
  const handleLogin = async () => {
    const res = await dispatch(loginUser({email, password}))
    console.log(res.payload.account.roles)
    if (!res.payload.account.roles.includes("admin")) {
      message.error("You are not an admin");
      return;
    }
    dispatch(saveUserData(res.payload));
    window.location.href = "/";
  }
  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={""} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <form>
              <input type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
                
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox"/>
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
              </div>
              <div className="login-center-buttons">
                <button type="button" onClick={handleLogin}>Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;