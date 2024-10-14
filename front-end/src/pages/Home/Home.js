import React, { useRef } from 'react';
import { Carousel, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../../../node_modules/antd/dist/antd';
import './Home.scss';
import { useSelector, useDispatch } from "react-redux";
import FilmsCard from '../../components/FilmsCard/FilmsCard';
import { fetchMovies } from "../../reducers/MovieReducer"
import { useState } from "react"


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
  const dispatch = useDispatch();

  useState(() => {
    dispatch(fetchMovies());
  }, [])
  const state = useSelector((state) => state);

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

              {state.movies?.playingMovies?.map((item, index) => {
                return (
                  <FilmsCard _id={item._id} image={item.image} limit={item.limit} star={item.star} video={item.video} />
                )
              })
              }
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
