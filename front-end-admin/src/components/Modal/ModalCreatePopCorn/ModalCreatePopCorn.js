import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ModalCreatePopcorn = ({ isVisible, onCancel, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);

    const handleOk = () => {
        form.submit();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price);
            if (values.image && values.image.file) {
                formData.append('image', values.image.file);
            }

            await axios.post('http://localhost:9999/popcorn/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Popcorn created successfully!');
            form.resetFields();
            setImageUrl(null);
            onSuccess();
        } catch (error) {
            console.error('Error creating popcorn:', error);
            message.error('Failed to create popcorn. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            const url = URL.createObjectURL(info.file.originFileObj);
            setImageUrl(url);
        }
    };

    return (
        <Modal
            visible={isVisible}
            title="Create Popcorn"
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    Create
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the name!' }]}
                >
                    <Input placeholder="Enter popcorn name" />
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="image"
                    valuePropName="file"
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={handleImageChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                    {imageUrl && (
                        <div style={{ marginTop: 10 }}>
                            <img src={imageUrl} alt="uploaded" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter the description!' }]}
                >
                    <Input placeholder="Enter description" />
                </Form.Item>

                <Form.Item
                    label="Price (VND)"
                    name="price"
                    rules={[{ required: true, message: 'Please enter the price!' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Enter price" min={0} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreatePopcorn;
