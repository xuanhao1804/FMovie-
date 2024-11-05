import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { isValidUrl } from '../../../utils/UrlValidation';

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
            setActors(prevActors => prevActors.filter(actor => actor));
            if (actors.find(actor => actor.length > 32)) {
                message.error("Tên diễn viên có độ dài tối đa là 32 ký tự")
            } else {
                if (actors.length > 5) {
                    message.error("Chỉ có thể thêm tối đa 5 diễn viên")
                } else {
                    if (actors.length === 0) {
                        message.error("Cần ít nhất 1 diễn viên cho phim")
                    } else {
                        if (selectedGenres.find(genre => genre.length > 32)) {
                            message.error("Thể loại phim có độ dài tối đa là 32 ký tự")
                        } else {
                            if (selectedGenres.length === 0) {
                                message.error("Vui lòng chọn 1 thể loại cho phim")
                            } else {
                                if (selectedGenres.length > 5) {
                                    message.error("Chỉ có thể thêm tối đa 5 thể loại")
                                } else {
                                    if (!imageFile) {
                                        message.error("Phim chưa có ảnh, vui lòng tải lên")
                                    } else {
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
        if (newGenre.length > 32) {
            message.error('Thể loại có độ dài tối đa là 32 ký tự');
        } else {
            if (!newGenre.trim()) {
                message.error('Thể loại phim không thể để trống');
            } else {
                if (newGenre && !existingGenres.includes(newGenre)) {
                    setSelectedGenres((prev) => [...prev, newGenre]);
                    setNewGenre('');
                } else {
                    message.warning('Thể loại đã được sử dụng!');
                }
            }
        }
    };

    return (
        <Modal title="Tạo mới phim" open={isCreateModalOpen} onOk={handleCreateOk} onCancel={handleCancel}>
            <Form form={form} layout="vertical">
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
                <Form.Item
                    name="director"
                    label="Đạo diễn"
                    rules={[
                        { max: 32, message: 'Tên đạo diễn có độ dài tối đa là 32 ký tự' },
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
                            {actor.length > 32 &&
                                <span style={{ color: "red" }}>Tên diễn viên có độ dài tối đa là 32 ký tự</span>
                            }
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
