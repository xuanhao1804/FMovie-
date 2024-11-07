import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ModalEditPopcorn = ({ isVisible, onCancel, onSuccess, popcorn }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);

    // Cập nhật form khi popcorn được thay đổi
    useEffect(() => {
        if (popcorn) {
            form.setFieldsValue({
                name: popcorn.name,
                description: popcorn.description,
                price: popcorn.price,
                image: popcorn.image ? [{ url: popcorn.image }] : [],
            });
            setImageUrl(popcorn.image); // Cập nhật hình ảnh hiện có
        }
    }, [popcorn, form]);

    const handleOk = () => {
        form.submit();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id', popcorn._id); // Thêm ID vào formData
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('price', values.price);

            if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
                formData.append('image', values.image[0].originFileObj); // Append file to formData
            } else {
                // Handle case where no image is uploaded
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
        form.setFieldsValue({ image: fileList }); // Cập nhật form với fileList
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
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    Save Changes
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
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false} // Ngăn upload ngay lập tức
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

export default ModalEditPopcorn;
