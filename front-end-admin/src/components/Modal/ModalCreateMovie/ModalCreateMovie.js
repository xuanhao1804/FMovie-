import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const CreateMovieModal = ({ isCreateModalOpen, handleCreateCancel, fetchData }) => {
    const [imageFile, setImageFile] = useState(null);
    const [existingGenres, setExistingGenres] = useState([]);
    const [newGenre, setNewGenre] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [actors, setActors] = useState(['']);
    const [form] = Form.useForm();

    const fetchGenres = async () => {
        try {
            const response = await axios.get('http://localhost:9999/movie/get-all');
            const allGenres = response.data.data.flatMap(movie => movie.genres);
            const uniqueGenres = Array.from(new Set(allGenres));
            setExistingGenres(uniqueGenres);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);


    const handleCancel = () => {
        form.resetFields();
        setImageFile(null);
        setActors(['']);
        setNewGenre('');
        setSelectedGenres([]);
        handleCreateCancel();
    };

    const handleCreateOk = async () => {
        try {
            const values = await form.validateFields();
            values.actors = actors.filter(actor => actor);
            values.genres = [...selectedGenres, newGenre].filter(genre => genre); // Combine selected and new genres

            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (Array.isArray(values[key])) {
                    values[key].forEach(value => {
                        formData.append(key, value);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await axios.post('http://localhost:9999/movie/create', formData);
            message.success('Movie created successfully!');
            fetchData();
            handleCancel();

        } catch (error) {
            console.error('Validation Failed:', error);
            message.error('Failed to create movie. Please check your input and try again.');
        }
    };

    const handleImageUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }
        setImageFile(file);
        return false; // Prevent automatic upload
    };

    const addActor = () => {
        setActors([...actors, '']);
    };

    const removeActor = (index) => {
        setActors(actors.filter((_, i) => i !== index));
    };

    const addNewGenre = () => {
        if (newGenre && !existingGenres.includes(newGenre)) {
            setSelectedGenres((prev) => [...prev, newGenre]);
            setNewGenre('');
        } else {
            message.warning('Genre already exists or is empty!');
        }
    };

    return (
        <Modal title="Create Movie" open={isCreateModalOpen} onOk={handleCreateOk} onCancel={handleCancel}>
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Movie Name"
                    rules={[{ required: true, message: 'Please input the movie name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="director"
                    label="Director"
                    rules={[{ required: true, message: 'Please input the director name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Actors">
                    {actors.map((actor, index) => (
                        <Input.Group key={index} compact style={{ marginBottom: 8 }}>
                            <Input
                                style={{ width: 'calc(100% - 120px)' }}
                                placeholder="Enter actor name"
                                value={actor}
                                onChange={(e) => {
                                    const newActors = [...actors];
                                    newActors[index] = e.target.value;
                                    setActors(newActors);
                                }}
                            />
                            <Button type="dashed" onClick={() => removeActor(index)} style={{ width: '120px' }}>
                                Remove
                            </Button>
                        </Input.Group>
                    ))}
                    <Button type="dashed" onClick={addActor} style={{ width: '100%' }}>
                        Add Actor
                    </Button>
                </Form.Item>

                <Form.Item label="Genres">
                    <Select
                        mode="multiple"
                        placeholder="Select genres"
                        value={selectedGenres}
                        onChange={setSelectedGenres}
                        options={existingGenres.map(genre => ({ value: genre, label: genre }))}
                        allowClear
                        showArrow
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="Add new genre"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        style={{ marginTop: 8 }}
                    />
                    <Button type="dashed" onClick={addNewGenre} style={{ width: '100%', marginTop: 8 }}>
                        Add Genre
                    </Button>
                </Form.Item>


                <Form.Item
                    name="studio"
                    label="Studio"
                    rules={[{ required: true, message: 'Please input the studio!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="duration"
                    label="Duration (minutes)"
                    rules={[{ required: true, message: 'Please input the duration!' }]}
                >
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Please input the country!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please input the price!' }]
                    }>
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item
                    name="video"
                    label="Video URL"
                    rules={[{ required: true, message: 'Please input the video URL!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="limit"
                    label="Limit"
                    rules={[{ required: true, message: 'Please input the limit!' }]}
                >
                    <Input type="number" min={0} max={1000} />
                </Form.Item>
                <Form.Item label="Image">
                    <Upload
                        beforeUpload={handleImageUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                    {imageFile && (
                        <div style={{ marginTop: 16 }}>
                            <img src={URL.createObjectURL(imageFile)} alt="uploaded" style={{ width: 100, height: 150 }} />
                            <div>{imageFile.name}</div>
                        </div>
                    )}
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the status!' }]}>
                    <Select placeholder="Select movie status" style={{ width: '100%' }}>
                        <Option value="playing">Playing</Option>
                        <Option value="upcoming">Upcoming</Option>
                        <Option value="not showing">Not Showing</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateMovieModal;
