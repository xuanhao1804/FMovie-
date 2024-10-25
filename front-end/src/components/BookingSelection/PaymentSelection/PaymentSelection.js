import { useSelector } from "react-redux"
import "./PaymentSelection.scss"
import { QRCode, Space } from "antd"
import { NumericFormat } from "react-number-format"
import logo from "../../../assets/icon/logo.png"

const PaymentSelection = ({ handleCreatePayment, paymentInformation }) => {

    return (
        <div className="payment-selection selection-section" >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-semibold">
                    Thanh toán
                </span>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-5">
                {
                    paymentInformation ?
                        <>
                            <div className="d-flex flex-column gap-3">
                                <QRCode value={paymentInformation.checkoutUrl || '-'} size={240} icon={logo} />
                                <a href={paymentInformation.checkoutlink} target="_blank" rel="noreferrer">{paymentInformation.checkoutlink}</a>
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