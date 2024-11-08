import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ModalEditPopcorn = ({ isVisible, onCancel, onSuccess, popcorn }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (popcorn) {
            form.setFieldsValue({
                name: popcorn.name,
                description: popcorn.description,
                price: popcorn.price,
                image: popcorn.image ? [{ url: popcorn.image }] : [],
                status: popcorn.status
            });
            setImageUrl(popcorn.image);
        }
    }, [popcorn, form]);

    const handleOk = () => {
        form.submit();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id', popcorn._id);
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('status', values.status);

            if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
                formData.append('image', values.image[0].originFileObj);
            }

            await axios.post(`http://localhost:9999/popcorn/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Popcorn updated successfully!');
            form.resetFields();
            setImageUrl(null);
            onSuccess();
        } catch (error) {
            console.error('Error updating popcorn:', error);
            message.error('Failed to update popcorn. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = ({ fileList }) => {
        form.setFieldsValue({ image: fileList });
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const url = URL.createObjectURL(fileList[0].originFileObj);
            setImageUrl(url);
        } else {
            setImageUrl(null);
        }
    };

    return (
        <Modal
            visible={isVisible}
            title="Edit Popcorn"
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    Lưu thay đổi
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the name!' }]}
                >
                    <Input placeholder="Điền tên bỏng nước" />
                </Form.Item>

                <Form.Item
                    label="Ảnh"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload Ảnh mới</Button>
                    </Upload>
                    {imageUrl && (
                        <div style={{ marginTop: 10 }}>
                            <img src={imageUrl} alt="uploaded" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Hãy điền mô tả!' }]}
                >
                    <Input placeholder="Điền mô tả" />
                </Form.Item>

                <Form.Item
                    label="Giá tiền (VND)"
                    name="price"
                    rules={[{ required: true, message: 'Hãy điền giá tiền!' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter price" min={0} />
                </Form.Item>
                
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái bỏng nước!' }]}
                >
                    <Select placeholder="Chọn trạng thái bỏng nước" style={{ width: '100%' }}>
                        <Option value="active"> Hoạt động</Option>
                        <Option value="inactive">Không hoạt động</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditPopcorn;
