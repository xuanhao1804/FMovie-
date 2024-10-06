import { Link } from "react-router-dom"

const Header = () => {
    return (
        <div className="header">
            <div>
                <Link to={"/home"}>Home</Link>
                <Link to={"/films"}>Phim</Link>
                <Link to={"/cinemas"}>Rap</Link>
                <Link to={"/login"}>Dang nhap</Link>
            </div>
        </div>
    )
}

export default Header