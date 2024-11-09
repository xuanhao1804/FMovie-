import { useEffect, useState } from "react"
import "./UserProfile.scss"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { BookingService } from "../../services/BookingService";
import { getVietnameseDate } from "../../utils/dateUtils";
import { NumericFormat } from "react-number-format";
import { message } from "antd";
import { bookingStatus } from "../../utils/bookingUtils";
import { Button } from "antd";
import { resetInfo } from "../../reducers/UserReducer";

const UserProfile = () => {

    const { user } = useSelector((state) => state.user);
    const [userData, setUserData] = useState(user.account)
    const [userHistory, setUserHistory] = useState([])
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fetchUserHistory = async () => {
        const response = await BookingService.getUserBookedHistory({
            userId: user?.account?._id
        })
        if (response.status === 200) {
            setUserHistory(response.data)
        }
    }

    const handleChangePass = () => {
        navigate('/change-password')
    }

    const validateField = (field, value) => {
        let error = null;
        if (!value) {
            error = 'Trường này là bắt buộc.';
        } else {
            switch (field) {
                case 'fullname':
                    error = value.length < 2 ? 'Tên phải có ít nhất 2 ký tự.' : '';
                    break;
                case 'email':
                    error = !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? 'Email không hợp lệ.' : '';
                    break;
                case 'phone':
                    error = !/^\d{10}$/.test(value) ? 'Số điện thoại phải đủ 10 chữ số.' : '';
                    break;
                default:
                    break;
            }
        }
        return error;
    };

    const handleUpdate = async () => {
        if (errors && Object.keys(errors).length > 0) {
            message.error('Vui lòng kiểm tra lại thông tin.')
            return
        }
        const { _id, email, phone, fullname, dob } = userData
        const data = {
            _id,
            email,
            phone,
            fullname,
            dob
        }
        fetch('http://localhost:9999/account/update-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async (response) => {
            const result = await response.json();
            if (result.success) {
                message.success('Cập nhật thông tin thành công!')
                dispatch(resetInfo(result.data))
            } else {
                message.error('Cập nhật thông tin thất bại!')
            }
        }).catch((error) => {
            console.error('Error:', error);
        }
        );
    }

    const handleDataChange = (e) => {
        const { id, value } = e.target;

        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        const error = validateField(id, value);

        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };

            if (error) {
                // Nếu có lỗi, cập nhật lỗi vào đối tượng errors
                newErrors[id] = error;
            } else {
                // Nếu không có lỗi, xóa lỗi khỏi đối tượng errors
                delete newErrors[id];
            }

            return newErrors;
        });
    };

    useEffect(() => {
        if (user) {
            fetchUserHistory()
        } else {
            navigate('/authentication')
        }
    }, [])

    return (
        <div className="user-profile content-width-padding content-height-padding d-flex flex-column flex-lg-row gap-4">
            <div className="user-profile-info p-3">
                <div className="fs-5 pb-2 text-center border-bottom mb-3">
                    Thông tin người dùng
                </div>
                <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">Họ và tên</label>
                    <input
                        value={userData?.fullname || ''}
                        type="text"
                        onChange={handleDataChange}
                        className="form-control"
                        id="fullname"
                    />
                    {errors.fullname && <span className="text-danger">{errors.fullname}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        value={userData?.email || ''}
                        type="email"
                        disabled
                        className="form-control"
                        id="email"
                    />
                    {errors.email && <span className="text-danger">{errors.email}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                    <input
                        value={userData?.phone || ''}
                        type="text"
                        onChange={handleDataChange}
                        className="form-control"
                        id="phone"
                    />
                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="dob" className="form-label">Ngày sinh</label>
                    <input
                        value={userData?.dob ? userData.dob.split('T')[0] : ''}
                        onChange={handleDataChange}
                        type="date"
                        className="form-control"
                        id="dob"
                    />
                    {errors.dob && <span className="text-danger">{errors.dob}</span>}
                </div>
                <div className="mb-3">
                    <Button onClick={handleUpdate} type="primary" htmlType="submit" className="update-btn">
                        Cập Nhật
                    </Button>
                </div>
            </div>
            <div className="user-profile-history  p-3">
                <div className="fs-5 pb-2 text-center border-bottom mb-3 d-flex flex-column gap-1">
                    <span>Lịch sử giao dịch</span>
                    <span className="fs-6 text-warning">Chỉ hiển thị 10 giao dịch gần nhất</span>
                </div>
                <table className="user-profile-history-table table">
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
                                                <Link className="user-profile-history-table-item-name" target="_black" to={`/film/detail/${item?.showtime?.movie?._id}`}>{item?.showtime?.movie?.name}</Link>
                                            </td>
                                            <td>{item?.room?.name}</td>
                                            <td>
                                                <div>Giờ: <span className="text-primary">{item?.showtime?.startAt?.time}</span></div>
                                                <div>{getVietnameseDate(item.showtime.startAt.date, true)}</div>
                                            </td>
                                            <td>{item.seats.map((item, index) => {
                                                return (
                                                    <div>{item?.area + item?.position} {item?.isVip ? " - (VIP)" : ""}</div>
                                                )
                                            })}</td>
                                            <td>{item?.popcorns?.length > 0 ?
                                                item.popcorns.map((item, index) => {
                                                    return (
                                                        <div>{item?.quantity + "x " + item?._id?.name}</div>
                                                    )
                                                })
                                                :
                                                <span>Không</span>
                                            }</td>
                                            <td>{getVietnameseDate(item?.createdAt, true)}</td>
                                            <td><NumericFormat className="text-success" value={item?.total_price} decimalSeparator="," thousandSeparator="." displayType="text" suffix=" đ" /></td>
                                            <td>{item.orderCode}</td>
                                            <td><span style={{ color: bookingStatus[item.status]?.textColor }}>{bookingStatus[item.status]?.text}</span></td>
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