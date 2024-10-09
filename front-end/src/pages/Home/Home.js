import React, { useRef } from 'react';
import { Carousel, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../../../node_modules/antd/dist/antd';
import './Home.scss';

const sliderImageUrl = [
  {
    url: 'https://i2.wp.com/www.geeksaresexy.net/wp-content/uploads/2020/04/movie1.jpg?resize=600%2C892&ssl=1',
  },
  {
    url: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-kids-movies-2020-call-of-the-wild-1579042974.jpg?crop=0.9760858955588091xw:1xh;center,top&resize=480:*',
  },
  {
    url: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-movies-for-kids-2020-sonic-the-hedgehog-1571173983.jpg?crop=0.9871668311944719xw:1xh;center,top&resize=480:*',
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQS82ET2bq9oTNwPOL8gqyoLoLfeqJJJWJmKQ&usqp=CAU',
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTdvuww0JDC7nFRxiFL6yFiAxRJgM-1tvJTxA&usqp=CAU',
  },
];

const carouselimg = [
  {
    url: 'https://www.galaxycine.vn/media/2024/2/22/galaxy-banner-1800x1200px_1708583876401.jpg',
  },
  {
    url: 'https://nativespeaker.vn/uploaded/page_1601_1712215670_1713753865.jpg',
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Uo41ys1S7mFlsPObCnnEQMAiv4hOnf4daQ&s',
  },
  {
    url: 'https://img.freepik.com/premium-vector/movie-cinema-premiere-background_41737-251.jpg',
  },
];

const CustomLeftArrow = ({ onClick }) => (
  <LeftOutlined className="custom-arrow" onClick={onClick} />
);

const CustomRightArrow = ({ onClick }) => (
  <RightOutlined className="custom-arrow" onClick={onClick} />
);

const Home = () => {
  const carouselRef = useRef(null);

  const goToNextSlide = () => {
    carouselRef.current.next();
  };

  const goToPrevSlide = () => {
    carouselRef.current.prev();
  };

  return (
    <div className="home-container">
      <Carousel arrows={true} infinite={false} className="main-carousel">
        {carouselimg.map((imageUrl, index) => (
          <div key={index}>
            <img src={imageUrl.url} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Carousel>
      <Row justify="center">
        <Col span={20}>
          <div className="title-section">
            <div className="line"></div>
            <div>LỰA CHỌN PHIM</div>
            <div className="line"></div>
          </div>
        </Col>
      </Row>


      <Row justify="center">
        <Col span={20}>
          <div className="posters-carousel-wrapper">
            <Carousel
              ref={carouselRef}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              swipeable={true}
              draggable={true}
              dots={true}
              infinite={true}
              arrows={false}
              className="posters-carousel"
            >
              {sliderImageUrl.map((imageUrl, index) => (
                <div key={index} className="carousel-item">
                  <img src={imageUrl.url} alt="movie" />
                  <div className="button-container">
                    <button className="detail-button">CHI TIẾT</button>
                    <button className="booking-button">ĐẶT VÉ</button>
                  </div>
                </div>
              ))}
            </Carousel>
            <div className="arrow-left">
              <CustomLeftArrow onClick={goToPrevSlide} />
            </div>
            <div className="arrow-right">
              <CustomRightArrow onClick={goToNextSlide} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
