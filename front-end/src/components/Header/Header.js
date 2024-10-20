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
    const [cities, setCities] = useState([]);  // Dùng để lưu danh sách các thành phố
    const [cinemas, setCinemas] = useState([]); // Dùng để lưu danh sách các rạp chiếu phim theo city đang hover
    const [hoveredCity, setHoveredCity] = useState(null); // Dùng để lưu city đang hover

    // Fetch danh sách các thành phố khi component được mount
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/";
    };
    // Fetch danh sách các rạp chiếu phim khi component được mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:9999/city/get-all');  // Gọi API để lấy danh sách các thành phố
                if (response.data.status === 200) {
                    const cityData = response.data.data.map((city, index) => ({
                        key: city._id, // Đảm bảo key là cityId
                        label: (
                            <div
                                className="hover-city"
                                onMouseEnter={() => handleCityHover(city._id)} // Gọi hàm khi hover vào cityId
                                onMouseLeave={handleCityLeave} // Xóa danh sách rạp khi không hover nữa
                            >
                                {city.name}
                            </div>
                        )
                    }));
                    setCities(cityData);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };

        fetchCities();  // Gọi hàm lấy danh sách thành phố
    }, []);

    // Hàm gọi API để lấy danh sách rạp chiếu phim theo cityId
    const handleCityHover = async (cityId) => {
        if (!cityId) return; // Kiểm tra nếu cityId không tồn tại
        setHoveredCity(cityId); // Đặt city đang hover
        console.log('cityId', cityId);
        try {
            const response = await axios.get(`http://localhost:9999/cinema/get-by-city/${cityId}`);
            if (response.data.status === 200) {
                const cinemaData = response.data.data.map((cinema, index) => ({
                    key: index + 1,
                    label: (
                        <Link to={`/cinemas/${cinema.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            {cinema.name}            
                        </Link>
                    )
                }));
                // console.log('cinemaData', response.data.data.map((cinema, index)=>cinema.name));      
                setCinemas(cinemaData); // Lưu danh sách rạp vào state
            }
        } catch (error) {
            console.error("Failed to fetch cinemas:", error);
        }
    };

    // Hàm xóa danh sách rạp khi không hover vào city nữa
    const handleCityLeave = () => {
        // setHoveredCity(null); // Xóa city đang hover
        // setCinemas([]); // Xóa danh sách rạp
    };

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
                    <Dropdown className="dropdown-cities" menu={{ items: cities }} trigger={['hover']}>
                        <Link to={"/cinemas"}>
                            Rạp chiếu phim <i className="fa-solid fa-chevron-down dropdown-cities-items"></i>
                        </Link>
                    </Dropdown>
                </div>
                {/* Danh sách các rạp chiếu phim hiển thị khi hover vào city */}
                {hoveredCity && (
                    <div className="cinema-dropdown">
                        {cinemas.length > 0 ? (
                            cinemas.map((cinema) => (
                                <div key={cinema.key} className="cinema-item">
                                    {cinema.label}
                                </div>
                            ))
                        ) : (
                            <div>Không có rạp nào</div>
                        )}
                    </div>
                )}
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
                FMOVIE. Website đặt lịch xem phim trực tuyến số một Việt Nam (Chắc thế)
            </div>
        </>
    );
};

export default Header;
