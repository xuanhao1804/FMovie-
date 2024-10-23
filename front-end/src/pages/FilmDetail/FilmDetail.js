import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { MovieService } from "../../services/MovieService"
import { Col, Divider, Row } from "antd"
import "./FilmDetail.scss"
import { ShowtimeService } from "../../services/ShowtimeService"
import { getVietnameseDate } from "../../utils/dateUtils"

const FilmDetail = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    const [film, setFilm] = useState({})
    const [filmShowtimes, setFilmShowtimes] = useState([])

    const [selectedDate, setSelectedDate] = useState("")

    const fetchFilmDetail = async () => {
        const response = await MovieService.fetchMovieDetailService(id)
        if (response.status === 200) {
            setFilm(response.data)
        }
    }

    const fetchFilmShowtimes = async () => {
        const response = await ShowtimeService.fetchShowtimeByMovieService({
            movieId: id
        })
        if (response.status === 200) {
            setFilmShowtimes(response.data);
            const dates = [...new Set(response.data.flatMap(cinema =>
                cinema.rooms.flatMap(room =>
                    room.showtimes.map(showtime => showtime.startAt.date)
                )
            ))]
            setSelectedDate(dates[0])
        }
    }

    useEffect(() => {
        if (id) {
            fetchFilmDetail()
            fetchFilmShowtimes();
        }
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
            <Divider />
            <div className="d-flex flex-column gap-3">
                <div className="border-start border-4 border-primary ps-2 fs-5 fw-semibold">Lịch chiếu phim</div>
                <div className="showtime-selection-date">
                    {
                        [...new Set(filmShowtimes.flatMap(cinema =>
                            cinema.rooms.flatMap(room =>
                                room.showtimes.map(showtime => showtime.startAt.date)
                            )
                        ))].map((item, index) => {
                            return (
                                <button onClick={() => setSelectedDate(item)} className={item === selectedDate ? "showtime-selection-item-selected" : "showtime-selection-item"} key={"detail-showtimes-" + item}>
                                    {getVietnameseDate(item)}
                                </button>
                            )
                        })
                    }
                    <Divider
                        style={{
                            borderColor: '#00BECF',
                            margin: "1rem 0"
                        }}
                    />
                </div>
                <div className="showtime-selection-times">
                    {
                        filmShowtimes.filter(cinema =>
                            cinema.rooms.some(room =>
                                room.showtimes.some(showtime => showtime.startAt.date === selectedDate)
                            )
                        ).map((cinema, index) => {
                            return (
                                <div className="showtime-selection-cinemas mb-4">
                                    <div className="fs-5 mb-2">{cinema.name}</div>
                                    <div className="d-flex gap-2">
                                        {
                                            cinema.rooms.flatMap(room =>
                                                room.showtimes
                                                    .filter(showtime => showtime.startAt.date === selectedDate)
                                                    .flatMap(showtime =>
                                                        showtime.startAt.times.map(time => ({
                                                            room: room.name,
                                                            time: time
                                                        }))
                                                    )
                                            ).map((showtime, index) => {
                                                return (
                                                    <button onClick={() => navigate("/booking", {
                                                        state: {
                                                            city: cinema.city,
                                                            movie: id,
                                                            cinema: cinema._id,
                                                            room: showtime.room,
                                                            time: showtime.time
                                                        }
                                                    })} className={"showtime-selection-item"} key={"detail-showtimes-" + showtime.room + "-" + showtime.time}>
                                                        {showtime.time}
                                                    </button>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default FilmDetail