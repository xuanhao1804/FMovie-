import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {UserService} from '../../services/UserService'
import './ChangePass.scss';
import { useSelector } from 'react-redux';

const ChangePass = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [form] = Form.useForm(); 
  const validatePassword = (_, value) => {
    const strongPassword = /^.{8,}$/;
    if (!value) {
      return Promise.reject('Xin nhập mật khẩu!');
    }
    if (!strongPassword.test(value)) {
      return Promise.reject('Mật khẩu phải chứa ít nhất 8 ký tự!');
    }
    return Promise.resolve();
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    const data = {
      currentPassword: values.oldPassword,
      newPassword: values.newPassword,
      userId: user?.user?.account?._id,
    }
    const res = await UserService.changePassword(data);
  
    if (res.success) {
      message.success('Đổi mật khẩu thành công!');
      form.resetFields();
      setLoading(false);
    }
    else {
      message.error(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="change-pass-container">
      <h2>Đổi Mật Khẩu</h2>
      <Form form={form} onFinish={handleChangePassword} className="change-pass-form">
        <Form.Item
          name="oldPassword"
          rules={[{ required: true, message: 'Xin nhập mật khẩu cũ!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu cũ" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[{ validator: validatePassword }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Xin xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Mật khẩu xác nhận không khớp!');
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="change-pass-button" loading={loading}>
            Đổi Mật Khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePass;
