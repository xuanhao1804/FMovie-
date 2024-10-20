import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { MovieService } from "../../services/MovieService"
import { Col, Row } from "antd"
import "./FilmDetail.scss"

const FilmDetail = () => {

    const { id } = useParams()

    const [film, setFilm] = useState({})

    const fetchFilmDetail = async () => {
        const response = await MovieService.fetchMovieDetailService(id)
        if (response.status === 200) {
            setFilm(response.data)
        }
    }

    useEffect(() => {
        fetchFilmDetail()
    }, [id])

    return (
        <div className="film-detail content-width-padding content-height-padding">
            {film && film._id !== null &&
                <Row>
                    <Col span={6}>
                        <img src={film.image} className="film-detail-image" alt="film-image" />
                    </Col>
                    <Col span={18}>
                        <div className="film-detail-content">
                            <div className="film-detail-title-justify">
                                <div className="film-detail-title">
                                    <h1 className="film-detail-name">{film.name}</h1>
                                    <span className="film-detail-age-limit">{film.limit}</span>
                                </div>
                                <Link className="film-detail-book-now" to={"/booking"} >Đặt vé ngay</Link>
                            </div>
                            <div className="film-detail-duration">
                                <div>
                                    <i style={{ color: "#ff914d" }} className="fa-solid fa-clock"></i> {film.duration} phút
                                </div>
                                <div>
                                    <i style={{ color: "#ff914d", fontSize: "1.25rem" }} className="fa-solid fa-star"></i> {film.rating}
                                </div>
                            </div>
                            <div>
                                <span>Quốc gia: {film.country}</span>
                            </div>
                            <div>
                                <span>Nhà sản xuất: {film.studio === "None" ? "Đang cập nhật" : film.studio}</span>
                            </div>
                            <div>
                                <span>Thể loại: </span>
                                {film.genres && film.genres.length > 0 &&
                                    film.genres.map((item, index) => {
                                        return (
                                            <span>{index === 0 ? "" : " - "}{item}</span>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <span>Đạo diễn: {film.director}</span>
                            </div>
                            <div>
                                <span>Diễn viên: </span>
                                {film.actors && film.actors.length > 0 &&
                                    film.actors.map((item, index) => {
                                        return (
                                            <span>{index === 0 ? "" : " - "}{item}</span>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <span>Nội dung phim: {film.description}</span>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className="film-detail-trailer">
                            <iframe width="1280" height="640" src={film.video} title="Grave of the Fireflies - Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                    </Col>
                </Row>
            }
        </div>
    )
}

export default FilmDetail