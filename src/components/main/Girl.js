import React, { useState } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Swiper from "../common/swiper/Swiper";

const Girl = (props) =>{
    return(
        <>
        <div>
            <div className = "flex w-full h-10 px-4 items-center justify-between">
                <h1 className = "font-semibold text-2xl">여성</h1>
                <div className = "text-gray-400 font-medium">더보기</div>
            </div>
            <Swiper data = {props.data}/>
        </div>
        </>
    )
}
export default Girl;