import React, { useState, useRef } from "react";
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Rate } from 'antd';


const Post = () =>{
    const editorRef = useRef();

    const [rateValue, setRateValue] = useState(0);
    const [postData, setPostData] = useState({
        title : '',
        number : '',
        tag : '',
        link : '',
        content : '',
        rateValue : 0
    });
    {/** 별점 */}
    const handleRateChange = (value) => {
        // 선택된 별점 값을 상태로 저장
        setRateValue(value);
        setPostData({
            ...postData,
            rateValue : value,
        });
    };
    {/**제목, 번호, 태그, 링크 */}
    const handleInputChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
      };
    {/**본문 */}
    const handelContent = () =>{
        const content = editorRef.current.getInstance().getMarkdown();
        setPostData({
            ...postData,
            content : content,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = Cookies.get('token');
        console.log(postData)
        try {
            // POST 요청 보내기
            const response = await axios.post('http://localhost:8080/post/store', postData,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
            console.log('POST 요청 응답:', response.data);
        } catch (error) {
            console.error('POST 요청 에러:', error);
        }
    };
    return(
        <>
        <div className = "w-full h-full max-w-6xl mx-auto">
            <div className = "h-56 pt-4 flex flex-col justify-around">
                <input
                className = "w-full outline-none text-2xl"
                type="text"
                id="title"
                name = "title"
                value={postData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력하세요"/>
                <div className = "w-20 border-2 border-gray-700 mt-1 mb-1"/>

                <input
                className = "w-full outline-none text-lg"
                type="text"
                id="number"
                name = "number"
                value={postData.number}
                onChange={handleInputChange}
                placeholder="문제번호를 입력하세요"/>
                <div className = "w-10 border border-gray-700 mb-1"/>

                <input
                className = "w-full outline-none text-lg"
                type="text"
                id="tag"
                name = "tag"
                value={postData.tag}
                onChange={handleInputChange}
                placeholder="태그를 입력하세요 ex) DP"/>
                <div className = "w-10 border border-gray-700 mb-1"/>

                <input
                className = "w-full outline-none text-lg"
                type="text"
                id="link"
                name = "link"
                value={postData.link}
                onChange={handleInputChange}
                placeholder="문제 링크를 입력하세요."/>
                <div className = "w-10 border border-gray-700 mb-1"/>

                <div className = "flex h-8 items-center justify-between">
                    <div className = "flex items-center">
                        <div className = "font-medium mr-2">중요도</div>
                        <Rate className = "text-md" onChange={handleRateChange}/>
                    </div>
                    <button onClick={handleSubmit} className = "bg-slate-400 p-1 rounded-lg text-white font-medium mb-1">게시글 작성</button>
                </div>
            </div>
            <Editor
                ref={editorRef}
                onChange={handelContent}
                initialValue="여기에 리뷰를 작성해주세요."
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                useCommandShortcut={false}
            />
        </div>
        </>
    )
}

export default Post;