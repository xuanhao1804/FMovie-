import React, { useEffect, useState } from 'react';

import { Modal, Form, Input, Select, Button, message, List, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import axios from 'axios';

const { Option } = Select;

const EditModal = ({ visible, onCancel, onOk, movie, fetchData, existingGenres }) => {
    const [form] = Form.useForm();
    const [actors, setActors] = useState([]);
    const [newActor, setNewActor] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [newGenre, setNewGenre] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        if (movie) {
            form.setFieldsValue({
                name: movie.name,
                director: movie.director,
                duration: movie.duration,
                price: movie.price,
                country: movie.country,
                studio: movie.studio,
                status: movie.status,
                limit: movie.limit,
                image: movie.image ? [{ url: movie.image }] : [],
                description: movie.description,
            });
            setActors(movie.actors || []);
            setSelectedGenres(movie.genres || []);
            setImageUrl(movie.image);
        }
    }, [movie, form]);

    const handleImageChange = ({ fileList }) => {
        form.setFieldsValue({ image: fileList });
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const url = URL.createObjectURL(fileList[0].originFileObj);
            setImageUrl(url);
        } else {
            setImageUrl(null);
        }
    };

    const handleFinish = async (values) => {
        const updatedMovie = { ...values };

        const formData = new FormData();
        for (const key in updatedMovie) {
            formData.append(key, updatedMovie[key]);
        }

        selectedGenres.forEach((genre) => {
            formData.append('genres[]', genre);
        });

        actors.forEach((actor) => {
            formData.append('actors[]', actor);
        });
        if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
            formData.append('image', values.image[0].originFileObj); // Thêm file vào formData
        }
        try {
            await axios.put(`http://localhost:9999/movie/update/${movie._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Movie updated successfully!');
            form.resetFields();
            setImageUrl(null);
            onOk();
            fetchData();
        } catch (error) {
            message.error('Failed to update movie. Please try again.');
        }
    };

    const addActor = () => {
        if (newActor) {
            setActors([...actors, newActor]);
            setNewActor('');
        } else {
            message.warning('Please enter an actor name!');
        }
    };

    const removeActor = (index) => {
        const updatedActors = actors.filter((_, i) => i !== index);
        setActors(updatedActors);
    };

    const addGenre = () => {
        if (newGenre && !selectedGenres.includes(newGenre)) {
            setSelectedGenres([...selectedGenres, newGenre]);
            setNewGenre('');
        } else if (selectedGenres.includes(newGenre)) {
            message.warning('This genre is already added!');
        } else {
            message.warning('Please enter a genre!');
        }
    };

    const removeGenre = (index) => {
        const updatedGenres = selectedGenres.filter((_, i) => i !== index);
        setSelectedGenres(updatedGenres);
    };

    return (
        <Modal
            title="Edit Movie"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the movie name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="director" label="Director" rules={[{ required: true, message: 'Please input the director name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please input the duration!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please input the country!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="studio" label="Studio" rules={[{ required: true, message: 'Please input the studio!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the status!' }]}>
                    <Select>
                        <Option value="playing">Playing</Option>
                        <Option value="upcoming">Upcoming</Option>
                        <Option value="not playing">Not Playing</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="limit" label="Limit" rules={[{ required: true, message: 'Please input the limit!' }]}>
                    <Input placeholder="Enter limit (e.g., age restriction)" />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Upload Image"
                    getValueFromEvent={(e) => e && e.fileList}
                    valuePropName="fileList"
                    name="image">
                    <Upload
                        listType="picture"
                        beforeUpload={() => false} // Prevent auto-upload
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload New Image</Button>
                    </Upload>
                    {imageUrl && (
                        <div style={{ marginTop: 10 }}>
                            <img src={imageUrl} alt="uploaded" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                        </div>
                    )}
                </Form.Item>


                {/* Genres Selection */}
                <Form.Item label="Select Genres">
                    <Select
                        mode="multiple"
                        placeholder="Select existing genres"
                        value={selectedGenres}
                        onChange={setSelectedGenres}
                        style={{ width: '100%', marginBottom: 8 }}
                    >
                        {existingGenres.map((genre) => (
                            <Option key={genre} value={genre}>{genre}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Add New Genre Input Field */}
                <Form.Item label="Add New Genre">
                    <Input
                        value={newGenre}
                        placeholder="Add a new genre"
                        onChange={(e) => setNewGenre(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="dashed" onClick={addGenre} style={{ width: '100%', marginBottom: 8 }}>
                        Add Genre
                    </Button>
                    <List
                        bordered
                        dataSource={selectedGenres}
                        renderItem={(genre, index) => (
                            <List.Item
                                actions={[<Button type="link" onClick={() => removeGenre(index)}>Remove</Button>]}
                            >
                                {genre}
                            </List.Item>
                        )}
                    />
                </Form.Item>

                {/* Actors List and Input Field */}
                <Form.Item label="Actors">
                    <Input
                        value={newActor}
                        placeholder="Add a new actor"
                        onChange={(e) => setNewActor(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="dashed" onClick={addActor} style={{ width: '100%', marginBottom: 8 }}>
                        Add Actor
                    </Button>
                    <List
                        bordered
                        dataSource={actors}
                        renderItem={(actor, index) => (
                            <List.Item
                                actions={[<Button type="link" onClick={() => removeActor(index)}>Remove</Button>]}
                            >
                                {actor}
                            </List.Item>
                        )}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Update Movie
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditModal;
