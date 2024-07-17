import React, { useState, useRef, useEffect } from "react";
import RequireLoginModal from "../common/RequireLoginModal";
import Cookies from 'js-cookie';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Button, Modal, Space, Select, DatePicker } from 'antd';
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
import {requestPermission} from "../../firebase-messaging-sw";


const Post = () =>{
    const editorRef = useRef();

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
        title : '',
        problem_number : null,
        problem_link : '',
        rate : 0,
        content : null,
        alarm : null,
        tags : [''],
    });

    const handleChange = (value) => {
        setPostData({
            ...postData,
            tags : value.map(String),
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

    const handleProblemNumberChange = (event) => {
        const { name, value } = event.target;
        // 입력 값을 정수로 변환합니다.
        const intValue = value === '' ? '' : parseInt(value, 10);
        setPostData((prevData) => ({
            ...prevData,
            [name]: intValue,
        }));
    };

    //본문
    const handelContent = () =>{
        const content = editorRef.current.getInstance().getMarkdown();
        setPostData({
            ...postData,
            content : content,
        });
    }

    //알람시간
    const handleAlarm = (date, dateString) =>{
        const dateObject = new Date(dateString);
        setPostData({
            ...postData,
            alarm : dateObject,
        });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('accessToken');
        try {
            // POST 요청 보내기
            await axios.post(`${process.env.REACT_APP_BASE_URL}/post`, postData,{
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
    const verifyRefreshToken = async () =>{
        const refreshToken = Cookies.get('refreshToken');
        try{
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });
            if(response.status === 200){
                Cookies.set('accessToken', response.data.accessToken);
            }
            else{
                await setRequireSetLogin(true);
            }
        }catch(error){
            await setRequireSetLogin(true);
            console.error('로그인 검증에 실패하셨습니다.', error);
        }
    }

    //Access토큰 검증
    const verifyAccessToken = async () =>{
        const accessToken = Cookies.get('accessToken');
        try {
            // access 토큰 검증하기
            await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/access`,  {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            //Access토큰 검증 후 실패하면 RefreshToken검증
            await verifyRefreshToken();
        }
    }

    const getFcmToken = () =>{
        const fcmToken = Cookies.get('fcmToken');
        if(!fcmToken){
            const fcmToken = requestPermission();
            Cookies.set('fcmToken', fcmToken);
        }
    }

    useEffect(()=>{
        verifyAccessToken();
        getFcmToken();
    }, [])
   
    return(
        <>
            <div className="w-full h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-80 pt-4 flex flex-col justify-around">
                    <input
                        className="w-full outline-none text-2xl mb-2"
                        type="text"
                        id="title"
                        name="title"
                        value={postData.title}
                        onChange={handleInputChange}
                        placeholder="제목을 입력하세요"
                    />
                    <div className="w-20 border-2 border-gray-700 mt-1 mb-1"/>

                    <input
                        className="w-full outline-none text-lg"
                        type="number"
                        id="problem_number"
                        name="problem_number"
                        value={postData.problem_number}
                        onChange={handleProblemNumberChange}
                        placeholder="문제번호를 입력하세요"/>
                    <div className="w-10 border border-gray-700 mb-1"/>

                    <input
                        className="w-full outline-none text-lg"
                        type="text"
                        id="problem_link"
                        name="problem_link"
                        value={postData.problem_link}
                        onChange={handleInputChange}
                        placeholder="문제 링크를 입력하세요."/>
                    <div className="w-10 border border-gray-700 mb-1"/>

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
                            defaultValue={[]}
                            onChange={handleChange}
                            options={[
                                {value: 1, label: '브루트포스'},
                                {value: 2, label: '그리디'},
                                {value: 3, label: 'BFS'},
                                {value: 4, label: 'DFS'},
                                {value: 5, label: 'DP'},
                                {value: 6, label: '그래프'},
                                {value: 7, label: '정렬'},
                                {value: 8, label: '문자열'},
                                {value: 9, label: '자료구조'},
                                {value: 10, label: '스택'},
                            ]}
                        />
                    </Space>

                    <div className="flex flex-wrap items-center justify-between h-8 mt-4">
                        <div className="flex items-center w-full sm:w-auto">
                            <Space className="h-8 min-w-32"
                                   direction="vertical"
                            >
                                <Select
                                    className="w-full"
                                    mode="single"
                                    allowClear
                                    placeholder="난이도 선택"
                                    defaultValue={['브론즈 5']}
                                    onChange={handleRateChange}
                                    options={[
                                        {value: 1, label: '브론즈 1'},
                                        {value: 2, label: '브론즈 2'},
                                        {value: 3, label: '브론즈 3'},
                                        {value: 4, label: '브론즈 4'},
                                        {value: 5, label: '브론즈 5'},
                                        {value: 6, label: '실버 1'},
                                        {value: 7, label: '실버 2'},
                                        {value: 8, label: '실버 3'},
                                        {value: 9, label: '실버 4'},
                                        {value: 10, label: '실버 5'},
                                        {value: 11, label: '골드 1'},
                                        {value: 12, label: '골드 2'},
                                        {value: 13, label: '골드 3'},
                                        {value: 14, label: '골드 4'},
                                        {value: 15, label: '골드 5'},
                                        {value: 16, label: '플래티넘 1'},
                                        {value: 17, label: '플래티넘 2'},
                                        {value: 18, label: '플래티넘 3'},
                                        {value: 19, label: '플래티넘 4'},
                                        {value: 20, label: '플래티넘 5'},
                                        {value: 21, label: '다이아 1'},
                                        {value: 22, label: '다이아 2'},
                                        {value: 23, label: '다이아 3'},
                                        {value: 24, label: '다이아 4'},
                                        {value: 25, label: '다이아 5'},
                                        {value: 26, label: '루비 1'},
                                        {value: 27, label: '루비 2'},
                                        {value: 28, label: '루비 3'},
                                        {value: 29, label: '루비 4'},
                                        {value: 30, label: '루비 5'},
                                    ]}
                                />
                            </Space>
                            <span className="ml-4">알림설정</span>
                            <Space direction="vertical" size={12}>
                                <DatePicker
                                    format={{
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        type: 'mask',
                                    }}
                                    onChange={handleAlarm}
                                    className="ml-2"
                                />
                            </Space>
                        </div>
                        <Button onClick={showModal} type="primary"
                                className="hidden lg:block bg-slate-400 p-1 rounded-lg text-white font-medium mb-1">게시글
                            작성</Button>

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
                        [codeSyntaxHighlight, {highlighter: prism}]
                    ]}
                    language="ko-KR"

                />
                <div className="lg:hidden bottom-4 right-4">
                    <Button onClick={showModal} type="primary"
                            className="bg-slate-400 p-1 rounded-lg text-white font-medium mt-2 mb-2 float-end">게시글 작성</Button>
                </div>

                <Modal
                    open={open}
                    title="알림사항"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={(_, {OkBtn, CancelBtn}) => (
                        <>
                            <Button onClick={handleSubmit}>저장</Button>
                            <Button onClick={handleOk}>취소</Button>
                        </>
                    )}
                >
                    <div>게시글을 저장하시겠습니까?</div>
                </Modal>
                <RequireLoginModal open={requireLogin}/>
                <SuccessModal open={success}/>

            </div>
        </>
    )
}

export default Post;