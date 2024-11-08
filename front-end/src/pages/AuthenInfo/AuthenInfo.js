import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/UserService';
import { saveUserData, setCredential, setClientId } from '../../reducers/UserReducer';
// import { updateUserInfo } from '../../reducers/UserReducer';
import './AuthenInfo.scss';

export default function AuthenInfo() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    if (!user.clientId || !user.credential) {
        navigate('auth/sign-in');
    }

    const handleSubmit = async (values) => {
        const data = {
            phone: values.phone,
            dob: values.dateOfBirth.format('YYYY-MM-DD'),
            credential: user.credential,
            clientId: user.clientId
        }
        const res = await UserService.signInwithGoogle(data);
        if (res.success) {
            dispatch(saveUserData({ account: res.account, token: res.token }));
            dispatch(setCredential(""));
            dispatch(setClientId(""));
            navigate('/');
        }
        else {
            message.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const validatePhone = (_, value) => {
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(value)) {
            return Promise.reject('Số điện thoại phải đủ 10 chữ số!');
        }
        return Promise.resolve();
    };

    return (
        <div className='authen-info-section'>
            <div className="authen-info-image">
                <img src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x1.webp" alt="Authen Info" />
            </div>
            <div className="authen-info">
                <h2>Thông Tin Bổ Sung</h2>
                <Form form={form} name="authenInfo" onFinish={handleSubmit} className="authen-info-form">
                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Xin hãy nhập số điện thoại!' },
                            { validator: validatePhone }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Số Điện Thoại" />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        rules={[{ required: true, message: 'Xin hãy chọn ngày sinh!' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Ngày Sinh"
                            prefix={<CalendarOutlined />}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="authen-info-button" loading={loading}>
                            Cập Nhật
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}