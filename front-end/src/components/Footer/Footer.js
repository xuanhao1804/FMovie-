import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, YoutubeOutlined, InstagramOutlined } from '@ant-design/icons';
import './Footer.scss';
import logo from "../../assets/icon/logo.png"

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const CustomFooter = () => {
  return (
    <Footer className="footer">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>FMOVIE Việt Nam</Title>
          <ul className="footer-list">
            <li><Link href="#">Giới Thiệu</Link></li>
            <li><Link href="#">Tiện Ích Online</Link></li>
            <li><Link href="#">Thẻ Quà Tặng</Link></li>
            <li><Link href="#">Tuyển Dụng</Link></li>
            <li><Link href="#">Liên Hệ Quảng Cáo FMOVIE</Link></li>
            <li><Link href="#">Dành cho đối tác</Link></li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>Điều khoản sử dụng</Title>
          <ul className="footer-list">
            <li><Link href="#">Điều Khoản Chung</Link></li>
            <li><Link href="#">Điều Khoản Giao Dịch</Link></li>
            <li><Link href="#">Chính Sách Thanh Toán</Link></li>
            <li><Link href="#">Chính Sách Bảo Mật</Link></li>
            <li><Link href="#">Câu Hỏi Thường Gặp</Link></li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>Kết nối với chúng tôi</Title>
          <Space size="middle">
            <FacebookOutlined className="social-icon" />
            <YoutubeOutlined className="social-icon" />
            <InstagramOutlined className="social-icon" />
          </Space>
          <img style={{marginTop:"20px"}} src="http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png" alt="Bộ Công Thương" className="footer-cert" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>Chăm sóc khách hàng</Title>
          <Text>Hotline: 1900 6017</Text>
          <br />
          <Text>Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết)</Text>
          <br />
          <Text>Email hỗ trợ: hoidap@fmovie.vn</Text>
        </Col>
      </Row>
      <Row className="mt-32">
        <Col span={24} className='footer-intro'>
          <img src={logo} alt="CJ FMOVIE Logo" className="company-logo " />
          <Text style={{marginLeft:"20px"}} className="company-info">
            CÔNG TY TNHH CJ FMOVIE VIỆT NAM
            <br />
            Giấy Chứng nhận đăng ký doanh nghiệp: 0303675393 đăng ký lần đầu ngày 31/7/2008, được cấp bởi Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh
            <br />
            Địa chỉ: Lầu 2, số 7/28, Đường Thành Thái, Phường 14, Quận 10, Thành phố Hồ Chí Minh, Việt Nam
            <br />
            Đường dây nóng (Hotline): 1900 6017
            <br />
            COPYRIGHT 2017 CJ FMOVIE VIETNAM CO., LTD. ALL RIGHTS RESERVED
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;