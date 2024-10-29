import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Tabs, DatePicker, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, loginUser, saveUserData } from '../../reducers/UserReducer';
import { useNavigate } from "react-router-dom"
import './Authentication.scss';

const { TabPane } = Tabs;

export default function Authentication() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    if (user.user.account) {
      window.location.href = '/';
    }
  }, [user])

  const dispatch = useDispatch();

  const handleSignUp = async (values) => {
    const data = {
      fullname: values.name,
      email: values.email,
      phone: values.phone,
      dob: values.dateOfBirth.$y + '-' + values.dateOfBirth.$M + '-' + values.dateOfBirth.$D,
      password: values.password,
      confirmPassword: values.confirmPassword,
      agreement: values.agreement,
      role: 'user'
    }
    setLoading(true);
    try {
      await dispatch(createUser(data));
      message.success('User registered successfully!');
      //reset form fields
      form.resetFields();
    } catch (error) {
      message.error('Registration failed. Please try again.');
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
        message.success('Login successful!');
        const { password, ...userData } = rs.payload.account;
        dispatch(saveUserData({ account: userData, token: rs.payload.token }));
        navigate(-1)
      }
      else
        message.error('Email or password is incorrect');
    } catch (error) {
      message.error('Login failed. Please try again.');
    }
  };

  const handlePasswordRecovery = async (values) => {
    setLoading(true);
    // Implement actual password recovery logic here
    console.log('Password recovery for:', values.email);
    setLoading(false);
    message.info('Password recovery instructions sent to your email.');
  };

  const validatePassword = (_, value) => {
    const strongPassword = /^.{8,}$/;
    if (!value) {
      return Promise.reject('Please input your password!');
    }
    if (!strongPassword.test(value)) {
      return Promise.reject('Password must be at least 8 characters long');
    }
    return Promise.resolve();
  };

  const renderLoginForm = () => (
    <Form form={form} name="login" onFinish={handleLogin} className="login-form">
      <Form.Item
        name="email_login"
        rules={[
          { required: true, message: 'Please input your Email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password_login"
        rules={[{ validator: validatePassword }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          Log in
        </Button>
        Or <a href="#" onClick={() => setActiveTab('recover')}>Forgot password</a>
      </Form.Item>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form form={form} name="register" onFinish={handleSignUp} className="register-form">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input your Name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[
          { required: true, message: 'Please input your Phone Number!' },
          { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number!' }
        ]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your Email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="dateOfBirth"
        rules={[{ required: true, message: 'Please select your Date of Birth!' }]}
      >
        <DatePicker style={{ width: '100%' }} placeholder="Date of Birth" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ validator: validatePassword }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('The two passwords do not match!');
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
      </Form.Item>
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Please accept the terms of use') },
        ]}
      >
        <Checkbox>I agree to the <a href="#">Terms of Use</a></Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );

  const renderRecoverForm = () => (
    <Form form={form} name="recover" onFinish={handlePasswordRecovery} className="recover-form">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your Email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="recover-form-button" loading={loading}>
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className='authentication-section'>
      <div className="authentication">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Login" key="login">
            {renderLoginForm()}
          </TabPane>
          <TabPane tab="Register" key="register">
            {renderRegisterForm()}
          </TabPane>
        </Tabs>
        {activeTab === 'recover' && (
          <div className="recover-container">
            <h2>Recover Password</h2>
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