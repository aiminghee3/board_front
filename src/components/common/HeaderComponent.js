import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () =>{
    const navigate = useNavigate();

    const movePage = () =>{
        const token = Cookies.get('token');
        if(!token){
            navigate('/login');
        }
        else{
            navigate('/mypage');
        }
    }
    return(
        <>
        <div className = "w-full h-16 flex justify-between border border-b border-stone-300">
            <Link to = {"/"} className = "flex items-center w-full h-full pl-6 text-xl font-semibold">Argorithm Review</Link>
            <button onClick = {movePage} className = "pr-6 flex items-center h-full">
                <img className = "w-7 h-6" src = "https://cdn-icons-png.flaticon.com/128/747/747376.png"/>
            </button>
        </div>
        </>
    )
}
export default Header;