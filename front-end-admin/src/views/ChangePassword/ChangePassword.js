// src/views/ChangePassword/ChangePassword.js
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ChangePassword = () => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:9999/account/change-password', {
        ...values,
        userId: '60d0fe4f5311236168a109ca', // Thay thế bằng userId thực tế
      });
      if (response.data.success) {
        message.success('Password changed successfully');
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to change password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Change Password</h2>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: 'Please enter your new password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;