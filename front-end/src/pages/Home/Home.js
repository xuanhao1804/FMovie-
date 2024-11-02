import React, { useRef, useEffect } from 'react';
import { Carousel, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies } from "../../reducers/MovieReducer";
import { fetchCarousels } from "../../reducers/CarouselReducer";
import { useNavigate } from 'react-router-dom'; 
import FilmsCard from '../../components/FilmsCard/FilmsCard';
import './Home.scss';


const CustomLeftArrow = ({ onClick }) => (
  <LeftOutlined className="custom-arrow arrow-left" onClick={onClick} />
);

const CustomRightArrow = ({ onClick }) => (
  <RightOutlined className="custom-arrow arrow-right" onClick={onClick} />
);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const mainCarouselRef = useRef(null);
  const postersCarouselRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchCarousels());
  }, [dispatch]);

  const carousels = useSelector((state) => state.carousels?.carousels || []);
  const moviesState = useSelector((state) => state.movies);

  const goToNextMainSlide = () => {
    if (mainCarouselRef.current) {
      mainCarouselRef.current.next();
    }
  };

  const goToPrevMainSlide = () => {
    if (mainCarouselRef.current) {
      mainCarouselRef.current.prev();
    }
  };

  const goToNextPosterSlide = () => {
    if (postersCarouselRef.current) {
      postersCarouselRef.current.next();
    }
  };

  const goToPrevPosterSlide = () => {
    if (postersCarouselRef.current) {
      postersCarouselRef.current.prev();
    }
  };

  const handleCarouselClick = (carousel) => {
    console.log('Carousel clicked:', carousel);
    if (carousel.linkType === 'movie' && carousel.linkUrl) {
      // Thay thế `navigate` bằng `window.location.href`
      window.location.href = carousel.linkUrl;
    } else if (carousel.linkType === 'external' && carousel.linkUrl) {
      window.open(carousel.linkUrl, '_blank');
    } else {
      console.log('No valid link found for this carousel item');
    }
  };
  
  
  
  
  
  

  return (
    <div className="home-container">
      <div className="main-carousel-wrapper">
      <Carousel ref={mainCarouselRef} arrows={false} infinite={true} className="main-carousel">
  {carousels.map((carousel, index) => (
    <div
      key={index}
      onClick={() => handleCarouselClick(carousel)}
      style={{ cursor: 'pointer' }}
    >
      <img src={carousel.imageUrl} alt={`Slide ${index + 1}`} />
    </div>
  ))}
</Carousel>

        <div className="arrow-left">
          <CustomLeftArrow onClick={goToPrevMainSlide} />
        </div>
        <div className="arrow-right">
          <CustomRightArrow onClick={goToNextMainSlide} />
        </div>
      </div>

      <Row justify="center">
        <Col xs={24} sm={24} md={20}>
          <div className="title-section">
            <div className="line"></div>
            <div>LỰA CHỌN PHIM</div>
            <div className="line"></div>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={24} md={20}>
          <div className="posters-carousel-wrapper">
            <Carousel
              ref={postersCarouselRef}
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
              {moviesState?.playingMovies?.map((item, index) => (
                <div className='px-4' key={index}>
                  <FilmsCard _id={item._id} image={item.image} limit={item.limit} star={item.rating} video={item.video} />
                </div>
              ))}
            </Carousel>
            <div className="arrow-left posters-arrow">
              <CustomLeftArrow onClick={goToPrevPosterSlide} />
            </div>
            <div className="arrow-right posters-arrow">
              <CustomRightArrow onClick={goToNextPosterSlide} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
