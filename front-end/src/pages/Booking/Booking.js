import "./Booking.scss"
import { Row, Col, Divider } from "antd"
import film_blank from "../../assets/icon/film-blank.svg"
import { useEffect, useRef, useState } from "react"
import CitySelection from "../../components/BookingSelection/CitySelection/CitySelection"
import { CinemaService } from "../../services/CinemaService"
import MovieSelection from "../../components/BookingSelection/MovieSelection/MovieSelection"
import { ShowtimeService } from "../../services/ShowtimeService"
import ShowtimeSelection from "../../components/BookingSelection/ShowtimeSelection/ShowtimeSelection"
import { getVietnameseDate } from "../../utils/dateUtils"

const Booking = () => {

    const [selectedCity, setSelectedCity] = useState("")
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedShowtime, setSelectedShowtime] = useState(null)

    const [availableMovies, setAvailableMovies] = useState([])
    const [movieShowtime, setMovieShowtime] = useState([])

    const [step, setStep] = useState(1)

    const movieSelectionRef = useRef(null)
    const showtimeSelectionRef = useRef(null)
    const bookingPreviewRef = useRef(null)

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
            setSelectedShowtime(null)
        }
    }, [selectedMovie])

    return (
        <div className="booking">
            {console.log(selectedShowtime === null)}
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
                                    <CitySelection selectedCity={selectedCity} setSelectedCity={setSelectedCity} movieSelectionRef={movieSelectionRef} />
                                    <MovieSelection availableMovies={availableMovies} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} movieSelectionRef={movieSelectionRef} showtimeSelectionRef={showtimeSelectionRef} />
                                    <ShowtimeSelection movieShowtime={movieShowtime} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedShowtime={selectedShowtime} setSelectedShowtime={setSelectedShowtime} showtimeSelectionRef={showtimeSelectionRef} bookingPreviewRef={bookingPreviewRef} />
                                </>
                            }
                        </div>
                    </Col>
                    <Col span={7}>
                        <div className="booking-information d-flex flex-column gap-3" ref={bookingPreviewRef}>
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
                            {selectedShowtime &&
                                <>
                                    <div>
                                        <div className="d-flex fs-6 gap-2">
                                            <span className="fw-semibold">{selectedShowtime.cinema.name}</span> - <span>{selectedShowtime.room.name}</span>
                                        </div>
                                        <div className="d-flex fst-italic gap-2 mb-2">
                                            {selectedShowtime.cinema.address}
                                        </div>
                                        <div className="d-flex fs-6 gap-2">
                                            <span>Thời gian: </span><span className="fw-semibold">{selectedShowtime.time}</span> - <span>{getVietnameseDate(selectedDate)}</span>
                                        </div>
                                    </div>
                                    <Divider
                                        style={{
                                            borderColor: '#ff914d',
                                            margin: "0"
                                        }}
                                    />
                                </>
                            }
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
                        <div className="booking-step-action mt-4">
                            <button onClick={() => {
                                if (step > 1) {
                                    setStep(step => step - 1)
                                }
                            }} className={step === 1 ? "booking-step-action-btn booking-step-action-btn-disable" : "booking-step-action-btn"}>
                                Quay lại
                            </button>
                            <button onClick={() => {
                                if (selectedCity && selectedDate && selectedMovie && selectedShowtime) {
                                    setStep(step => step + 1)
                                }
                            }} className="booking-step-action-btn">
                                Tiếp tục
                            </button>
                            {console.log("step: ", step)}
                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default Booking