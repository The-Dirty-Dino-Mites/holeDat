import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper';
import { Link } from 'react-router-dom'

import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PImageSlider = () => {
  type phImg = {
    image_id: number;
    photoURL: string;
    caption: string;
    createdAt: string;
    updatedAt: string;
    pothole_id: number
  };

  const [PImages, setPImages] = useState<phImg[]>([]);

  const getAllImgs = () => {
    axios
      .get('/api/imgs')
      .then((data) => setPImages(data.data))
      .catch((err) => console.log(err));
  };


  useEffect(getAllImgs, []);

  return (
    <>
      <Swiper
        id='potholeSlider'
        loop={true}
        grabCursor={true}
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className='mySwiper'
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
      >
        {PImages.map((image) => {
          return (
            <SwiperSlide
              key={image.image_id}
            >
              <div className='pothole-slider'>
                <Link
                  to={`/Pothole:${image.pothole_id}`}>
                  <img src={image.photoURL} />
                  <p>{image.caption}</p>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default PImageSlider;
