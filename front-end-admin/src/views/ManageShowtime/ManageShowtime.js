import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Button, Modal, Form, Input, TimePicker, Select, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const ShowtimeManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const { id } = useParams();

    // State for the modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchShowtimes = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/showtime/get-all-showtime-cinema/${id}`);
            setRooms(response.data.showtime.rooms || []);
        } catch (error) {
            console.error('Error fetching showtime data:', error);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:9999/movie/get-all');
            setMovies(response.data.data || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        fetchShowtimes();
        fetchMovies();
    }, [id]);

    const getShowtimesForSelectedDate = (room) => {
        return room.showtimes
            .filter(showtime => dayjs(showtime.startAt.date).format('YYYY-MM-DD') === selectedDate)
            .map(showtime => ({
                time: showtime.startAt.time,
                movie: showtime.movie,
            }))
            .sort((a, b) => {
                const timeA = dayjs(`${selectedDate}T${a.time}`).valueOf();
                const timeB = dayjs(`${selectedDate}T${b.time}`).valueOf();
                return timeA - timeB;
            });
    };
    const columns = [
        {
            title: 'Room',
            dataIndex: 'name',
            key: 'room',
        },
        {
            title: 'Showtimes',
            key: 'showtimes',
            dataIndex: 'showtimes',
            render: (showtimes) => (
                showtimes && showtimes.length > 0
                    ? showtimes.map((showtime, index) => (
                        <div key={index}>
                            <strong>{showtime?.time}</strong> - Movie: {movies.find(movie => movie._id == showtime.movie)?.name}
                        </div>
                    ))
                    : 'No Showtimes'
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleOpenModal(record)}>Create Showtime</Button>
            ),
        }
    ];

    const dataSource = rooms.map(room => {
        const showtimesForDate = getShowtimesForSelectedDate(room);
        return {
            key: room._id,
            name: room.name,
            showtimes: showtimesForDate.length > 0 ? showtimesForDate : null,
        };
    });

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
    };

    // Modal functions
    const handleOpenModal = (record) => {
        form.resetFields();
        form.setFieldValue('roomName', record.name);
        form.setFieldValue('roomId', record.key);
        form.setFieldValue('date', dayjs(selectedDate));
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleCreateShowtime = async (values) => {
        try {
            const { roomId, movieId, date, time } = values;
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const formattedTime = dayjs(time).format('HH:mm');

            const response = await axios.post('http://localhost:9999/showtime/create', {

                movieId,
                date: formattedDate,
                time: formattedTime,
                long: movies.find(movie => movie._id == movieId)?.duration,
                roomId: roomId
            });
            handleCloseModal();
            fetchShowtimes();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message || 'Có lỗi xảy ra!');
            } else {
                console.error('Error creating showtime:', error);
                alert('Có lỗi xảy ra trong quá trình tạo showtime!');
            }
        }
    };


    return (
        <div className="showtime-management">
            <h2>Showtime Management by Date and Room</h2>
            <div style={{ marginBottom: '20px' }}>
                <label>Select Date: </label>
                <DatePicker
                    format="YYYY-MM-DD"
                    value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={handleDateChange}
                />
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />


            <Modal
                title="Create Showtime"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleCreateShowtime}
                    layout="vertical"
                >
                    <Form.Item
                        name="roomName"
                        label="Room Name"
                        rules={[{ required: true }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="roomId"
                        label="Room ID"
                        rules={[{ required: true }]}
                        hidden
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="movieId"
                        label="Movie"
                        rules={[{ required: true, message: 'Please select a movie!' }]}
                    >
                        <Select placeholder="Select a movie">
                            {movies.map(movie => (
                                <Option key={movie._id} value={movie._id}>{movie.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please select a date!' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" disabled />
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Time"
                        rules={[{ required: true, message: 'Please select a time!' }]}
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ShowtimeManagement;
