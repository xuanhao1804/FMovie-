import React, { useState, useEffect } from "react";
import "./OTPInput.scss";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, setCanResetPassword } from "../../reducers/UserReducer";
import { message } from "antd";
export default function OTPInput() {
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [disable, setDisable] = useState(true);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
//   function resendOTP() {
//     if (disable) return;
//     axios
//       .post("http://localhost:5000/send_recovery_email", {
//         OTP: otp,
//         recipient_email: email,
//       })
//       .then(() => setDisable(true))
//       .then(() => alert("A new OTP has succesfully been sent to your email."))
//       .then(() => setTimer(60))
//       .catch(console.log);
//   }

  function verfiyOTP() {
    try {
      const otp = OTPinput.join("");
      dispatch(verifyOTP({ email: user?.recoverEmail, otp })).then((res) => {
        if (res.payload.success) {
          dispatch(setCanResetPassword(true));
          window.location.href = "/auth/reset-password";
        } else {
          alert("Invalid OTP");
        }
      });
    }
    catch (error) {
      message.error("Failed to verify OTP, please try again");
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable]);

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="content-wrapper">
          <div className="header">
            <div className="title">
              <p>Xác Nhận Email</p>
            </div>
            <div className="subtitle">
              <p>Chúng Tôi Đã Gửi Code Đến Email {user?.recoverEmail}</p>
            </div>
          </div>

          <div className="otp-form">
            <form>
              <div className="form-content">
                <div className="input-group">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="input-field">
                      <input
                        maxLength="1"
                        type="text"
                        onChange={(e) => {
                          const newOTPinput = [...OTPinput];
                          newOTPinput[index] = e.target.value;
                          setOTPinput(newOTPinput);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="button-group">
                  <div>
                    <a onClick={() => verfiyOTP()} className="verify-button">
                      Xác Nhận Tài Khoản
                    </a>
                  </div>

                  <div className="resend-section">
                    <div>Không Nhận Được Mã Code?</div>
                    <a
                      className={`resend-button ${disable ? 'disabled' : 'enabled'}`}
                    //   onClick={() => resendOTP()}
                    >
                      {disable ? `Gửi lại trong ${timerCount}s` : "Gửi Lại OTP"}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}