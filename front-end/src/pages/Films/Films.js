import { NavLink, Outlet } from "react-router-dom"
import "./Films.scss"
import { useDispatch, useSelector } from "react-redux"
import { fetchMovies } from "../../reducers/MovieReducer"
import { useState } from "react"

const Films = () => {

    const dispatch = useDispatch();

    useState(() => {
        dispatch(fetchMovies());
    }, [])

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