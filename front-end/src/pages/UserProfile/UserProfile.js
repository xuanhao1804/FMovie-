import { useEffect, useState } from "react"
import "./UserProfile.scss"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import { BookingService } from "../../services/BookingService";
import { getVietnameseDate } from "../../utils/dateUtils";
import { NumericFormat } from "react-number-format";
import { bookingStatus } from "../../utils/bookingUtils";

const UserProfile = () => {

    const { user } = useSelector((state) => state.user);
    const [userHistory, setUserHistory] = useState([])
    const navigate = useNavigate()

    const fetchUserHistory = async () => {
        const response = await BookingService.getUserBookedHistory({
            userId: user?.account?._id
        })
        if (response.status === 200) {
            setUserHistory(response.data)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserHistory()
        } else {
            navigate('/authentication')
        }
    }, [])

    return (
        <div className="user-profile content-width-padding content-height-padding d-flex gap-4">
            {console.log(userHistory)}
            <div className="user-profile-info w-25 p-3">
                <div className="fs-5 pb-2 text-center border-bottom mb-3">
                    Thông tin người dùng
                </div>
                <div className="mb-3">
                    <label for="username" className="form-label">Họ và tên</label>
                    <input disabled value={user?.account?.fullname} type="text" className="form-control" id="username" />
                </div>
                <div className="mb-3">
                    <label for="Email" className="form-label">Email</label>
                    <input disabled value={user?.account?.email} type="email" className="form-control" id="Email" />
                </div>
                <div className="mb-3">
                    <label for="phone" className="form-label">Số điện thoại</label>
                    <input disabled value={user?.account?.phone} type="text" className="form-control" id="phone" />
                </div>
                <div className="mb-3">
                    <label for="dob" className="form-label">Ngày sinh</label>
                    <input disabled value={user?.account?.dob.split('T')[0]} type="date" className="form-control" id="dob" />
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Mật khẩu</label>
                    <input disabled value={"HARDCODE Rồi"} type="password" className="form-control" id="password" />
                </div>
            </div>
            <div className="user-profile-history w-75 p-3">
                <div className="fs-5 pb-2 text-center border-bottom mb-3 d-flex flex-column gap-1">
                    <span>Lịch sử giao dịch</span>
                    <span className="fs-6 text-warning">Chỉ hiển thị 10 giao dịch gần nhất</span>
                </div>
                <table className="user-profile-history-table table w-100">
                    <thead>
                        <tr className="text-nowrap">
                            <th scope="col">#</th>
                            <th scope="col">Phim</th>
                            <th scope="col">Phòng</th>
                            <th scope="col">Thời gian</th>
                            <th scope="col">Chỗ ngồi</th>

                            <th scope="col">Popcorns</th>
                            <th scope="col">Ngày đặt</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Mã xác nhận</th>
                            <th scope="col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userHistory && userHistory.length > 0 ?
                                userHistory.map((item, index) => {
                                    return (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td >
                                                <Link className="user-profile-history-table-item-name" target="_black" to={`/film/detail/${item.showtime.movie._id}`}>{item.showtime.movie.name}</Link>
                                            </td>
                                            <td>{item.room.name}</td>
                                            <td>
                                                <div>Giờ: <span className="text-primary">{item.showtime.startAt.time}</span></div>
                                                <div>{getVietnameseDate(item.showtime.startAt.date, true)}</div>
                                            </td>
                                            <td>{item.seats.map((item, index) => {
                                                return (
                                                    <div>{item.area + item.position} {item.isVip ? " - (VIP)" : ""}</div>
                                                )
                                            })}</td>
                                            <td>{item.popcorns.length > 0 ?
                                                item.popcorns.map((item, index) => {
                                                    return (
                                                        <div>{item.quantity + "x " + item.popcorn.name}</div>
                                                    )
                                                })
                                                :
                                                <span>Không</span>
                                            }</td>
                                            <td>{getVietnameseDate(item.createdAt, true)}</td>
                                            <td><NumericFormat className="text-success" value={item.total_price} decimalSeparator="," thousandSeparator="." displayType="text" suffix=" đ" /></td>
                                            <td>{item.orderCode}</td>
                                            <td><span style={{ color: bookingStatus[item.status].textColor }}>{bookingStatus[item.status].text}</span></td>
                                        </tr>
                                    )
                                })
                                :
                                <div></div>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserProfile