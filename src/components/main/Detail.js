import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Viewer } from '@toast-ui/react-editor';
import {Button, Modal} from 'antd';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Comment from '../posting/Comment';

const Detail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const postData = location.state.data;
    const [data, setData] = useState({
        id: '',
        memberId: '',
        title: '',
        content: '',
        problem_number: 0, // problem_number는 숫자이므로 초기값을 0으로 설정
        problem_link: '',
        image: '', // rate는 숫자이므로 초기값을 0으로 설정
        hashtag: [], // hashtag는 객체 배열이므로 초기값을 빈 배열로 설정
        alarm: null, // alarm 필드를 추가하고 초기값을 null로 설정
        comments: [], // comments 필드를 추가하고 초기값을 빈 배열로 설정
        createdAt: '',
        updatedAt: '',
    });
    const [isOwner, setOwner] = useState(false);

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

    const deletePage = async (postId) => {
        const token = Cookies.get('accessToken');
        handleCancel();
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/post`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params:{
                    ids : postData.id
                }
            });
            navigate('/');
        } catch (error) {
            console.error('게시글 삭제에 실패했습니다.', error.message);
        }
    };

    const extractUserIdFromAccessToken = () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            return null;
        }
        try {
            const decodedToken = jwtDecode(accessToken);
            return decodedToken.userId;
        } catch (error) {
            console.error('액세스 토큰을 해독하는데 실패했습니다.', error);
        }
    };

    const getDetail = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/post/${postData.id}`);
            setData(result.data);
            const tempData = result.data;

            // 날짜 변환
            const date = new Date(tempData.alarm);
            const alarmDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            // 상태 업데이트
            setData({
                ...tempData,
                alarm: alarmDate,
            });

            return result.data;

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const memberId = extractUserIdFromAccessToken();
            const postInformation = await getDetail();
            if (memberId && memberId.toString() === postInformation.memberId.toString()) {
                setOwner(true);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="h-full max-w-3xl mx-auto">
                <div className="sm:h-48 px-2 h-auto w-full border-b-2">
                    <div className="w-full h-16 flex items-center">
                        <img src={data.image} alt="난이도" className="h-8 w-8 mr-1"/>
                        <div className="text-2xl sm:text-3xl font-semibold">{data.problem_number}</div>
                    </div>
                    <div
                        className="h-14 text-2xl sm:text-3xl ml-2 font-semibold pt-1 overflow-hidden text-ellipsis whitespace-nowrap">{data.title}</div>
                    <div className="flex w-full justify-between items-center">
                        <div className="flex sm:justify-between flex-wrap sm:flex-nowrap">
                            <div className="flex flex-wrap sm:flex-nowrap">
                                <div className="ml-2">알림 예정일 :</div>
                                <div className="ml-2 font-semibold">{data.alarm}</div>
                            </div>
                            <a href={data.problem_link} className="underline text-gray-500 ml-3 mt-2 sm:mt-0"
                               target="_blank"
                               rel="noopener noreferrer">문제링크</a>
                        </div>
                        <div className="font-extralight text-gray-600 text-sm">작성자 : {data.email}</div>
                    </div>
                    <div className="h-15 w-full mt-4 flex justify-between items-center">
                        <div className="flex flex-wrap">
                            {data.hashtag.map((item, index) => (
                                <div key={index}
                                     className="bg-gray-100 rounded-xl px-3 py-1 flex justify-center items-center mr-2 mb-2">
                                <button className="text-green-600 text-xs">{item.name}</button>
                                </div>
                            ))}
                        </div>
                        {isOwner ? <div className="pt-1 flex w-20 justify-between text-gray-400 text-sm">
                            <Link to={'/modify'} state={{detail: data}}>수정</Link> | <button
                            onClick={showModal}>삭제</button>
                        </div> : null}
                    </div>
                </div>
                <div className="pt-4 px-4 sm:px-2 w-full h-full">
                    {data.content ? <Viewer initialValue={data.content} /> : null}
                </div>
            </div>
            <Modal
                open={open}
                title="주의"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <Button onClick={() => deletePage(data.id)}>예</Button>
                        <Button onClick={handleOk}>아니오</Button>
                    </>
                )}
            >
                <div>정말로 삭제하시겠습니까?</div>
            </Modal>
            <Comment data = {data}/>
        </>
    );
};

export default Detail;