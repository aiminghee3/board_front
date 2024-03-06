import React, { useState } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Rate } from 'antd';

const Main = () =>{

    const data = [
        { id: 1, number : 1234, title : '뿌요뿌요', content: 'Item 1' },
        { id: 2, number : 5557, title : '뿌요뿌요', content: 'Item 2' },
        { id: 3, number : 231, title : '뿌요뿌요', content: 'Item 3' },
        { id: 4, number : 5183, title : '뿌요뿌요', content: 'Item 4' },
        { id: 5, number : 2841, title : '뿌요뿌요', content: 'Item 5' },
        { id: 6, number : 1295, title : '뿌요뿌요', content: 'Item 6' },
        { id: 7, number : 3852, title : '뿌요뿌요', content: 'Item 7' },
        // ... 계속해서 데이터를 추가
      ];
    const tag = [
        { id: 1, tag: '전체' },
        { id: 1, tag: '프로그래머스' },
        { id: 1, tag: '백준' },
        { id: 1, tag: 'DP' },
        { id: 1, tag: '그리디' },
        { id: 1, tag: '투포인터' },
        { id: 1, tag: '그래프' },
        // ... 계속해서 데이터를 추가
      ];
    
    const [rateValue, setRateValue] = useState(0);

    const handleRateChange = (value) => {
        // 선택된 별점 값을 상태로 저장
        setRateValue(value);
        console.log(value)
    };

    return(
        <>
            <div className = "w-full h-20 pl-1 mb-2">
                <div className = "flex w-full justify-between">
                    <div className = "text-gray-700 mb-2 text-lg">태그목록</div>
                    <Link to = {"/write"} className = "mr-2 border-b">글 작성하기</Link>
                </div>
            <div className = "flex">
                {tag.map((item) => (
                    <div key = {item.id} className = "bg-gray-200 rounded-3xl p-1 mr-2">
                        <button className = "font-light text-gray-700">{item.tag}</button>
                    </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {data.map((item) => (
                    <div key={item.id} className="col-span-1 p-2 bg-white h-32 w-full border border-gray-400 rounded-xl">

                    <div className = "flex justify-around items-center w-full h-10">
                        <div className = "font-normal text-xl mr-2">{item.number}번</div>
                        <Rate className = "text-md" onChange={handleRateChange}/>
                    </div>
                    
                    <div className = "h-10 w-full pl-2">
                        <div className = "font-normal text-xl text-gray-700">{item.title}</div>
                    </div>

                    </div>
                ))}
            <Link to = {"/write"} className="w-14 h-14 rounded-xl flex fixed justify-end bottom-5 right-44 mb-7 z-10 bg-white align-middle">
                <img src = "https://img.icons8.com/?size=80&id=CoTsnH1VAqb5&format=png" className = "w-full h-full"/>
            </Link>
            </div>

        </>
    )
}
export default Main;