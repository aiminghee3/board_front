import React, { useState } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';

const Header = () =>{
    return(
        <>
        <div className = "w-full h-16 flex justify-between border border-b border-stone-300">
            <Link to = {"/"} className = "flex items-center w-full h-full pl-6 text-xl font-semibold">LOVETING</Link>
            <button className = "pr-6">
                <img className = "w-7 h-6" src = "https://cdn-icons-png.flaticon.com/128/747/747376.png"/>
            </button>
        </div>
        </>
    )
}
export default Header;