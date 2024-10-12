import "./FilmsCard.scss"

const FilmsCard = () => {
    return (
        <div className="films-card" style={{ backgroundImage: `url(${"https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/thumbnail/190x260/2e2b8cd282892c71872b9e67d2cb5039/r/s/rsz_exe_main-poster-v2.jpg"})` }}>
            <span className="films-card-age-limitation">
                18+
            </span>
            <span className="films-card-rating">
                8.9 <i style={{ color: "yellow" }} className="fa-solid fa-star"></i>
            </span>
        </div>
    )
}

export default FilmsCard