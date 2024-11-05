import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ModalEditCinema = ({ isVisible, onCancel, onSuccess, cinema }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [isAddingNewCity, setIsAddingNewCity] = useState(false);

    useEffect(() => {
        // Fetch cities data
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:9999/city/get-all');
                setCities(response.data.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();

        // Set initial form values based on selected cinema
        if (cinema) {
            form.setFieldsValue({
                name: cinema.name,
                address: cinema.address,
                city: cinema.city?._id,
            });
        }
    }, [cinema, form]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                if (isAddingNewCity && newCity) {
                    addNewCityAndUpdateCinema(values);
                } else {
                    updateCinema(values);
                }
            })
            .catch(info => {
                console.log('Validation Failed:', info);
            });
    };

    const addNewCityAndUpdateCinema = async (cinemaData) => {
        setLoading(true);
        try {
            const newCityResponse = await axios.post('http://localhost:9999/city/create', { name: newCity });
            const newCityId = newCityResponse.data._id;
            cinemaData.city = newCityId;
            updateCinema(cinemaData);
        } catch (error) {
            console.error('Error adding new city:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại');
            setLoading(false);
        }
    };

    const updateCinema = async (cinemaData) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:9999/cinema/update/${cinema._id}`, cinemaData);
            message.success('Cập nhật thành công!');
            form.resetFields();
            setLoading(false);
            onSuccess();
        } catch (error) {
            console.error('Error updating cinema:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại');
            setLoading(false);
        }
    };

    const handleCityChange = (value) => {
        if (value === 'new') {
            setIsAddingNewCity(true);
        } else {
            setIsAddingNewCity(false);
        }
    };

    return (
        <Modal
            title="Cập nhật rạp chiếu phim"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
                    Lưu thay đổi
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="edit_cinema_form">
                <Form.Item
                    name="name"
                    label="Tên rạp"
                    rules={[{ required: true, message: 'Vui lòng nhập tên rạp!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="city"
                    label="Tỉnh/thành phố"
                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                >
                    <Select placeholder="Chọn thành phố" onChange={handleCityChange}>
                        {cities?.map(city => (
                            <Option key={city._id} value={city._id}>
                                {city?.name}
                            </Option>
                        ))}
                        <Option value="new">+ Tạo mới</Option>
                    </Select>
                </Form.Item>

                {isAddingNewCity && (
                    <Form.Item
                        label="Tên tỉnh/thành phố"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tỉnh/thành!' }]}
                    >
                        <Input
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            placeholder="Tên tỉnh/thành..."
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default ModalEditCinema;
