import React, { useState } from "react";
import { message } from 'antd';
import './ResetPassword.scss';
import { useSelector, useDispatch } from "react-redux";
import { setRecoverEmail, setCanResetPassword, resetPassword } from "../../reducers/UserReducer";
export default function Reset() {
    const user = useSelector((state) => state.user);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    function changePassword() {
        if (password !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }
        if (!user?.recoverEmail) {
            message.error("Invalid email");
            return;
        }
        if (!user?.canResetPassword) {
            message.error("Invalid OTP");
            return;
        }
        dispatch(resetPassword({ email: user.recoverEmail, password, confirmPassword}));
        dispatch(setRecoverEmail(""));
        dispatch(setCanResetPassword(false));
        window.location.href = "/";
    }

    return (
        <div className="reset-container">
            <section className="reset-section">
                <div className="reset-content">
                    <div className="reset-card">
                        <h2 className="reset-title">Change Password</h2>
                        <form className="reset-form">
                            <div className="reset-input-group">
                                <label htmlFor="password" className="reset-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="reset-input"
                                    required
                                />
                            </div>
                            <div className="reset-input-group">
                                <label htmlFor="confirm-password" className="reset-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="reset-input"
                                    required
                                />
                            </div>
                            <div className="reset-checkbox-group">
                                <div className="reset-checkbox-container">
                                    <input
                                        id="newsletter"
                                        aria-describedby="newsletter"
                                        type="checkbox"
                                        className="reset-checkbox"
                                        required
                                    />
                                </div>
                                <div className="reset-checkbox-label">
                                    <label htmlFor="newsletter" className="reset-checkbox-text">
                                        I accept the{" "}
                                        <a
                                            className="reset-link"
                                            href="#"
                                        >
                                            Terms and Conditions
                                        </a>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={changePassword}
                                className="reset-button"
                            >
                                Reset password
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
