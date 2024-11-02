import { useSelector } from "react-redux"
import "./PaymentSelection.scss"
import { QRCode, Space } from "antd"
import { NumericFormat } from "react-number-format"
import logo from "../../../assets/icon/logo.png"
import { useEffect, useState } from "react"

const PaymentSelection = ({ handleCreatePayment, paymentInformation, handleSessionTimeout }) => {

    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (paymentInformation !== null) {
            setTimeLeft(600)
        }
    }, [paymentInformation]);

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSessionTimeout()
        }
    }, [timeLeft]);


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="payment-selection selection-section" >
            <div className="d-flex justify-content-between align-items-center mb-3 fs-5">
                <span className="fs-5 fw-semibold">
                    Thanh toán
                </span>
                <div className={timeLeft < 60 ? "text-red" : ""}>
                    <span>{timeLeft !== null && formatTime(timeLeft)}</span>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-5">
                {
                    paymentInformation ?
                        <>
                            <div className="d-flex flex-column gap-3">
                                <QRCode value={paymentInformation.checkoutUrl || '-'} size={240} icon={logo} />
                            </div>
                            <div className="fs-6">
                                <div className="d-flex justify-content-between">
                                    <span>Tên: </span>
                                    <span className="fw-semibold">{paymentInformation.accountHolder}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Tài khoản: </span>
                                    <span className="fw-semibold">{paymentInformation.bankAccount}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Tên ngân hàng: </span>
                                    <span className="fw-semibold">{paymentInformation.bankName}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Số tiền: </span>
                                    <NumericFormat className="fw-semibold" value={paymentInformation.amount} decimalSeparator="," thousandSeparator="." displayType="text" suffix=" đ" />
                                </div>
                            </div></>
                        :
                        <>
                            <button onClick={() => handleCreatePayment()} className="btn btn-outline-primary">Bắt đầu thanh toán</button>
                            <div>
                                Hệ thống sẽ giữ chỗ cho quý khách trong vòng <span className="fw-semibold">10 phút</span>
                            </div>
                        </>
                }
            </div>
        </div >
    )
}

export default PaymentSelection