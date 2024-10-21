import "./Booking.scss"
import { Row, Col, Divider } from "antd"
import film_blank from "../../assets/icon/film-blank.svg"
import { useEffect, useState } from "react"
import CitySelection from "../../components/BookingSelection/CitySelection/CitySelection"
import { CinemaService } from "../../services/CinemaService"
import MovieSelection from "../../components/BookingSelection/MovieSelection/MovieSelection"
import { ShowtimeService } from "../../services/ShowtimeService"
import ShowtimeSelection from "../../components/BookingSelection/ShowtimeSelection/ShowtimeSelection"

const Booking = () => {

    const [selectedCity, setSelectedCity] = useState("")
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedDate, setSelectedDate] = useState("")

    const [availableMovies, setAvailableMovies] = useState([])
    const [movieShowtime, setMovieShowtime] = useState([])

    const [step, setStep] = useState(1)

    const getMoviesInCity = async () => {
        const response = await CinemaService.fetchCinemaByCityService(selectedCity._id)
        if (response.status === 200) {
            const movies = [...new Set(response.data.flat())]
            setAvailableMovies(movies)
        } else {
            setAvailableMovies([])
        }
    }

    const getMoviesShowtime = async () => {
        const response = await ShowtimeService.fetchShowtimeByMovieService({
            cityId: selectedCity._id,
            movieId: selectedMovie._id,
        })
        if (response.status === 200) {
            const dates = [...new Set(response.data.flatMap(cinema =>
                cinema.rooms.flatMap(room =>
                    room.showtimes.map(showtime => showtime.startAt.date)
                )
            ))]
            setMovieShowtime(response.data)
            setSelectedDate(dates[0])
        } else {
        }
    }

    useEffect(() => {
        if (selectedCity && selectedCity._id) {
            setSelectedMovie("")
            getMoviesInCity()
        }
    }, [selectedCity])

    useEffect(() => {
        if (selectedMovie) {
            getMoviesShowtime()
        } else {

        }
    }, [selectedMovie])

    return (
        <div className="booking">
            <div className="booking-step">
                <span className={step === 1 ? "booking-step-selecting" : step > 1 ? "booking-step-selected" : "booking-step-title"}>Chọn Phim / Rạp / Suất</span>
                <span className={step === 2 ? "booking-step-selecting" : step > 2 ? "booking-step-selected" : "booking-step-title"}>Chọn Ghế</span>
                <span className={step === 3 ? "booking-step-selecting" : step > 3 ? "booking-step-selected" : "booking-step-title"}>Đồ ăn & nước uống</span>
                <span className={step === 4 ? "booking-step-selecting" : step > 4 ? "booking-step-selected" : "booking-step-title"}>Thanh toán</span>
                <span className={step === 5 ? "booking-step-selecting" : step > 5 ? "booking-step-selected" : "booking-step-title"}>Xác nhận</span>
            </div>
            <div className="booking-content content-width-padding content-height-padding">
                <Row>
                    <Col span={17}>
                        <div className="booking-selections px-4">
                            {step === 1 &&
                                <>
                                    <CitySelection selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                                    <MovieSelection availableMovies={availableMovies} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} />
                                    <ShowtimeSelection movieShowtime={movieShowtime} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                                </>
                            }
                        </div>
                    </Col>
                    <Col span={7}>
                        <div className="booking-information d-flex flex-column gap-3">
                            <div className="d-flex gap-3">
                                <img className="booking-information-film-img" src={selectedMovie.image || film_blank} alt="film-blank" />
                                {selectedMovie &&
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between gap-4">
                                            <span className="fs-5 fw-semibold">{selectedMovie.name || ""}</span>
                                            <span className="film-detail-age-limit" style={{ height: "fit-content" }}>{selectedMovie.limit}</span>
                                        </div>
                                        <span>Quốc gia: <span className="fw-semibold">{selectedMovie.country}</span></span>
                                        <span>Phụ đề: <span className="fw-semibold">Tiếng Việt</span></span>
                                    </div>
                                }
                            </div>
                            <div>
                                <div className="d-flex fs-6 gap-2">
                                    <span className="fw-semibold">Fmovie Hà Nội</span> - <span>Phòng F1</span>
                                </div>
                                <div className="d-flex fs-6 gap-2">
                                    <span>Thời gian: </span><span className="fw-semibold">19:00</span> - <span>Thứ Bảy,</span><span className="fw-semibold">19/10/2024</span>
                                </div>
                            </div>
                            <Divider
                                style={{
                                    borderColor: '#ff914d',
                                    margin: "0"
                                }}
                            />
                            <div className="d-flex flex-column gap-2">
                                <div>
                                    <div className="d-flex justify-content-between">
                                        <span><span className="fw-semibold">2x</span> Ghế</span>
                                        <span className="fw-semibold">180.000 đ</span>
                                    </div>
                                    <span>Vị trí: <span className="fw-semibold">I1, I2</span></span>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between">
                                        <span><span className="fw-semibold">2x</span> Ghế VIP</span>
                                        <span className="fw-semibold">180.000 đ</span>
                                    </div>
                                    <span>Vị trí: <span className="fw-semibold">D3, D4</span></span>
                                </div>
                            </div>
                            <Divider
                                style={{
                                    borderColor: '#ff914d',
                                    margin: "0"
                                }}
                                dashed
                            />
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between">
                                    <span><span className="fw-semibold">2x </span>iCombo 1 Big Extra STD</span>
                                    <span className="fw-semibold">140.000 đ</span>
                                </div>
                            </div>
                            <Divider
                                style={{
                                    borderColor: '#ff914d',
                                    margin: "0"
                                }}
                                dashed
                            />
                            <div className="d-flex justify-content-between fs-6 fw-semibold">
                                <span>Tổng cộng</span>
                                <span className="text-orange">360.000 đ</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default Booking