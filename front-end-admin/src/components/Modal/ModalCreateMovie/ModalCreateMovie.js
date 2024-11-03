import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Select, Upload, Button, message, InputNumber } from 'antd';

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
            message.success('Tạo mới thành công!');
            fetchData();
            handleCancel();

        } catch (error) {
            console.error('Validation Failed:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại');
        }
    };

    const handleImageUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể thêm file ảnh!');
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
            message.warning('Thể loại đã được sử dụng!');
        }
    };

    return (
        <Modal title="Tạo mới phim" open={isCreateModalOpen} onOk={handleCreateOk} onCancel={handleCancel}>
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên phim"
                    rules={[{ required: true, message: 'Vui lòng nhập tên phim!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="director"
                    label="Đạo diễn"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Diễn viên">
                    {actors.map((actor, index) => (
                        <Input.Group key={index} compact style={{ marginBottom: 8 }}>
                            <Input
                                style={{ width: 'calc(100% - 120px)' }}
                                placeholder="Tên diễn viên"
                                value={actor}
                                onChange={(e) => {
                                    const newActors = [...actors];
                                    newActors[index] = e.target.value;
                                    setActors(newActors);
                                }}
                            />
                            <Button type="dashed" onClick={() => removeActor(index)} style={{ width: '120px' }}>
                                Xóa
                            </Button>
                        </Input.Group>
                    ))}
                    <Button type="dashed" onClick={addActor} style={{ width: '100%' }}>
                        Thêm diễn viên
                    </Button>
                </Form.Item>

                <Form.Item label="Thể loại">
                    <Select
                        mode="multiple"
                        placeholder="Chọn thể loại"
                        value={selectedGenres}
                        onChange={setSelectedGenres}
                        options={existingGenres.map(genre => ({ value: genre, label: genre }))}
                        allowClear
                        showArrow
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="Thể loại mới"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        style={{ marginTop: 8 }}
                    />
                    <Button type="dashed" onClick={addNewGenre} style={{ width: '100%', marginTop: 8 }}>
                        Thêm thể loại mới
                    </Button>
                </Form.Item>


                <Form.Item
                    name="studio"
                    label="Nhà sản xuất"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhà sản xuất!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="duration"
                    label="Thời lượng (phút)"
                    rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
                >
                    <Input type="number" min={0} />
                </Form.Item>
                <Form.Item
                    name="country"
                    label="Quốc gia"
                    rules={[{ required: true, message: 'Vui lòng nhập tên quốc gia!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Giá"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]
                    }>
                    <InputNumber style={{ width: '100%' }} placeholder="Enter price" min={0} />
                </Form.Item>
                <Form.Item
                    name="video"
                    label="Trailer"
                    rules={[{ required: true, message: 'Vui lòng nhập trailer URL!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="limit"
                    label="Giới hạn độ tuổi"
                    rules={[{ required: true, message: 'Vui lòng nhập độ tuổi giới hạn!' }]}
                >

                    <InputNumber style={{ width: '100%' }} placeholder="Enter limit" min={0} max={22} />

                </Form.Item>
                <Form.Item label="Ảnh">
                    <Upload
                        beforeUpload={handleImageUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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
                    label="Giơi thiệu nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập giới thiệu nội dung!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái phim!' }]}>
                    <Select placeholder="Select movie status" style={{ width: '100%' }}>
                        <Option value="playing">Đang chiếu</Option>
                        <Option value="upcoming">Sắp chiếu</Option>
                        <Option value="disable">Không hiển thị</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateMovieModal;
