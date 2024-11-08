import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./CinemaMovies.scss";
import moment from "moment";
import "moment/locale/vi";
import { ShowtimeService } from "../../services/ShowtimeService";
import FilmsCard from "../../components/FilmsCard/FilmsCard";
import { useSelector } from "react-redux";

moment.locale("vi");

const CinemaMovies = () => {
    const { cinemaId } = useParams();
    const [cinemaData, setCinemaData] = useState({})
    const [availableDates, setAvailableDates] = useState([])
    const [availableMovies, setAvailableMovies] = useState([])
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const { movies } = useSelector((state) => state)
    useEffect(() => {
        if (cinemaId) {
            fetchShowtimeByCinema()
        }
    }, [cinemaId])

    const fetchShowtimeByCinema = async () => {
        const response = await ShowtimeService.fetchShowtimeByCinema(cinemaId)
        if (response.status === 200) {
            setCinemaData(response.data)
            setAvailableDates(Array.from(new Set(response.data.rooms.flatMap(room => room.showtimes.map(showtime => showtime.startAt.date)))).sort((a, b) => new Date(a) - new Date(b)))
        }
    }

    useEffect(() => {
        if (cinemaData && cinemaData.rooms) {
            setAvailableMovies(Array.from(new Set(cinemaData.rooms.flatMap(room => room.showtimes.filter(showtime => showtime.startAt.date === selectedDate).map(showtime => showtime.movie)))))
        }
    }, [selectedDate])

    useEffect(() => {
        if (availableDates && availableDates.length > 0) {
            setSelectedDate(availableDates[0])
        }
    }, [availableDates])

    const formatDay = (date) => {
        return moment(date).isSame(moment(), "day")
            ? "Hôm Nay"
            : moment(date).format("dddd").split(" ").map((word) => {
                return word[0].toUpperCase() + word.substring(1);
            }).join(" ");
    };

    return (
        <div className="container" style={{ padding: "0 20px", marginTop: "20px" }}>
            <div className="text-center mb-5">
                <div className="fs-4">Rạp chiếu phim: {cinemaData?.name?.toUpperCase()}</div>
                <div className="fs-6">Địa chỉ: {cinemaData?.address}</div>
            </div>
            <div
                className="date-filter-wrapper"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                }}
            >
                <div className="cinema-movies-available-dates" style={{ display: "flex", gap: "20px" }}>
                    {availableDates && availableDates.length > 0 && availableDates.map((item, index) => {
                        return (
                            <div
                                key={"available-date-" + index}
                                className={`date-item ${selectedDate === item ? "active" : ""}`}
                                onClick={() => setSelectedDate(item)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderRadius: "8px",
                                    backgroundColor:
                                        selectedDate === item ? "#0056b3" : "transparent",
                                    color: selectedDate === item ? "white" : "#0056b3",
                                    textAlign: "center",
                                    border: "0.05rem solid #0056b3",
                                    marginBottom: "0.5rem"
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: selectedDate === item ? "bold" : "normal",
                                        textWrap: "nowrap"
                                    }}
                                >
                                    {formatDay(item)}
                                </span>
                                <span>{moment(item).format("DD/MM/YYYY")}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="cinema-movies-available-movies">
                {
                    movies && availableMovies && availableMovies.length > 0 &&
                    availableMovies.map((item, index) => {
                        const movie = movies?.playingMovies?.find(movie => movie._id === item)
                        return (
                            <div className="d-flex mb-3 align-items-center gap-4">
                                <div className="w-25">
                                    {movie &&
                                        <FilmsCard _id={movie._id} image={movie.image} limit={movie.limit} star={movie.rating} video={movie.video} />

                                    }
                                </div>
                                <div className="">
                                    <div className="fs-5 mb-2">
                                        Các suất chiếu
                                    </div>
                                    <div className="d-flex gap-2">
                                        {
                                            cinemaData.rooms.flatMap(room =>
                                                room.showtimes
                                                    .filter(showtime => showtime.startAt.date === selectedDate && showtime.movie === movie._id)
                                                    .map(showtime => ({ ...showtime, room: { name: room.name, _id: room._id } }))
                                            ).sort((a, b) => a.startAt.time.localeCompare(b.startAt.time))
                                                .map((showtime, index) => {
                                                    console.log(showtime)
                                                    return (
                                                        <button
                                                            onClick={() => navigate("/booking", {
                                                                state: {
                                                                    selectedCity: { _id: cinemaData.city },
                                                                    selectedShowtime: {
                                                                        cinema: {
                                                                            _id: cinemaData._id,
                                                                            name: cinemaData.name,
                                                                            address: cinemaData.address
                                                                        },
                                                                        showtime: showtime,
                                                                        room: showtime.room,
                                                                    },
                                                                    selectedMovie: movie,
                                                                    selectedDate: selectedDate
                                                                }
                                                            })}
                                                            className={
                                                                "cinema-movies-showtime-selection-item"
                                                            }
                                                            key={"detail-showtimes-" + showtime.room + "-" + showtime.time}>
                                                            {showtime.startAt.time}
                                                        </button>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default CinemaMovies;
