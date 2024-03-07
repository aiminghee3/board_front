import React, { useState, useRef } from "react";
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Rate } from 'antd';
import { Button, Modal, Space } from 'antd';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

// Step 1. Import prismjs
import prism from 'prismjs';

// Step 2. Import language files of prismjs that you need
import 'prismjs/components/prism-clojure.js';

import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';


const Post = () =>{
    const editorRef = useRef();

    const toolbar =  [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['code', 'codeblock'],
        ['scrollSync']
      ]

    {/** 모달 */}
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
      };
      const handleOk = () => {
        setOpen(false);
      };
    
      const handleCancel = () => {
        setOpen(false);
      };

    const [postData, setPostData] = useState({
        title : '',
        problem_number : '',
        tag : '',
        pronlem_link : '',
        content : '',
        rate : 0
    });
    {/** 별점 */}
    const handleRateChange = (value) => {
        // 선택된 별점 값을 상태로 저장
        setPostData({
            ...postData,
            rate : value,
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
        <div className = "w-full h-full max-w-4xl mx-auto">
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
                id="problem_number"
                name = "problem_number"
                value={postData.problem_number}
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
                id="problem_link"
                name = "problem_link"
                value={postData.problem_link}
                onChange={handleInputChange}
                placeholder="문제 링크를 입력하세요."/>
                <div className = "w-10 border border-gray-700 mb-1"/>

                <div className = "flex h-8 items-center justify-between">
                    <div className = "flex items-center">
                        <div className = "font-medium mr-2">중요도</div>
                        <Rate className = "text-md" onChange={handleRateChange}/>
                    </div>
                    <button onClick={showModal} className = "bg-slate-400 p-1 rounded-lg text-white font-medium mb-1">게시글 작성</button>
                </div>
            </div>
            <Editor
                ref={editorRef}
                onChange={handelContent}
                initialValue=""
                previewStyle="tab" 
                height="600px"
                initialEditType="markdown"
                useCommandShortcut={false}
                toolbarItems={toolbar}
                plugins={[
                    colorSyntax,
                    [codeSyntaxHighlight, { highlighter: prism }]
                ]}
                language="ko-KR"
                
            />

            <Modal
                open={open}
                title="알림사항"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <Button onClick={handleSubmit}>저장</Button>
                    <Button onClick={handleOk}>취소</Button>
                </>
                )}
            >
            <div>게시글을 저장하시겠습니까?</div>
            </Modal>

        </div>
        </>
    )
}

export default Post;