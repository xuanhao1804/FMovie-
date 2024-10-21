import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import axios from 'axios';
import './CinemaMovies.scss';
import moment from 'moment';
import 'moment/locale/vi';
import FilmsCard2 from '../../../components/FilmsCard/FilmCard2';

moment.locale('vi');

const CinemaMovies = () => {
    const { cinemaId } = useParams();
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState(null); // Trạng thái lưu suất chiếu được chọn
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tạo danh sách các ngày từ hôm nay và 3 ngày tiếp theo
    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 4; i++) {
            dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
        }
        return dates;
    };

    const availableDates = generateDates(); // Danh sách ngày

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/cinema/get-showtimes`, {
                    params: {
                        cinemaId,
                        date: selectedDate
                    }
                });

                if (response.data.status === 200) {
                    setShowtimes(response.data.data);
                } else {
                    setError('Không thể tải danh sách suất chiếu');
                }
            } catch (error) {

                setError('Tạm Thời chưa có suất chiếu');

                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [cinemaId, selectedDate]);

    // Xử lý chọn ngày
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // Xử lý khi nhấn vào suất chiếu
    const handleShowtimeClick = (time) => {
        setSelectedTime(time); // Lưu lại suất chiếu đã chọn
    };

    const formatDay = (date) => {
        return moment(date).isSame(moment(), 'day') ? 'Hôm Nay' : moment(date).format('dddd');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (

        <div className="container" style={{ padding: '0 20px', marginTop: '20px' }}>
            {/* Bộ lọc ngày (luôn hiện) */}

            <div className="date-filter-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div className="date-filter" style={{ display: 'flex', gap: '20px' }}>
                    {availableDates.map((date) => (
                        <div
                            key={date}
                            className={`date-item ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => handleDateSelect(date)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '10px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                backgroundColor: selectedDate === date ? '#0056b3' : 'transparent',
                                color: selectedDate === date ? 'white' : '#555',
                                width: '80px',
                                height: '80px',
                                textAlign: 'center'
                            }}
                        >
                            <span style={{ fontWeight: selectedDate === date ? 'bold' : 'normal' }}>
                                {formatDay(date)}
                            </span>
                            <span>{moment(date).format('DD/MM')}</span>
                        </div>
                    ))}
                </div>
            </div>

    
            {/* Đường ngăn cách màu xanh */}
            <div style={{ borderBottom: '2px solid #0056b3', marginBottom: '20px' }}></div>
    
            {/* Hiển thị showtimes */}
            {showtimes.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {showtimes.map((showtime) => {
                        const movie = showtime.movie; // Lấy thông tin phim
    

                        return (
                            <Row key={showtime._id} style={{ marginBottom: '20px', width: '100%' }}>
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
                                <Col span={18} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div>
                                        <h3>{movie.name}</h3>
                                        <p style={{ fontWeight: 'bold' }}>Suất chiếu:</p> {/* In đậm chữ "Suất chiếu" */}
                                        {/* Render các giờ chiếu dưới dạng button */}
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            {showtime.startAt.times.map((time, index) => (
                                                <Button
                                                    key={index}
                                                    type={selectedTime === time ? "primary" : "default"}
                                                    onClick={() => handleShowtimeClick(time)}
                                                    style={{
                                                        backgroundColor: selectedTime === time ? '#0056b3' : 'transparent',
                                                        color: selectedTime === time ? 'white' : '#555',
                                                    }}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                        {/* Nút "Đặt Vé" bên dưới suất chiếu */}
                                        <Button
                                            type="primary"
                                            style={{ marginTop: '15px' }}
                                        >
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
