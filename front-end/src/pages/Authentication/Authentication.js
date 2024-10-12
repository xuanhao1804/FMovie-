import React, { useState } from 'react';
import { Form, Input, Button, Tabs, DatePicker, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Carousel } from 'antd'
import './Authentication.scss';

const { TabPane } = Tabs;

export default function Authentication() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('login');

  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Form submitted successfully!');
  };

  const renderLoginForm = () => (
    <Form form={form} name="login" onFinish={onFinish} className="login-form">
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="#" onClick={() => setActiveTab('recover')}>Forgot password</a>
      </Form.Item>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form form={form} name="register" onFinish={onFinish} className="register-form">
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input your Name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[{ required: true, message: 'Please input your Phone Number!' }]}
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
        rules={[
          { required: true, message: 'Please input your Password!' },
          { min: 6, message: 'Password must be at least 6 characters long!' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
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
        <Button type="primary" htmlType="submit" className="register-form-button">
          Register
        </Button>
      </Form.Item>
    </Form>
  );

  const renderRecoverForm = () => (
    <Form form={form} name="recover" onFinish={onFinish} className="recover-form">
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
        <Button type="primary" htmlType="submit" className="recover-form-button">
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