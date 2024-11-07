import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Tabs, DatePicker, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { createUser, loginUser, saveUserData, setRecoverEmail, sendEmail } from '../../reducers/UserReducer';
import './Authentication.scss';

const { TabPane } = Tabs;

export default function Authentication() {
  const [form] = Form.useForm();
  const [register_form] = Form.useForm();
  const [recover_form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.user.account) {
      window.location.href = '/';
    }
  }, [user])

  const handleSignUp = async (values) => {
    const data = {
      fullname: values.name,
      email: values.email,
      phone: values.phone,
      dob: values.dateOfBirth.$y + '-' + values.dateOfBirth.$M + '-' + values.dateOfBirth.$D,
      password: values.password,
      confirmPassword: values.confirmPassword,
      agreement: values.agreement,
      roles: ['user']
    }
    setLoading(true);
    try {
      const res = await dispatch(createUser(data));
      if (res.payload.errors) {
        message.error(res.payload.errors[0].msg);
      }
      else
      {
        message.success('Đăng ký thành công!');
        register_form.resetFields();
      }
      //reset form fields
    } catch (error) {
      message.error('Đăng ký thất bại, Xin thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values) => {
    const data = {
      email: values.email_login,
      password: values.password_login
    }
    try {
      const rs = await dispatch(loginUser(data));
      if (rs.payload.token) {
        message.success('Đăng nhập thành công!');
        const { password, ...userData } = rs.payload.account;
        dispatch(saveUserData({ account: userData, token: rs.payload.token }));
        // navigate('/')
      }
      else
        message.error('Email hoặc mật khẩu không chính xác!');
    } catch (error) {
      message.error('Đăng nhập thất bại, Xin thử lại.');
    }
  };

  const handlePasswordRecovery = async (values) => {
    setLoading(true);
    try {
      const res = await dispatch(sendEmail({ email: values.recovery_email }));
      if (!res.payload.success) {
        message.error(res.payload.message);
      }
      else {
        dispatch(setRecoverEmail(values.recovery_email));
        window.location.href = '/auth/forgot-password';
      }
    } catch (error) {
      message.error('Mật khẩu không thể khôi phục, Xin thử lại.');
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

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

  const renderLoginForm = () => (
    <Form form={form} name="login" onFinish={handleLogin} className="login-form">
      <Form.Item
        name="email_login"
        rules={[
          { required: true, message: 'Xin nhập email!' },
          { type: 'email', message: 'Xin nhập email đúng dạng!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password_login"
        rules={[{ validator: validatePassword }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật Khẩu" />
      </Form.Item>
      <Form.Item>
        <Button onClick={handleLogin} type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          Đăng nhập
        </Button>
        Hoặc <a href="#" onClick={() => setActiveTab('recover')}>Quên Mật Khẩu</a>
      </Form.Item>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form form={register_form} name="register" onFinish={handleSignUp} className="register-form">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Xin hãy nhập tên của bạn!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: 'Xin hãy nhập số điện thoại!' },
          { pattern: /^\d{10}$/, message: 'Số điện thoại phải đủ 10 chữ số!' }
        ]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Xin hãy nhập email!' },
          { type: 'email', message: 'Xin nhập đúng định dạng email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="dateOfBirth"
        rules={[{ required: true, message: 'Xin nhập ngày sinh!' }]}
      >
        <DatePicker style={{ width: '100%' }} placeholder="Ngày Sinh" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ validator: validatePassword }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Mật Khẩu" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Xin xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('Mật khẩu và Xác nhận mật khẩu không chính xác!');
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Xác Nhận Mật Khẩu" />
      </Form.Item>
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Xin hãy chấp nhận điều khoản sử dụng') },
        ]}
      >
        <Checkbox>Tôi đồng ý với <a href="#">điều khoản sử dụng</a></Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );

  const renderRecoverForm = () => (
    <Form form={recover_form} name="recover" onFinish={handlePasswordRecovery} className="recover-form">
      <Form.Item
        name="recovery_email"
        rules={[
          { required: true, message: 'Please input your Email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="recover-form-button" loading={loading}>
          Gửi Email Khôi Phục Mật Khẩu
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className='authentication-section'>
      <div className="authentication">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Đăng Nhập" key="login">
            {renderLoginForm()}
          </TabPane>
          <TabPane tab="Đăng Ký" key="register">
            {renderRegisterForm()}
          </TabPane>
        </Tabs>
        {activeTab === 'recover' && (
          <div className="recover-container">
            <h2>Khôi phục mật khẩu</h2>
            {renderRecoverForm()}
          </div>
        )}
      </div>
      <div>
        <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp" alt="Authentication" />
      </div>
    </div>
  );
}