import React, { useState, useRef, useEffect } from "react";
import RequireLoginModal from "../common/RequireLoginModal";
import {useLocation} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import {DatePicker, Rate} from 'antd';
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


const Modify = () =>{
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
        rate : data.rate,
        content : data.content,
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
        const intValue = value ? parseInt(value, 10) : 0;
        setPostData({
            ...postData,
            rate: intValue
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
            await axios.put(`${process.env.REACT_APP_BASE_URL}/post/${data.id}`, postData,{
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
                        type="text"
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

                    <div className="flex flex-wrap items-center justify-between mt-4 relative">
                        <div className="flex items-center w-full sm:w-auto">
                            <Space className="h-8 min-w-32"
                                   direction="vertical"
                            >
                                <Select
                                    className="w-full"
                                    allowClear
                                    placeholder="난이도 선택"
                                    onChange={handleRateChange}
                                    options={[
                                        {value: 1, label: '브론즈 5'},
                                        {value: 2, label: '브론즈 4'},
                                        {value: 3, label: '브론즈 3'},
                                        {value: 4, label: '브론즈 2'},
                                        {value: 5, label: '브론즈 1'},
                                        {value: 6, label: '실버 5'},
                                        {value: 7, label: '실버 4'},
                                        {value: 8, label: '실버 3'},
                                        {value: 9, label: '실버 2'},
                                        {value: 10, label: '실버 1'},
                                        {value: 11, label: '골드 5'},
                                        {value: 12, label: '골드 4'},
                                        {value: 13, label: '골드 3'},
                                        {value: 14, label: '골드 2'},
                                        {value: 15, label: '골드 1'},
                                        {value: 16, label: '플래티넘 5'},
                                        {value: 17, label: '플래티넘 4'},
                                        {value: 18, label: '플래티넘 3'},
                                        {value: 19, label: '플래티넘 2'},
                                        {value: 20, label: '플래티넘 1'},
                                        {value: 21, label: '다이아 5'},
                                        {value: 22, label: '다이아 4'},
                                        {value: 23, label: '다이아 3'},
                                        {value: 24, label: '다이아 2'},
                                        {value: 25, label: '다이아 1'},
                                        {value: 26, label: '루비 5'},
                                        {value: 27, label: '루비 4'},
                                        {value: 28, label: '루비 3'},
                                        {value: 29, label: '루비 2'},
                                        {value: 30, label: '루비 1'},
                                    ]}
                                />
                            </Space>
                            <div className="ml-4 hidden md:block">알림설정</div>
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
                                className="hidden lg:block bg-slate-400 p-1 rounded-lg text-white font-medium mb-1">게시글 수정</Button>

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
                        [codeSyntaxHighlight, {highlighter: prism}]
                    ]}
                    language="ko-KR"

                />
                <Button onClick={showModal} type="primary"
                        className="block md:hidden bg-slate-400 p-1 rounded-lg text-white font-medium mt-2 mb-2 float-end">게시글 수정</Button>
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
                <div>게시글을 수정하시겠습니까?</div>
            </Modal>
            <RequireLoginModal open={requireLogin}/>
            <SuccessModal open={success}/>

        </div>
        </>
    )
}

export default Modify;