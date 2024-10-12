import { NavLink, Outlet } from "react-router-dom"
import "./Films.scss"

const Films = () => {
    return (
        <div className="films content-width-padding content-height-padding">
            <div className="films-header">
                <NavLink to={"playing"} className={({ isActive }) =>
                    isActive ? "films-header-item films-header-item-active text-orange" : "films-header-item"
                }>
                    Đang chiếu
                </NavLink>
                <NavLink to={"upcoming"} className={({ isActive }) =>
                    isActive ? "films-header-item films-header-item-active text-orange" : "films-header-item"
                }>
                    Sắp chiếu
                </NavLink>
            </div>
            <Outlet />
        </div>
    )
}

export default Films