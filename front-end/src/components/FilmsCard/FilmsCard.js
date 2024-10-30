import "./FilmsCard.scss"
import { Button, Modal } from 'antd';
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const FilmsCard = ({ _id, image, limit, star, video }) => {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)

    return (
        <>
            <div className="films-card" style={{ backgroundImage: `url(${image})` }}
                onClick={() => {
                    if (!window.location.pathname.includes("booking")) {
                        setOpen(true)
                    }
                }}>

                <span className="films-card-age-limitation">
                    {limit}
                </span>
                <span className="films-card-rating">
                    {star} <i style={{ color: "yellow" }} className="fa-solid fa-star"></i>
                </span>
                {!window.location.pathname.includes("booking") &&
                    <>
                        <div className="films-card-button">
                            <Link to={"/film/detail/" + _id} className="films-card-button-detail">XEM CHI TIẾT</Link>
                            <button onClick={() => {
                                if (user.account) {
                                    navigate("/booking")
                                } else {
                                    navigate("/auth/sign-in")
                                }
                            }} className="films-card-button-booking">ĐẶT VÉ</button>
                        </div>
                    </>
                }
            </div >
            <Modal
                centered
                open={open}
                onCancel={() => setOpen(false)}
                width={1054}
                okButtonProps={{
                    style: { display: 'none' }, // Hide OK button
                }}
                cancelButtonProps={{
                    style: { display: 'none' }, // Hide Cancel button
                }}
            >
                <iframe width="1004" height="565" src={video} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </Modal>
        </>
    )

}

export default FilmsCard