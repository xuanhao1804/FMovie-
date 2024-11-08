import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Tabs, DatePicker, Checkbox, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { createUser, loginUser, saveUserData, setRecoverEmail, sendEmail, setCredential, setClientId } from '../../reducers/UserReducer';
import { GoogleLogin } from '@react-oauth/google';
import {UserService} from '../../services/UserService'
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
  const [isModalVisible, setIsModalVisible] = useState(false); 
  useEffect(() => {
    if (user.user.account) {
      window.location.href = '/';
    }
  }, [user])

  const handleGoogleLogin = async (response) => {
    const data = {
      credential: response.credential,
    }
    const res = await UserService.signInwithGoogle(data);
    if (res.needInfor) {
      dispatch(setCredential(response.credential));
      dispatch(setClientId(response.clientId));
      navigate('/fill-info')
    }
    else if (res.success) {
      dispatch(saveUserData({ account: res.account, token: res.token }));
    }
    else {
      message.error("Có lỗi xảy ra, vui lòng thử lại.")
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      else {
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
      <Form.Item>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            message.error('Đăng nhập thất bại, vui lòng thử lại.');
          }}
        />
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
        <Checkbox>Tôi đồng ý với <a onClick={showModal} href="#">điều khoản sử dụng</a></Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="register-form-button" loading={loading}>
          Đăng ký
        </Button>
      </Form.Item>
      <Form.Item>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            message.error('Đăng nhập thất bại, vui lòng thử lại.');
          }}
        />
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

      <Modal
        title="Fmovie - Thỏa Thuận Sử Dụng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" type="primary" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        <p>Chào mừng bạn đến với website của Fmovie. Fmovie cung cấp các sản phẩm và dịch vụ dựa trên những điều khoản dưới đây. Khi bạn sử dụng các sản phẩm và dịch vụ do Fmovie cung cấp, bạn đồng ý với những điều khoản sử dụng này. Vui lòng đọc kỹ các điều khoản dưới đây.</p>
        <h4>Bản Quyền:</h4>
        <p>Tất cả nội dung hiển thị trên website và các sản phẩm liên quan của Fmovie đều thuộc sở hữu của Fmovie hoặc các đối tác cung cấp nội dung, được bảo vệ bởi luật pháp Việt Nam và các quy định bản quyền quốc tế.</p>
        <h4>Quyền Truy Cập:</h4>
        <p>Bạn có quyền truy cập và sử dụng các dịch vụ của Fmovie, miễn là bạn tuân thủ các điều khoản này và thanh toán cho bất kỳ dịch vụ bổ sung nào. Quyền truy cập không bao gồm việc sử dụng cho mục đích thương mại.</p>
        <h4>Tài Khoản Của Bạn:</h4>
        <p>Bạn có trách nhiệm bảo mật tài khoản và mật khẩu của mình. Fmovie có quyền từ chối cung cấp dịch vụ hoặc đóng tài khoản nếu bạn không tuân theo các điều khoản này.</p>
        <h4>Bình Luận và Đánh Giá:</h4>
        <p>Khách hàng có thể đăng tải các bình luận hoặc đánh giá miễn là không chứa nội dung bất hợp pháp hoặc gây hại. Fmovie có quyền sử dụng các nội dung mà bạn đăng tải.</p>
        <h4>Thông Tin Phim, Chương Trình, Sự Kiện:</h4>
        <p>Fmovie cung cấp thông tin chính xác về các bộ phim. Nếu có sự cố về đặt chỗ, bạn hãy liên hệ với bộ phận chăm sóc khách hàng của Fmovie để được hỗ trợ.</p>
        <h4>Giá Cả:</h4>
        <p>Mức giá hiển thị cho từng loại sản phẩm là giá bán lẻ cuối cùng, và có thể thay đổi cho đến khi bạn hoàn tất đặt vé.</p>
        <h4>Tình Trạng Chỗ Ngồi:</h4>
        <p>Fmovie không đảm bảo chỗ ngồi bạn chọn chưa được khách khác đặt cho đến khi bạn thanh toán.</p>
        <h4>Trách Nhiệm Pháp Lý:</h4>
        <p>Fmovie không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng các dịch vụ và nội dung của mình.</p>
      </Modal>
    </div>
  );
}