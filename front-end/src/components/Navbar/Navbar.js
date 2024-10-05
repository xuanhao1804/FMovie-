import { NavLink, Outlet } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="Navbar">
            <div>
                <NavLink to={"home"}>Home</NavLink>
                <NavLink to={"films"}>Phim</NavLink>
                <NavLink to={"cinemas"}>Rap</NavLink>
                <NavLink to={"login"}>Dang nhap</NavLink>
            </div>
            <Outlet />
        </div>
    )
}

export default Navbar