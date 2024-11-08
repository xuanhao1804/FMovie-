import React, { useState } from 'react';
import { Modal, Form, Select, DatePicker, TimePicker, Button, message, Card, Typography, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './Crea.css';

const { Option } = Select;

const CreateMultipleShowtimesModal = ({
    visible,
    onCancel,
    selectedDate,
    rooms,
    movies,
    fetchShowtimes,
}) => {
    const [form] = Form.useForm();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalWidth, setModalWidth] = useState(600); // Initial modal width
    const maxModalWidth = 1200; // Maximum modal width
    const itemWidth = 300; // Width of each item

    const handleRoomChange = (roomId) => {
        setSelectedRoom(rooms.find((room) => room._id === roomId));
    };

    const handleCreateMultipleShowtimes = async () => {
        try {
            const values = form.getFieldsValue();
            const formattedValues = {
                ...values,
                items: values.items.map(item => ({
                    ...item,
                    date: dayjs(item.date).toISOString(),
                    subitems: item.subitems.map(subItem => ({
                        ...subItem,
                        time: dayjs(subItem.time).format('HH:mm'),
                    })),
                }))
            };

            await axios.post('http://localhost:9999/showtime/createmany', formattedValues);
            message.success('Tạo nhiều suất chiếu thành công!');
            onCancel();
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

    const handleAddItem = () => {
        setModalWidth((prevWidth) =>
            Math.min(prevWidth + itemWidth, maxModalWidth)
        );
        const values = form.getFieldsValue();


        if (values.items.length > 1) {

            const newItemIndex = values.items.length - 1;
            const lastItem = values.items[newItemIndex - 1];


            form.setFieldsValue({
                items: [
                    ...values.items.slice(0, newItemIndex),
                    {
                        ...values.items[newItemIndex],
                        subitems: lastItem.subitems,
                    },
                ],
            });
        }
    };

    const handleRemoveItem = (remove, name) => {
        remove(name);
        setModalWidth((prevWidth) =>
            Math.max(prevWidth - itemWidth, 600)
        );
    };

    return (
        <Modal
            title="Tạo nhiều suất chiếu"
            visible={visible}
            onCancel={onCancel}
            width={1000}

            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="create" type="primary" onClick={handleCreateMultipleShowtimes}>
                    Tạo
                </Button>,
            ]}
            style={{ paddingLeft: "200px" }}
        >
            <Form
                form={form}
                name="dynamic_form_complex"
                autoComplete="off"
                initialValues={{
                    items: [{}],
                }}
            >
                {/* Common Room Selector */}
                <Form.Item label="Chọn phòng" name="roomId" rules={[{ required: true, message: 'Vui lòng chọn phòng!' }]}>
                    <Select onChange={handleRoomChange} placeholder="Chọn phòng">
                        {rooms.map((room) => (
                            <Option key={room._id} value={room._id}>
                                {room.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.List name="items">
                    {(fields, { add, remove }) => (
                        <div
                            style={{
                                display: 'flex',
                                columnGap: 16,
                                rowGap: 16,
                                flexWrap: 'wrap', // Wrap items to next line when modal width is maxed out
                            }}
                        >
                            {fields.map((field) => (
                                <Card
                                    size="small"
                                    title={`Item ${field.name + 1}`}
                                    key={field.key}
                                    style={{ width: itemWidth }}
                                    extra={
                                        <CloseOutlined
                                            onClick={() => handleRemoveItem(remove, field.name)}
                                        />
                                    }
                                >
                                    {/* Chọn ngày chiếu */}
                                    <Form.Item
                                        label="Ngày chiếu"
                                        name={[field.name, 'date']}
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày chiếu!' }]}
                                    >
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            disabledDate={(current) => current && current.isBefore(dayjs(selectedDate), 'day')}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>

                                    {/* Subitem List */}
                                    <Form.List name={[field.name, 'subitems']}>
                                        {(subFields, { add: addSub, remove: removeSub }) => (
                                            <>
                                                {subFields.map((subField) => (
                                                    <Space key={subField.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                                        <Form.Item

                                                            {...subField}
                                                            name={[subField.name, 'movieId']}
                                                            rules={[{ required: true, message: 'Chọn phim!' }]}
                                                        >
                                                            <Select placeholder="Chọn phim">
                                                                {movies.filter((movie) => movie.status === 'playing').map((movie) => (
                                                                    <Option key={movie._id} value={movie._id}>
                                                                        {movie.name.length > 15 ? `${movie.name.slice(0, 15)}...` : movie.name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>

                                                        <Form.Item
                                                            {...subField}
                                                            name={[subField.name, 'time']}
                                                            rules={[{ required: true, message: 'Chọn giờ chiếu!' }]}
                                                        >
                                                            <TimePicker format="HH:mm" placeholder="Giờ chiếu" />
                                                        </Form.Item>

                                                        <CloseOutlined onClick={() => removeSub(subField.name)} />
                                                    </Space>
                                                ))}
                                                <Button type="dashed" onClick={() => addSub()} block>
                                                    + Thêm giờ chiếu
                                                </Button>
                                            </>
                                        )}
                                    </Form.List>
                                </Card>
                            ))}
                            <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                    handleAddItem();

                                }}
                                style={{ width: itemWidth }}
                            >
                                + Thêm Ngày Chiếu
                            </Button>
                        </div>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default CreateMultipleShowtimesModal;
