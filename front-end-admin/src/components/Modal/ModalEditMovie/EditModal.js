import React, { useEffect, useState } from 'react';

import { Modal, Form, Input, Select, Button, message, List, Upload, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import axios from 'axios';
import { isValidUrl } from '../../../utils/UrlValidation';

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
                video: movie.video,
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
            message.success('Phim đã được cập nhật thành công!');
            form.resetFields();
            setImageUrl(null);
            onOk();
            fetchData();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại');
        }
    };

    const addActor = () => {
        if (newActor) {
            setActors([...actors, newActor]);
            setNewActor('');
        } else {
            message.warning('Vui lòng nhập tên diễn viên!');
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
            message.warning('Thể loại này đã được chọn');
        } else {
            message.warning('Vui lòng nhập 1 thể loại');
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
                <Form.Item
                    name="name"
                    label="Tên phim"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên phim!' },
                        { min: 3, message: 'Tên phim phải có độ dài từ 3 đến 50 ký tự' },
                        { max: 50, message: 'Tên phim phải có độ dài từ 3 đến 50 ký tự' },
                    ]}
                >

                    <Input />
                </Form.Item>
                <Form.Item name="director" label="Đạo diễn" rules={[{ required: true, message: 'Vui lòng nhập tên đạo diễn!' }]}>
                    <Input />
                </Form.Item>
                {/* Actors List and Input Field */console.log(movie)}
                <Form.Item label="Diễn viên">
                    <Input
                        value={newActor}
                        placeholder="Tên diễn viên..."
                        onChange={(e) => setNewActor(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="dashed" onClick={addActor} style={{ width: '100%', marginBottom: 8 }}>
                        Thêm diễn viên
                    </Button>
                    <List
                        bordered
                        dataSource={actors}
                        renderItem={(actor, index) => (
                            <List.Item
                                actions={[<Button type="link" onClick={() => removeActor(index)}>Xóa</Button>]}
                            >
                                {actor}
                            </List.Item>
                        )}
                    />
                </Form.Item>
                {/* Genres Selection */}
                <Form.Item label="Chọn thể loại">
                    <Select
                        mode="multiple"
                        placeholder="..."
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
                <Form.Item label="Thêm thể loại">
                    <Input
                        value={newGenre}
                        placeholder="Add a new genre"
                        onChange={(e) => setNewGenre(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="dashed" onClick={addGenre} style={{ width: '100%', marginBottom: 8 }}>
                        Thêm thể loại
                    </Button>
                    <List
                        bordered
                        dataSource={selectedGenres}
                        renderItem={(genre, index) => (
                            <List.Item
                                actions={[<Button type="link" onClick={() => removeGenre(index)}>Xóa</Button>]}
                            >
                                {genre}
                            </List.Item>
                        )}
                    />
                </Form.Item>
                <Form.Item
                    name="studio"
                    label="Nhà sản xuất"
                    rules={[
                        { max: 32, message: 'Tên nhà sản xuất có độ dài tối đa là 32 ký tự' },
                        () => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.resolve("Đang cập nhật");
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="duration"
                    label="Thời lượng (phút)"
                    rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim!' }]
                    }
                >
                    <Input type="number" min={60} max={180} />
                </Form.Item>
                <Form.Item
                    name="country"
                    label="Quốc gia"
                    rules={[
                        { max: 32, message: 'Tên quốc gia có độ dài tối đa là 32 ký tự' },
                        () => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.resolve("Đang cập nhật");
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Giá"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter price" min={0} />
                </Form.Item>
                <Form.Item
                    name="video"
                    label="Trailer"
                    rules={[
                        { required: true, message: 'Vui lòng nhập trailer URL!' },
                        () => ({
                            validator(_, value) {
                                if (isValidUrl(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject(new Error('Vui lòng nhập URL hợp lệ'));
                                }
                            },
                        }),
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="limit"
                    label="Giới hạn độ tuổi"
                    rules={[{ required: true, message: 'Vui lòng nhập độ tuổi giới hạn!' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter limit" min={6} max={18} />
                </Form.Item>

                <Form.Item label="Upload Ảnh"
                    getValueFromEvent={(e) => e && e.fileList}
                    valuePropName="fileList"
                    name="image">
                    <Upload
                        listType="picture"
                        beforeUpload={() => false} // Prevent auto-upload
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                    {imageUrl && (
                        <div style={{ marginTop: 10 }}>
                            <img src={imageUrl} alt="uploaded" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Giơi thiệu nội dung"
                    rules={[
                        { required: true, message: 'Vui lòng nhập giới thiệu nội dung!' },
                        () => ({
                            validator(_, value) {
                                if (value.length > 750 || value.length < 30) {
                                    return Promise.reject(new Error('Nội dung phim cần có độ dài từ 30 đến 750 ký tự. Hiện tại: ' + value.length));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                    <Select>
                        <Option value="playing">Đang chiếu</Option>
                        <Option value="upcoming">Sắp chiếu</Option>
                        <Option value="disable">Không hiển thị</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditModal;
