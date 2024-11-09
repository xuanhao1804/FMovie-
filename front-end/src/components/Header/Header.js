import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./Header.scss";
import logo from "../../assets/icon/logo.png";
import ticket from "../../assets/icon/btn-ticket.webp";
import { Dropdown, Button } from 'antd';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/UserReducer";
import TakeTicket from "../TakeTicket/TakeTicket";

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation(); // Đường dẫn hiện tại
    const [cinemas, setCinemas] = useState([]);
    const [cinemaDropDown, setCinemaDropDown] = useState(null);
    const [selectedCinemaName, setSelectedCinemaName] = useState("Rạp chiếu phim");
    const user = useSelector((state) => state.user);
    const { city } = useSelector((state) => state);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/";
    };

    // Fetch danh sách các rạp chiếu phim khi component được mount
    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await axios.get('http://localhost:9999/cinema/get-all');
                if (response.data.status === 200) {
                    setCinemas(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch cinemas:", error);
            }
        };

        fetchCinemas();
    }, []);

    const buildCinemaDropdown = () => {
        const cinemaByCity = city.list.map(item => (
            {
                key: item._id,
                label: (<span>{item.name}</span>),
                children: cinemas.filter(cinema => cinema.city === item._id).map(cinema => (
                    {
                        key: cinema._id,
                        label: (
                            <Link 
                                className="text-decoration-none" 
                                to={`/cinemas-movies/${cinema._id}`}
                                onClick={() => setSelectedCinemaName(cinema.name)} // Cập nhật tên rạp đã chọn
                            >
                                {cinema.name}
                            </Link>
                        )
                    }
                ))
            }
        ));
        setCinemaDropDown(cinemaByCity);
    };

    useEffect(() => {
        buildCinemaDropdown();
    }, [cinemas, city]);

    // Reset selectedCinemaName khi người dùng trở lại trang chủ
    useEffect(() => {
        if (location.pathname === "/home" || location.pathname === "/") {
            setSelectedCinemaName("Rạp chiếu phim");
        }
    }, [location.pathname]);

    // Danh sách các loại phim
    const filmsType = [
        { key: 1, label: (<Link className="text-decoration-none" to={"/films/playing"}>Phim đang chiếu</Link>) },
        { key: 2, label: (<Link className="text-decoration-none" to={"/films/upcoming"}>Phim sắp chiếu</Link>) }
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
                        <Link className="text-decoration-none text-dark" to={"/films"}>
                            Phim <i className="fa-solid fa-chevron-down"></i>
                        </Link>
                    </Dropdown>
                    {/* Dropdown các rạp chiếu phim */}
                    <Dropdown className="dropdown-cinemas" menu={{ items: cinemaDropDown }} trigger={['hover']}>
                        <span>
                            {selectedCinemaName} <i className="fa-solid fa-chevron-down dropdown-cinemas-items"></i>
                        </span>
                    </Dropdown>
                </div>
                {
                    user?.user?.account?.roles?.includes("seller") &&
                    <TakeTicket />
                }
                {
                    user.user.token ? (
                        <div className="logout-container">
                            <div onClick={() => navigate("/user-profile")} className="user">
                                <UserOutlined className="user-icon" />
                                <span className="user-name">Xin chào {user.user.account.fullname}!</span>
                            </div>
                            <Button onClick={handleLogout} type="primary" className="logout-button">Đăng xuất</Button>
                        </div>
                    ) : (
                        <div className="header-item header-item-sm">
                            <Button type="primary" value="large" className="login-button font-size-16">
                                <Link to={"/auth/sign-in"}>Đăng nhập</Link>
                            </Button>
                            <Button type="success" value="large" className="register-button bg-green text-white font-size-16">
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
