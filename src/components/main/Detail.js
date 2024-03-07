import React, { useState, useEffect } from "react";
import { Rate } from 'antd';
import { useLocation } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import { Viewer } from '@toast-ui/react-editor';

const Detail = (props) =>{
    const location = useLocation();

    const data = location.state.data;

    useEffect(()=>{
    }, [])
    return(
        <>
        <div className = "h-full max-w-3xl mx-auto">
            <div className = "h-44 w-full border-b-2 p-4">
                <div className = "w-full h-20 flex items-end pb-4">
                    <div className = "text-3xl font-semibold">{data.problem_number}번</div>
                    <div className = "text-3xl ml-2 font-semibold">{data.title}</div>
                </div>

                <div className = "flex w-96 justify-between">
                    <Rate className = "text-md" allowHalf defaultValue={data.rate} disabled/>
                    <div className = "flex">
                    <div>알림 예정일</div>
                    <div className = "ml-2 font-semibold">2023-12-15</div>
                    </div>
                    <a href = {data.problem_link} className = "underline text-gray-500">문제링크</a>
                </div>

                <div className = "h-15 w-full mt-3 flex justify-between items-center">

                    <div className = "flex">
                        <div className = "bg-gray-100 rounded-xl px-3 py-1 flex justify-center items-center mr-2">
                            <div className = "text-green-600">백준</div>
                        </div>
                        <div className = "bg-gray-100 rounded-xl px-3 py-1 flex justify-center items-center">
                            <div className = "text-green-600">프로그래머스</div>
                        </div>
                    </div>

                    <div className = "pt-1 flex w-20 justify-between text-gray-400">
                        <div>수정</div> | <div>삭제</div>
                    </div>
                </div>
            </div>
            <div className = "pt-4 px-2">
                <Viewer
                initialValue={data.content}
                />
            </div>
        </div>
        </>
    )
}
export default Detail;