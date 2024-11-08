import { useEffect, useRef, useState } from "react"
import ticketIcon from "../../assets/icon/ticket.png"
import { BookingService } from "../../services/BookingService"
import { Button, message, Modal } from 'antd';
import "@progress/kendo-theme-material/dist/all.css"
import { savePDF } from "@progress/kendo-react-pdf"
import "./TakeTicket.scss"
import logo from "../../assets/icon/logo.png"

const TakeTicket = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const ticketExportRef = useRef(null)
    const [userTicket, setUserTicket] = useState(null)
    const [userCode, setUserCode] = useState("")
    const [isOpenExportModal, setIsOpenExportModal] = useState(false)

    const handleTakeTicket = async () => {
        if (userCode.trim()) {
            const response = await BookingService.getUserTicket({
                orderCode: userCode
            })
            if (response.status === 201) {
                messageApi.success(response.message);
                setUserTicket(response.data)
                setUserCode("")
                setIsOpenExportModal(true)
                setTimeout(() => {
                    handleExportTicket()
                }, 2000);

            } else {
                messageApi.error(response.message);
            }
        } else {
            messageApi.error("Vui lòng nhập mã");
        }
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleExportTicket = () => {
        savePDF(ticketExportRef.current, { pageSize: "A4" })
        setTimeout(() => {
            setUserTicket(null);
        }, 2000);
    }

    const handleCancel = () => {
        setIsOpenExportModal(false)
    }

    return (
        <>
            <div className="dropdown">
                <span className="d-flex gap-2 align-items-center dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <span>Giao vé</span>
                    <img className="square-32" src={ticketIcon} alt="ticket-icons" />
                </span>
                <ul className="dropdown-menu" style={{ width: "20rem" }}>
                    <li className="px-2 d-flex gap-2 text-nowrap">
                        <input value={userCode} onChange={(event) => setUserCode(event.target.value)} placeholder="Nhập mã người dùng cấp" className="form-control" />
                        <button onClick={() => handleTakeTicket()} className="btn btn-success">Kiểm tra</button>
                    </li>
                </ul>
            </div>
            {contextHolder}
            <Modal
                title="Thông tin vé đã đặt"
                open={isOpenExportModal}
                onOk={() => handleExportTicket()}
                onCancel={handleCancel}
                width={1200}
                footer={
                    [
                        <Button key="back" onClick={handleCancel}>
                            Đóng
                        </Button>
                    ]
                }>

                <div ref={ticketExportRef} className="take-ticket-ref">
                    {userTicket && userTicket.seats?.length > 0 ?
                        <>
                            {
                                userTicket.seats.map((item, index) => {
                                    return (
                                        <div key={item._id} className="take-ticket-pdf mb-4">
                                            <img
                                                className="take-ticket-pdf-logo"
                                                src={logo}
                                                alt="logo"
                                            />
                                            <div className="take-ticket-pdf-content">
                                                <div className="take-ticket-pdf-film-title">
                                                    <span>Phim: </span><span>{userTicket.showtime?.movie?.name}</span>
                                                </div>
                                                <div className="take-ticket-pdf-datetime">
                                                    <span>Thời gian: </span>
                                                    <span className="fw-bold">{userTicket.showtime?.startAt?.time}</span>
                                                    <span> - </span>
                                                    <span>Ngày: </span><span className="fw-bold">{formatDate(userTicket.showtime?.startAt?.date)}</span>
                                                </div>
                                                <div className="take-ticket-pdf-seat">
                                                    <span>{userTicket.room?.name}</span>
                                                    <span> - </span>
                                                    <span>Vị trí ghế: </span><span className="fw-bold">{item.area + item.position}{item.isVip && " (VIP)"}</span>
                                                </div>
                                            </div>
                                            <div className="take-ticket-pdf-divider">

                                            </div>
                                            <div className="fs-3 text-white text-center pe-4">
                                                <div>
                                                    VÉ XEM
                                                </div>
                                                <div>
                                                    PHIM
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                userTicket.popcorns?.length > 0 &&
                                <div className="take-ticket-pdf mb-4">
                                    <img
                                        className="take-ticket-pdf-logo"
                                        src={logo}
                                        alt="logo"
                                    />
                                    <div className="take-ticket-pdf-content">
                                        {
                                            userTicket.popcorns?.map((item, index) => {
                                                return (
                                                    <div className="take-ticket-pdf-popcorn">
                                                        <span>{item.quantity}x </span><span>{item._id.name}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="take-ticket-pdf-divider">
                                    </div>
                                    <div className="fs-5 text-white text-center pe-4">
                                        <div>
                                            VÉ NHẬN
                                        </div>
                                        <div>
                                            ĐỒ ĂN UỐNG
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                        :
                        <div className="text-success fs-5 text-center mt-5">
                            <i style={{ fontSize: "4rem", color: "#00cf1c" }} className=" fa-solid fa-circle-check"></i>
                            <div> Lấy vé thành công !</div>
                        </div>
                    }
                </div>
            </Modal >
        </>
    )
}

export default TakeTicket