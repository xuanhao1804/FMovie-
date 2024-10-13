import "./FilmsCard.scss"

const FilmsCard = ({ image, limit, star }) => {
    return (
        <div className="films-card" style={{ backgroundImage: `url(${image})` }}>
            <span className="films-card-age-limitation">
                {limit}
            </span>
            <span className="films-card-rating">
                {star} <i style={{ color: "yellow" }} className="fa-solid fa-star"></i>
            </span>
            <div className="films-card-button">
                <button className="films-card-button-detail">XEM CHI TIẾT</button>
                <button className="films-card-button-booking">ĐẶT VÉ</button>
            </div>
        </div>
    )
}

export default FilmsCard