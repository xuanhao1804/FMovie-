import { useSelector } from "react-redux"
import "./ShowtimeSelection.scss"
import { getVietnameseDate } from "../../../utils/dateUtils"
import { useNavigate } from "react-router-dom"

const ShowtimeSelection = ({ movieShowtime, selectedDate, setSelectedDate, selectedShowtime, setSelectedShowtime, showtimeSelectionRef, bookingPreviewRef }) => {

    const navigate = useNavigate()

    return (
        <div className="showtime-selection selection-section" ref={showtimeSelectionRef}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-semibold">
                    Chọn suất chiếu
                </span>
            </div>
            <div className="showtime-selection-date mb-3">
                {movieShowtime && movieShowtime.length > 0 &&
                    [...new Set(movieShowtime.flatMap(cinema =>
                        cinema.rooms.flatMap(room =>
                            room.showtimes.map(showtime => showtime.startAt.date)
                        )
                    ))].sort((a, b) => new Date(a) - new Date(b)).map((item, index) => {
                        return (
                            <button onClick={() => setSelectedDate(item)} className={item === selectedDate ? "showtime-selection-item-selected" : "showtime-selection-item"} key={"showtimes-" + item}>
                                {getVietnameseDate(item)}
                            </button>
                        )
                    })
                }
            </div>
            <div className="showtime-selection-times">
                {
                    movieShowtime.filter(cinema =>
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
                                                        room: {
                                                            _id: room._id,
                                                            name: room.name
                                                        },
                                                        _id: showtime._id,
                                                        time: time
                                                    }))
                                                )
                                        ).map((showtime, index) => {
                                            return (
                                                <button
                                                    onClick={() => {
                                                        setSelectedShowtime({
                                                            cinema: {
                                                                _id: cinema._id,
                                                                name: cinema.name,
                                                                address: cinema.address
                                                            },
                                                            showtime: showtime._id,
                                                            room: showtime.room,
                                                            time: showtime.time
                                                        })
                                                        if (bookingPreviewRef) {
                                                            bookingPreviewRef.current.scrollIntoView()
                                                        }
                                                    }}
                                                    className={(selectedShowtime && selectedShowtime.cinema && selectedShowtime.room && selectedShowtime.cinema._id === cinema._id && selectedShowtime.room._id === showtime.room._id && selectedShowtime.showtime === showtime._id && selectedShowtime.time === showtime.time)
                                                        ?
                                                        "showtime-selection-item-selected"
                                                        :
                                                        "showtime-selection-item"
                                                    }
                                                    key={"detail-showtimes-" + showtime.room + "-" + showtime.time}>
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
        </div >
    )
}

export default ShowtimeSelection