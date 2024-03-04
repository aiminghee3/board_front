import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './swiper.css';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

const SwiperComponent = (props) =>{

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setData(props.data)
        setLoading(true)
    },[])

    return (
    <>
        <div className = "h-40 bg-gray">
            <Swiper
            slidesPerView={3}
            spaceBetween={30}
            freeMode={true}
            modules={[FreeMode, Pagination]}
            className="mySwiper bg-gray"
            >
        {loading ? data.map(item => (
            <SwiperSlide>
            <div className = "w-20 h-20 flex flex-col justify-center">
                <img src = {item.img_link} className = "w-full h-full"/>
                <div>{item.title}</div>
            </div>
            </SwiperSlide>
        )) : <div>loading</div>}
        </Swiper>
        </div>
    </>
    );
}

export default SwiperComponent;