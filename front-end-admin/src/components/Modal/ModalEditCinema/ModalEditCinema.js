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
            message.error('Failed to add new city. Please try again.');
            setLoading(false);
        }
    };

    const updateCinema = async (cinemaData) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:9999/cinema/update/${cinema._id}`, cinemaData);
            message.success('Cinema updated successfully!');
            form.resetFields();
            setLoading(false);
            onSuccess();
        } catch (error) {
            console.error('Error updating cinema:', error);
            message.error('Failed to update cinema. Please try again.');
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
            title="Edit Cinema"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
                    Save Changes
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="edit_cinema_form">
                <Form.Item
                    name="name"
                    label="Cinema Name"
                    rules={[{ required: true, message: 'Please input the name of the cinema!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input the address!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'Please select or add a city!' }]}
                >
                    <Select placeholder="Select a city" onChange={handleCityChange}>
                        {cities?.map(city => (
                            <Option key={city._id} value={city._id}>
                                {city?.name}
                            </Option>
                        ))}
                        <Option value="new">+ Add New City</Option>
                    </Select>
                </Form.Item>

                {isAddingNewCity && (
                    <Form.Item
                        label="New City Name"
                        rules={[{ required: true, message: 'Please input the name of the new city!' }]}
                    >
                        <Input
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            placeholder="Enter the new city name"
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default ModalEditCinema;
