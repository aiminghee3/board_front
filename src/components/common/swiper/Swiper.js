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
        <div className = "h-44 p-4">
            <Swiper
            slidesPerView={1}
            spaceBetween={30}
            freeMode={true}
            modules={[FreeMode, Pagination]}
            className="mySwiper bg-gray"
            >
        {loading ? data.map(item => (
            <SwiperSlide>
            {item.sex === 'M' ? (
            <div className = "w-full h-full bg-sky-300 rounded-xl p-2">
                <div className = "w-full h-12 flex items-center">
                    {/**이미지 */}
                    <div className = "w-12 h-12 bg-white p-1 rounded-xl">
                        <img className = "w-full h-full" src = {item.img_link}/>
                    </div>
                    {/**제목, 지역 */}
                    <div className = " w-60 h-full flex flex-col items-start pl-2">
                        <div className = "font-semibold text-white">{item.title}</div>
                        <div className = "text-white">{item.city}</div>
                    </div>
                    <div className = "text-white w-20 h-10">직업 : 학생</div>
                </div>

                {/** 컨텐츠 */}
                <div className = "w-full h-20 mt-1">
                    <p className = "text-start font-semibold text-white h-14">{item.content}</p>
                    <div className = "text-end font-extralight text-white h-6">{item.createdAt}</div>
                </div>

            </div>) : 
            (
                <div className = "w-full h-full bg-rose-300 rounded-xl p-2">
                    <div className = "w-full h-12 flex items-center">
                        {/**이미지 */}
                        <div className = "w-12 h-12 bg-white p-1 rounded-xl">
                            <img className = "w-full h-full" src = {item.img_link}/>
                        </div>
                        {/**제목, 지역 */}
                        <div className = " w-60 h-full flex flex-col items-start pl-2">
                            <div className = "font-semibold text-white">{item.title}</div>
                            <div className = "text-white">{item.city}</div>
                        </div>
                        <div className = "text-white w-20 h-10">직업 : 학생</div>
                    </div>
    
                    {/** 컨텐츠 */}
                    <div className = "w-full h-20 mt-1">
                        <p className = "text-start font-semibold text-white h-14">{item.content}</p>
                        <div className = "text-end font-extralight text-white h-6">{item.createdAt}</div>
                    </div>
    
                </div>)}
            </SwiperSlide>
        )) : <div>loading</div>}
        </Swiper>
        </div>
    </>
    );
}

export default SwiperComponent;