import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/icon/logo.png";
import ticket from "../../assets/icon/btn-ticket.webp";
import { Dropdown, Button } from 'antd';
import axios from 'axios';

const Header = () => {
    const [cities, setCities] = useState([]);  // Dùng để lưu danh sách các rạp chiếu phim

    // Fetch danh sách các rạp chiếu phim khi component được mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:9999/cinema/get-all');  // Gọi API để lấy danh sách các rạp
                if (response.data.status === 200) {
                    // Mapping lại dữ liệu rạp để tạo menu dropdown
                    const cityData = response.data.data.map((cinema, index) => ({
                        key: index + 1,
                        label: (
                            <Link to={`/cinemas/${cinema.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                {cinema.name}
                            </Link>
                        )
                    }));
                    setCities(cityData);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };

        fetchCities();  // Gọi hàm lấy danh sách rạp
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
                    <Dropdown menu={{ items: cities }}>
                        <Link to={"/cinemas"}>
                            Rạp chiếu phim <i className="fa-solid fa-chevron-down"></i>
                        </Link>
                    </Dropdown>
                </div>
                {/* Đăng nhập và đăng ký */}
                <div className="header-item header-item-sm">
                    <Button type="primary" value="large" className="font-size-16">
                        <Link to={"/auth/sign-in"}>Đăng nhập</Link>
                    </Button>
                    <Button type="success" value="large" className="bg-green text-white font-size-16">
                        <Link to={"/auth/sign-in"}>Đăng ký</Link>
                    </Button>
                </div>
            </div>
            <div className="header-divider content-width-padding">
                FMOVIE. Website đặt lịch xem phim trực tuyến số một Việt Nam (Chắc thế)
            </div>
        </>
    );
};

export default Header;
