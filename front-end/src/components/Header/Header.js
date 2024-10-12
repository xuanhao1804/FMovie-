import { Link } from "react-router-dom"
import "./Header.scss"
import logo from "../../assets/icon/logo.png"
import ticket from "../../assets/icon/btn-ticket.webp"
import { Dropdown, Button } from 'antd';


const Header = () => {

    const filmsType = [
        { key: 1, label: (<Link to={"/films/playing"}>Phim đang chiếu</Link>) },
        { key: 2, label: (<Link to={"/films/upcoming"}>Phim sắp chiếu</Link>) }
    ]

    const cinemas = [
        { key: 1, label: (<Link to={"/cinemas/ha-dong"}>FMOVIE - Hà Đông</Link>) },
        { key: 2, label: (<Link to={"/cinemas/nha-trang-center"}>FMOVIE - Nha Trang Center</Link>) },
    ]

    return (
        <>
            <div className="header content-width-padding">
                <div className="header-item text-dark">
                    <Link to={"/home"}>
                        <img className="width-112" src={logo} alt="fmovie-logo" />
                    </Link>
                    <Link to={"/booking"}>
                        <img className="width-112" src={ticket} alt="fmovie-logo" />
                    </Link>
                    <Dropdown menu={{ items: filmsType }}>
                        <Link to={"/films"}>
                            Phim <i class="fa-solid fa-chevron-down"></i>
                        </Link>
                    </Dropdown>
                    <Dropdown menu={{ items: cinemas }}>
                        <Link to={"/cinemas"}>
                            Rạp chiếu phim <i class="fa-solid fa-chevron-down"></i>
                        </Link>
                    </Dropdown>

            </div>
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
    )
}

export default Header