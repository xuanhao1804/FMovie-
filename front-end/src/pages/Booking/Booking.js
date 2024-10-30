import "./Booking.scss"
import { Row, Col, Divider } from "antd"
import film_blank from "../../assets/icon/film-blank.svg"
import { useEffect, useMemo, useRef, useState } from "react"
import CitySelection from "../../components/BookingSelection/CitySelection/CitySelection"
import MovieSelection from "../../components/BookingSelection/MovieSelection/MovieSelection"
import { ShowtimeService } from "../../services/ShowtimeService"
import ShowtimeSelection from "../../components/BookingSelection/ShowtimeSelection/ShowtimeSelection"
import { getVietnameseDate } from "../../utils/dateUtils"
import SeatSelection from "../../components/BookingSelection/SeatSelection/SeatSelection"
import { NumericFormat } from "react-number-format";
import { useSelector } from "react-redux"
import PopcornSelection from "../../components/BookingSelection/PopcornSelection/PopcornSelection"
import PaymentSelection from "../../components/BookingSelection/PaymentSelection/PaymentSelection"
import { BookingService } from "../../services/BookingService"

import { socket } from "../../App"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Booking = () => {

    const location = useLocation()

    const navigate = useNavigate()

    const { popcorns, user } = useSelector((state) => state)

    const [selectedCity, setSelectedCity] = useState("")
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedShowtime, setSelectedShowtime] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [selectedPopcorns, setSelectedPopcorns] = useState([])

    const [movieShowtime, setMovieShowtime] = useState([])
    const [paymentInformation, setPaymentInformation] = useState(null)

    const [step, setStep] = useState(1)

    const [isGetFromDetail, setIsGetFromDetail] = useState(false)

    const movieSelectionRef = useRef(null)
    const showtimeSelectionRef = useRef(null)
    const bookingPreviewRef = useRef(null)

    const seatsPrice = useMemo(() => {
        const normalSeats = 50000 * selectedSeats.filter(seat => seat.isVip === false).length
        const vipSeats = 60000 * selectedSeats.filter(seat => seat.isVip === true).length
        return { normalSeats, vipSeats };
    }, [selectedSeats])

    const popcornsPrice = useMemo(() => {
        return selectedPopcorns.reduce((total, popcorn) => {
            return total + (popcorn.quantity * popcorns.list.find(p => p._id === popcorn._id).price)
        }, 0)
    }, [selectedPopcorns])

    useEffect(() => {
        if (!user.user || !user.user.account) {
            navigate("/auth/sign-in")
        }
    }, [])

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
            if (isGetFromDetail === true) {
                setSelectedDate(location.state.selectedDate)
            } else {
                setSelectedDate(dates.sort((a, b) => new Date(a) - new Date(b))[0])
            }
        }
    }

    const handleCreatePayment = async () => {
        const response = await BookingService.createPaymentService({
            total_price: seatsPrice.normalSeats + seatsPrice.vipSeats + popcornsPrice,
            createdBy: user?.user?.account?._id,
            room: selectedShowtime.room._id,
            showtime: selectedShowtime.showtime,
            time: selectedShowtime.time,
            seats: selectedSeats,
            popcorns: selectedPopcorns
        })
        setPaymentInformation(response)
    }

    useEffect(() => {
        if (selectedCity && selectedCity._id && isGetFromDetail === false) {
            setSelectedMovie("")
            setSelectedShowtime(null)
        }
    }, [selectedCity])

    useEffect(() => {
        if (selectedMovie) {
            getMoviesShowtime()
            if (isGetFromDetail === false) {
                setSelectedShowtime(null)
            } else {
                setIsGetFromDetail(false)
            }
            if (selectedSeats.length > 0) {
                setSelectedSeats([])
            }
        } else {
            if (movieShowtime.length > 0) {
                setMovieShowtime([])
            }
        }
    }, [selectedMovie])

    useEffect(() => {
        setPaymentInformation(null)
    }, [selectedMovie, selectedSeats, selectedPopcorns])

    useEffect(() => {
        socket.on("paymentVerify", (data) => {
            if (data) {
                if (data.createdBy === user?.user?.account?._id && data.status === "paid") {
                    setStep(step => step += 1)
                }
            }
        })
        return () => {
            socket.off("paymentVerify");
        };
    }, [socket])

    useEffect(() => {
        if (location && location.state) {
            setIsGetFromDetail(true)
            if (location.state.selectedCity) {
                setSelectedCity(location.state.selectedCity)
            }
            if (location.state.selectedMovie) {
                setSelectedMovie(location.state.selectedMovie)
            }
            if (location.state.selectedShowtime) {
                setSelectedShowtime(location.state.selectedShowtime)
            }
        }
    }, [location.state])

    return (
        <div className="booking">
            <div className="booking-step">
                <span className={step === 1 ? "booking-step-selecting" : step > 1 ? "booking-step-selected" : "booking-step-title"}>Chọn Phim / Rạp / Suất</span>
                <span className={step === 2 ? "booking-step-selecting" : step > 2 ? "booking-step-selected" : "booking-step-title"}>Chọn Ghế</span>
                <span className={step === 3 ? "booking-step-selecting" : step > 3 ? "booking-step-selected" : "booking-step-title"}>Đồ ăn & nước uống</span>
                <span className={step === 4 ? "booking-step-selecting" : step > 4 ? "booking-step-selected" : "booking-step-title"}>Thanh toán</span>
                <span className={step === 5 ? "booking-step-selected" : "booking-step-title"}>Xác nhận</span>
            </div>
            <div className="booking-content content-width-padding content-height-padding">
                <Row>
                    <Col span={17}>
                        <div className="booking-selections px-4">
                            {step === 1 &&
                                <>
                                    <CitySelection selectedCity={selectedCity} setSelectedCity={setSelectedCity} movieSelectionRef={movieSelectionRef} />
                                    <MovieSelection selectedCity={selectedCity} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} movieSelectionRef={movieSelectionRef} showtimeSelectionRef={showtimeSelectionRef} />
                                    <ShowtimeSelection movieShowtime={movieShowtime} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedShowtime={selectedShowtime} setSelectedShowtime={setSelectedShowtime} showtimeSelectionRef={showtimeSelectionRef} bookingPreviewRef={bookingPreviewRef} />
                                </>
                            }
                            {step === 2 &&
                                <>
                                    <SeatSelection selectedShowtime={selectedShowtime} selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />
                                </>
                            }
                            {
                                step === 3 &&
                                <>
                                    <PopcornSelection selectdPopcorns={selectedPopcorns} setSelectedPopcorns={setSelectedPopcorns} />
                                </>
                            }
                            {
                                step === 4 &&
                                <>
                                    <PaymentSelection handleCreatePayment={handleCreatePayment} paymentInformation={paymentInformation} />
                                </>
                            }
                            {
                                step === 5 &&
                                <>
                                    <div className="bg-white d-flex flex-column gap-5 py-5">
                                        <div className="d-flex justify-content-center align-items-center"><i style={{ fontSize: "4rem", color: "#00cf1c" }} className=" fa-solid fa-circle-check"></i></div>
                                        <div className="d-flex flex-column align-items-center">
                                            <span className="fs-5">Thanh toán thành công</span>
                                            <span className="fs-6">Cảm ơn quý khách đã lựa chọn Fmovie</span>
                                        </div>
                                        <div className="d-flex justify-content-center gap-3">
                                            <Link to={"/"} className="btn btn-outline-primary">
                                                <i class="fa-solid fa-house"></i> Trang chủ
                                            </Link>
                                            <button onClick={() => {
                                                setSelectedMovie("")
                                                setSelectedPopcorns([])
                                                setStep(1)
                                            }} className="btn btn-outline-warning"><i class="fa-solid fa-film"></i> Chọn phim khác</button>
                                        </div>
                                    </div>
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
                                            <span>Thời gian: </span><span className="fw-semibold">{selectedShowtime.showtime?.startAt?.time}</span> - <span>{getVietnameseDate(selectedDate)}</span>
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
                            {selectedSeats && selectedSeats.length > 0 &&
                                <><div className="d-flex flex-column gap-2">
                                    {selectedSeats.filter(seat => seat.isVip === false).length > 0 &&
                                        <div>
                                            <div className="d-flex justify-content-between">
                                                <span><span className="fw-semibold">{selectedSeats.filter(seat => seat.isVip === false).length}x</span> Ghế</span>
                                                <NumericFormat value={seatsPrice.normalSeats} decimalSeparator="," thousandSeparator="." displayType="text" className="fw-semibold" suffix=" đ" />
                                            </div>
                                            <span className="d-flex gap-2">
                                                <span>Vị trí:</span>
                                                <span className="fw-semibold">
                                                    {selectedSeats.filter(seat => seat.isVip === false).map(seat => `${seat.area}${seat.position}`).join(", ")}
                                                </span>
                                            </span>
                                        </div>
                                    }
                                    {selectedSeats.filter(seat => seat.isVip === true).length > 0 &&
                                        <div>
                                            <div className="d-flex justify-content-between">
                                                <span><span className="fw-semibold">{selectedSeats.filter(seat => seat.isVip === true).length}x</span> Ghế VIP</span>
                                                <NumericFormat value={seatsPrice.vipSeats} decimalSeparator="," thousandSeparator="." displayType="text" className="fw-semibold" suffix=" đ" />
                                            </div>
                                            <span className="d-flex gap-2">
                                                <span>Vị trí:</span>
                                                <span className="fw-semibold">
                                                    {selectedSeats.filter(seat => seat.isVip === true).map(seat => `${seat.area}${seat.position}`).join(", ")}
                                                </span>
                                            </span>
                                        </div>
                                    }
                                </div>
                                    <Divider
                                        style={{
                                            borderColor: '#ff914d',
                                            margin: "0"
                                        }}
                                        dashed
                                    />
                                </>
                            }
                            {popcorns && selectedPopcorns && selectedPopcorns.length > 0 &&
                                <>
                                    <div className="d-flex flex-column gap-2">
                                        {selectedPopcorns.map((item, index) => {
                                            return (
                                                <div className="d-flex justify-content-between">
                                                    <span><span className="fw-semibold">{item.quantity}x </span>{popcorns.list.find(popcorn => popcorn._id === item._id).name}</span>
                                                    <NumericFormat value={item.quantity * +popcorns.list.find(popcorn => popcorn._id === item._id).price} decimalSeparator="," thousandSeparator="." displayType="text" className="fw-semibold" suffix=" đ" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <Divider
                                        style={{
                                            borderColor: '#ff914d',
                                            margin: "0"
                                        }}
                                        dashed
                                    />
                                </>
                            }
                            <div className="d-flex justify-content-between fs-6 fw-semibold">
                                <span>Tổng cộng</span>
                                <NumericFormat value={seatsPrice.normalSeats + seatsPrice.vipSeats + popcornsPrice} decimalSeparator="," thousandSeparator="." displayType="text" className="fw-semibold text-orange" suffix=" đ" />
                            </div>
                        </div>
                        {step !== 5 &&
                            <div className="booking-step-action mt-4">
                                <button onClick={() => {
                                    if (step > 1) {
                                        setStep(step => step - 1)
                                    }
                                }} className={step === 1 ? "booking-step-action-btn booking-step-action-btn-disable" : "booking-step-action-btn"}>
                                    Quay lại
                                </button>
                                <button onClick={() => {
                                    switch (step) {
                                        case 1:
                                            if (selectedCity && selectedDate && selectedMovie && selectedShowtime) {
                                                setStep(step => step + 1)
                                            }
                                            break;
                                        case 2:
                                        case 3:
                                            if (selectedSeats.length > 0) {
                                                setStep(step => step + 1)
                                            }
                                            break;
                                        default:
                                            break;
                                    }

                                }} className={step === 4 ? "booking-step-action-btn booking-step-action-btn-disable" : "booking-step-action-btn"}>
                                    Tiếp tục
                                </button>
                            </div>
                        }
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Booking
