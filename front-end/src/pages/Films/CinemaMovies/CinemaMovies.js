import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Button } from "antd";
import axios from "axios";
import "./CinemaMovies.scss";
import moment from "moment";
import "moment/locale/vi";
import FilmsCard2 from "../../../components/FilmsCard/FilmCard2";

moment.locale("vi");

const CinemaMovies = () => {
    const { cinemaId } = useParams();
    const [showtimes, setShowtimes] = useState([]);
    const [filteredShowtimes, setFilteredShowtimes] = useState([]); // Lưu các suất chiếu đã lọc
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [selectedTime, setSelectedTime] = useState(null); // Thêm state cho selectedTime
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tạo danh sách các ngày từ hôm nay và 3 ngày tiếp theo
    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 4; i++) {
            dates.push(moment().add(i, "days").format("YYYY-MM-DD"));
        }
        return dates;
    };

    const availableDates = generateDates(); // Danh sách ngày

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                // Gọi API lấy suất chiếu
                const response = await axios.get(`http://localhost:9999/cinema/movies/${cinemaId}`);
                console.log("Response from API:", response.data); // Log dữ liệu trả về từ API

                if (response.data.status === 200) {
                    // Cập nhật suất chiếu vào state
                    setShowtimes(response.data.data.showtimes);
                    filterShowtimesByDate(response.data.data.showtimes, selectedDate); // Lọc theo ngày đã chọn
                } else {
                    setError("Không thể tải danh sách suất chiếu");
                    console.log("Error message:", response.data.message); // Log lỗi nếu có
                }
            } catch (error) {
                setError("Tạm thời chưa có suất chiếu");
                console.error("Error fetching showtimes:", error); // Log lỗi kết nối API
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [cinemaId]);

    useEffect(() => {
        filterShowtimesByDate(showtimes, selectedDate); // Lọc suất chiếu mỗi khi ngày thay đổi
    }, [selectedDate, showtimes]);

    // Hàm lọc suất chiếu theo ngày
    const filterShowtimesByDate = (allShowtimes, date) => {
        const filtered = allShowtimes.filter(
            (showtime) => moment(showtime.startAt.date).format("YYYY-MM-DD") === date
        );
        setFilteredShowtimes(groupShowtimesByMovie(filtered)); // Nhóm các suất chiếu theo phim
        console.log("Filtered showtimes:", filtered);
    };

// Hàm nhóm suất chiếu theo phim
const groupShowtimesByMovie = (showtimes) => {
    const movieMap = {};
    showtimes.forEach((showtime) => {
        const movieId = showtime.movie._id;
        if (!movieMap[movieId]) {
            movieMap[movieId] = {
                movie: showtime.movie,
                times: [],
            };
        }
        // Thêm giờ chiếu vào mảng `times`
        movieMap[movieId].times.push(showtime.startAt.time);
    });

    return Object.values(movieMap);
};


    // Xử lý chọn ngày
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const formatDay = (date) => {
        return moment(date).isSame(moment(), "day")
            ? "Hôm Nay"
            : moment(date).format("dddd");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container" style={{ padding: "0 20px", marginTop: "20px" }}>
            {/* Bộ lọc ngày (luôn hiện) */}
            <div
                className="date-filter-wrapper"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                }}
            >
                <div className="date-filter" style={{ display: "flex", gap: "20px" }}>
                    {availableDates.map((date) => (
                        <div
                            key={date}
                            className={`date-item ${selectedDate === date ? "active" : ""}`}
                            onClick={() => handleDateSelect(date)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "10px",
                                cursor: "pointer",
                                borderRadius: "8px",
                                backgroundColor:
                                    selectedDate === date ? "#0056b3" : "transparent",
                                color: selectedDate === date ? "white" : "#555",
                                width: "80px",
                                height: "80px",
                                textAlign: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: selectedDate === date ? "bold" : "normal",
                                }}
                            >
                                {formatDay(date)}
                            </span>
                            <span>{moment(date).format("DD/MM")}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Đường ngăn cách màu xanh */}
            <div
                style={{ borderBottom: "2px solid #0056b3", marginBottom: "20px" }}
            ></div>

            {/* Hiển thị showtimes */}
            {filteredShowtimes.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {filteredShowtimes.map((group) => {
                        const { movie, times } = group;

                        return (
                            <Row key={movie._id} style={{ marginBottom: "20px", width: "100%" }}>
                                <Col span={6}>
                                    {/* FilmCard không còn nút "Đặt Vé" */}
                                    <FilmsCard2
                                        _id={movie._id}
                                        image={movie.image}
                                        limit={movie.limit}
                                        star={movie.rating}
                                        video={movie.video}
                                    />
                                </Col>
                                <Col
                                    span={18}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        paddingLeft: "20px",
                                    }}
                                >
                                    <div>
                                        <h3>{movie.name}</h3>
                                        <p style={{ fontWeight: "bold" }}>Suất chiếu:</p>
                                        {/* Hiển thị tất cả các giờ chiếu của phim */}
                                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                            {times.flat().map((time, index) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => setSelectedTime(time)}
                                                    type={selectedTime === time ? "primary" : "default"}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                        {/* Nút "Đặt Vé" */}
                                        <Button type="primary" style={{ marginTop: "15px" }}>
                                            Đặt Vé
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        );
                    })}
                </Row>
            ) : (
                <div>Không có phim nào cho ngày đã chọn.</div>
            )}
        </div>
    );
};

export default CinemaMovies;
