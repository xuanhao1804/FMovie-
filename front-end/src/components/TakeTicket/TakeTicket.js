import { useState } from "react"
import ticketIcon from "../../assets/icon/ticket.png"
import { BookingService } from "../../services/BookingService"

import { message } from 'antd';

const TakeTicket = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const [userCode, setUserCode] = useState("")

    const handleTakeTicket = async () => {
        if (userCode.trim()) {
            const response = await BookingService.getUserTicket({
                orderCode: userCode
            })
            if (response.status === 201) {
                messageApi.success(response.message);
                setUserCode("")
            } else {
                messageApi.error(response.message);
            }
        } else {
            messageApi.error("Vui lòng nhập mã");
        }
    }

    return (
        <>
            <div class="dropdown">
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
        </>
    )
}

export default TakeTicket