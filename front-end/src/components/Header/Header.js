import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/icon/logo.png";
import ticket from "../../assets/icon/btn-ticket.webp";
import { Dropdown, Button } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/UserReducer";

const Header = () => {
    const [cinemas, setCinemas] = useState([]); // Dùng để lưu danh sách các rạp chiếu phim
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/";
    };

    // Fetch danh sách các rạp chiếu phim khi component được mount
    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await axios.get('http://localhost:9999/cinema/get-all');  // Gọi API để lấy danh sách các rạp chiếu phim
                if (response.data.status === 200) {
                    const cinemaData = response.data.data.map((cinema) => ({
                        key: cinema._id, // Dùng _id của cinema làm key
                        label: (
                            <Link to={`/cinemas-movies/${cinema._id}`}>
                                {cinema.name}
                            </Link>
                        )
                    }));
                    setCinemas(cinemaData);
                }
            } catch (error) {
                console.error("Failed to fetch cinemas:", error);
            }
        };

        fetchCinemas();  // Gọi hàm lấy danh sách rạp chiếu phim
    }, []);

    // Danh sách các loại phim
    const filmsType = [
        { key: 1, label: (<Link to={"/films/playing"}>Phim đang chiếu</Link>) },
        { key: 2, label: (<Link to={"/films/upcoming"}>Phim sắp chiếu</Link>) }
    ];

    return (
        <>
            <div className="header content-width-padding">
                <div className="header-item text-dark">
                    {/* Logo */}
                    <Link to={"/home"}>
                        <img className="width-112" src={logo} alt="fmovie-logo" />
                    </Link>
                    {/* Nút đặt vé */}
                    <Link to={"/booking"}>
                        <img className="width-112" src={ticket} alt="fmovie-logo" />
                    </Link>
                    {/* Dropdown các loại phim */}
                    <Dropdown menu={{ items: filmsType }}>
                        <Link to={"/films"}>
                            Phim <i className="fa-solid fa-chevron-down"></i>
                        </Link>
                    </Dropdown>
                    {/* Dropdown các rạp chiếu phim */}
                    <Dropdown className="dropdown-cinemas" menu={{ items: cinemas }} trigger={['hover']}>
                        <Link to={"/cinemas"}>
                            Rạp chiếu phim <i className="fa-solid fa-chevron-down dropdown-cinemas-items"></i>
                        </Link>
                    </Dropdown>
                </div>
                {/* Đăng nhập và đăng ký */}
                {
                    user.user.token ? (
                        <div className="logout-container">
                            <div className="user">
                                <UserOutlined className="user-icon" />
                                <span className="user-name">Xin chào {user.user.account.fullname}!</span>
                            </div>
                            <Button onClick={handleLogout} type="primary">Đăng xuất</Button>
                        </div>
                    ) : (
                        <div className="header-item header-item-sm">
                            <Button type="primary" value="large" className="font-size-16">
                                <Link to={"/auth/sign-in"}>Đăng nhập</Link>
                            </Button>
                            <Button type="success" value="large" className="bg-green text-white font-size-16">
                                <Link to={"/auth/sign-in"}>Đăng ký</Link>
                            </Button>
                        </div>
                    )
                }
            </div>
            <div className="header-divider content-width-padding">
                FMOVIE. Website đặt lịch xem phim trực tuyến số một Việt Nam 
            </div>
        </>
    );
};

export default Header;
