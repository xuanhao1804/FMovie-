import "./SeatSelection.scss"
import cinema_screen from "../../../assets/icon/cinema-screen.png"
import { Divider } from "antd"
import { useEffect, useState } from "react"
import { RoomService } from "../../../services/RoomService"
import { BookingService } from "../../../services/BookingService"
import { socket } from "../../../App"

const SeatSelection = ({ selectedShowtime, selectedSeats, setSelectedSeats }) => {

    const [roomAreas, setRoomAreas] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);

    const fetchSeatsByRoom = async () => {
        const response = await RoomService.fetchRoomByIDService({ roomID: selectedShowtime.room._id })
        if (response.status === 200) {
            setRoomAreas(response.data.areas)
        } else {
            setRoomAreas([])
        }
    }

    const fetchBookedSeats = async () => {
        const response = await BookingService.getBookedSeats({
            room: selectedShowtime.room._id,
            showtime: selectedShowtime.showtime,
        })
        if (response.status === 200) {
            setBookedSeats(response.data)
        } else {
            console.log(response)
        }
    }

    const handleChangeSelectedSeats = (area, position, isVip) => {
        let seatArray = [...selectedSeats]
        const index = seatArray.findIndex(seat => seat.area === area && seat.position === +position);
        if (index !== -1) {
            seatArray.splice(index, 1); // Remove the seat
        } else {
            seatArray.push({ area: area, position: +position, isVip: isVip }); // Add the seat
        }
        setSelectedSeats(seatArray)
    };

    useEffect(() => {
        if (selectedShowtime.room._id) {
            fetchSeatsByRoom();
            fetchBookedSeats();
        }
    }, [selectedShowtime])

    useEffect(() => {
        if (selectedSeats.length === 0) {
            fetchBookedSeats();
        }
    }, [selectedSeats])

    useEffect(() => {
        socket.on("updatedBookedSeats", (data) => {
            console.log("socket", data)
        })
        return () => {
            socket.off("updatedBookedSeats");
        };
    }, [socket])

    return (
        <div className="seat-selection selection-section" >
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column align-items-center gap-2">
                    <i class="fs-4 fa-solid fa-door-open"></i>
                    <span className="fw-semibold">Lối vào</span>
                </div>
                <img style={{ width: "10%" }} src={cinema_screen} alt="screen" />
                <div className="d-flex flex-column align-items-center gap-2">
                    <i class="fs-4 fa-solid fa-person-walking-dashed-line-arrow-right"></i>
                    <span className="fw-semibold">Lối thoát</span>
                </div>
            </div>
            <Divider />
            <div className="seat-selection-area-list d-flex justify-content-center gap-5 mb-3 ">
                {
                    roomAreas && roomAreas.length > 0 &&
                    roomAreas.map((area, index) => {
                        return (
                            <div className="seat-selection-area text-center">
                                <div className="seat-selection-area-name">Khu {area.name}</div>
                                <div className="seat-selection-list">
                                    {area.seats && area.seats.map((seat, index) => {
                                        if (seat.isEnable) {
                                            return (
                                                <div onClick={() => {
                                                    if (!bookedSeats.find(bookedSeat => bookedSeat.area === area.name && bookedSeat.position === seat.position)) {
                                                        handleChangeSelectedSeats(area.name, seat.position, seat.isVip)
                                                    }
                                                }}
                                                    className={bookedSeats && bookedSeats.find(bookedSeat => bookedSeat.area === area.name && bookedSeat.position === seat.position) ? "seat-selection-item-unavailable" : selectedSeats && selectedSeats.length > 0 && selectedSeats.findIndex(currentSeat => currentSeat.area === area.name && currentSeat.position === seat.position) > -1 ? "seat-selection-item-selected" : "seat-selection-item"} style={{ flex: `1 0 calc(${(100 / area.col)}%)` }}>
                                                    <span>{area.name + seat.position}</span>
                                                    {seat.isVip === true &&
                                                        <i className="seat-selection-icon-vip fa-solid fa-crown"></i>
                                                    }
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="seat-selection-item"></div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="seat-selection-annotation border-top py-2">
                <div className="seat-selection-item seat-selection-item-annotation">
                    Có sẵn
                </div>
                <div className="seat-selection-item-selected seat-selection-item-annotation">
                    Đang chọn
                </div>
                <div className="seat-selection-item-unavailable seat-selection-item-annotation">
                    Hết chỗ
                </div>
                <div className="seat-selection-annotation-isvip">
                    <i className="seat-selection-annotation-isvip-icon fa-solid fa-crown">
                    </i>
                    <span className="seat-selection-annotation-isvip-text">VIP</span>
                </div>
            </div>
        </div >
    )
}

export default SeatSelection