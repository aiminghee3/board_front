import React, { useState, useRef, useEffect } from "react";
import RequireLoginModal from "../common/RequireLoginModal";
import {useLocation} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Rate } from 'antd';
import { Button, Modal, Space, Select } from 'antd';
import SuccessModal from "../common/SuccessModal";
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


const Modify = (props) =>{
    const editorRef = useRef();
    const location = useLocation();
    const data = location.state?.detail;

    const toolbar =  [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['code', 'codeblock'],
        ['scrollSync']
      ]

    //모달
    const [open, setOpen] = useState(false);
    const [requireLogin, setRequireSetLogin] = useState(false);
    const [success, setSuccess] = useState(false)

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
        title : data.title,
        problem_number : data.problem_number,
        problem_link : data.problem_link,
        content : data.content,
        rate : data.rate,
        hashtags : []
    });

    const handleChange = (value) => {
        setPostData({
            ...postData,
            hashtags : value,
        });
      };

    //별점
    const handleRateChange = (value) => {
        // 선택된 별점 값을 상태로 저장
        setPostData({
            ...postData,
            rate : value,
        });
    };
    //제목, 번호, 태그, 링크
    const handleInputChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
      };
    //본문
    const handelContent = () =>{
        const content = editorRef.current.getInstance().getMarkdown();
        setPostData({
            ...postData,
            content : content,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = Cookies.get('accessToken');
        const postId = data.id;
        const userId = data.user.id;
        try {
            // POST 요청 보내기
            await axios.put(`https://${process.env.REACT_APP_BASE_URL}:8080/post/update/${postId}/${userId}`, postData,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
            });
            setSuccess(true) // 게시글 저장 후 모달 띄우기
            setOpen(false) // 게시글을 저장하시겠습니까 닫기
        } catch (error) {
            console.error('POST 요청 에러:', error);
        }
    };

    
    // Refresh토큰 검증
    const verifyRefreshToken = async (refreshToken) =>{
        try{
            const response = await axios.post(`https://${process.env.REACT_APP_BASE_URL}:8080/token/refresh`, null, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });
            if(response.status === 200){
                Cookies.set('accessToken', response.config.headers.Authorization.split(' ')[1]);
            }
            else{
                await setRequireSetLogin(true);
            }
        }catch(error){
            await setRequireSetLogin(true);
            console.error('로그인 토큰 검증에 실패하셨습니다.', error);
        }
    }

    //Access토큰 검증
    const verifyAccessToken = async () =>{
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        try {
            // access 토큰 검증하기
            await axios.post(`https://${process.env.REACT_APP_BASE_URL}:8080/token/access`, null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            //Access토큰 검증 후 실패하면 RefreshToken검증
            verifyRefreshToken(refreshToken);
        }
    }
    useEffect(()=>{
        verifyAccessToken();
    }, [])
   
    return(
        <>
        <div className = "w-full h-full max-w-4xl mx-auto">
            <div className = "h-80 pt-4 flex flex-col justify-around">
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
                id="problem_link"
                name = "problem_link"
                value={postData.problem_link}
                onChange={handleInputChange}
                placeholder="문제 링크를 입력하세요."/>
                <div className = "w-10 border border-gray-700 mb-1"/>
                
                <Space
                    style={{
                    width: '100%',
                    }}
                    direction="vertical"
                >
                    <Select
                    mode="multiple"
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Please select"
                    defaultValue={data.postHashtags.map(item => item.hashtag.tag)}
                    onChange={handleChange}
                    options={[
                        { value: '백준', label: '백준' },
                        { value: '프로그래머스', label: '프로그래머스' },
                        { value: 'DP', label: 'DP' },
                        { value: '브루트포스', label: '브루트포스' },
                        { value: '그리디', label: '그리디' },
                        { value: '그래프', label: '그래프'},
                        { value: '문자열', label: '문자열'},
                        { value: '정렬', label: '정렬'},
                        { value: '스택', label: '스택'},
                        { value: '큐', label: '큐'},
                    ]}
                    />
                </Space>

                <div className = "flex h-8 items-center justify-between">
                    <div className = "flex items-center">
                        <div className = "font-medium mr-2">중요도</div>
                        <Rate className = "text-md" onChange={handleRateChange} defaultValue={data.rate}/>
                    </div>
                    <Button onClick={showModal} type="primary" className = "bg-slate-400 p-1 rounded-lg text-white font-medium mb-1">게시글 수정</Button>
                    
                </div>
            </div>
            <Editor
                ref={editorRef}
                onChange={handelContent}
                initialValue={data.content}
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
            <div>게시글을 수정하시겠습니까?</div>
            </Modal>
            <RequireLoginModal open = {requireLogin}/>
            <SuccessModal open = {success} />
            
        </div>
        </>
    )
}

export default Modify;