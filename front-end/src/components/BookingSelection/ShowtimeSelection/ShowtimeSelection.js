import { useSelector } from "react-redux"
import "./ShowtimeSelection.scss"

const ShowtimeSelection = ({ movieShowtime, selectedDate, setSelectedDate }) => {

    const getVietnameseDate = (date) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        let vietnameseDate = new Date(date).toLocaleDateString("vi-VN", options)
        return vietnameseDate
    }

    return (
        <div className="showtime-selection selection-section">
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
                    ))].map((item, index) => {
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
                    console.log(movieShowtime.filter(cinema =>
                        cinema.rooms.some(room =>
                            room.showtimes.some(showtime => showtime.startAt.date === selectedDate)
                        )
                    ))
                }
            </div>
        </div >
    )
}

export default ShowtimeSelection