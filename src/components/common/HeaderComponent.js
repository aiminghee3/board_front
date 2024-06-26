import React from "react";
import {Link} from 'react-router-dom';


const Header = () =>{

    return(
        <>
        <div className = "w-full h-16 flex justify-between border border-b border-stone-300">
            <Link to = {"/"} className = "flex items-center w-full h-full pl-6 text-xl font-semibold">Algorithm Review</Link>
            <Link to = {'/mypage'} className = "pr-6 flex items-center h-full">
                <img className = "w-7 h-6" src = "https://cdn-icons-png.flaticon.com/128/747/747376.png"/>
            </Link>
        </div>
        </>
    )
}
export default Header;