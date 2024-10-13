import "./FilmsCard.scss"
import { Button, Modal } from 'antd';
import { useState } from "react";
import { Link } from "react-router-dom";

const FilmsCard = ({ image, limit, star, video }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="films-card" style={{ backgroundImage: `url(${image})` }}
                onClick={() => setOpen(true)}>

                <span className="films-card-age-limitation">
                    {limit}
                </span>
                <span className="films-card-rating">
                    {star} <i style={{ color: "yellow" }} className="fa-solid fa-star"></i>
                </span>
                <div className="films-card-button">
                    <button  className="films-card-button-detail">XEM CHI TIẾT</button>
                    <button className="films-card-button-booking">ĐẶT VÉ</button>
                </div>
            </div>
            <Modal

                centered
                open={open}

                onCancel={() => setOpen(false)}
                width={1054}
            >
                
                <iframe width="1004" height="565" src={video} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
               
            </Modal>
        </>
    )

}

export default FilmsCard