import React, { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Rate } from 'antd';
import { Button, Modal } from 'antd';

const Main = () =>{

    const navigate = useNavigate();

    {/** 모달 */}
    const [open, setOpen] = useState(false);

    const openModal = () => {
        setOpen(true);
        console.log('test')
      };

    const moveLogin = () =>{
        navigate('/login');
    }

    const closeModal = () => {
        setOpen(false)
        moveLogin();
    }

    const movePosting = () =>{
        const token = Cookies.get('token');
        if(!token){
            openModal();
        }
        else{
            navigate('/post');
        }
    }
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

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getData = async() =>{
        try {
            // 서버의 API 엔드포인트에 GET 요청을 보냅니다.
            const response = await axios.get('http://localhost:8080/post/get/all');
    
            // 응답에서 필요한 데이터를 추출하여 상태에 저장합니다.
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            // 요청이 완료되면 로딩 상태를 false로 변경합니다.
            setLoading(false);
        }
    }
    useEffect(()=>{
        getData();
    }, [])
    return(
        <>
            <div className = "w-full h-20 pl-1 mb-2">
                <div className = "flex w-full justify-between">
                    <div className = "text-gray-700 mb-2 text-lg">태그목록</div>
                    <button onClick={movePosting} className = "mr-2 border-b">글 작성하기</button>
                </div>

                <div className = "h-8 w-full flex justify-between items-center">
                    <div className = "flex">
                        {tag.map((item) => (
                            <div key = {item.id} className = "bg-gray-100 rounded-xl px-3 py-1 flex justify-center items-center mr-2">
                                <button className = "text-green-600">{item.tag}</button>
                            </div>
                            ))}
                        </div>
                    </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-3">
                {loading ? (
                    // 로딩 중일 경우 로딩 상태를 표시
                    <p>Loading...</p>
                ) : (data.map((item) => (
                    <Link to = "/detail" state = {{ data: item }} key={item.id} className="col-span-1 p-2 bg-white h-32 w-full border border-gray-400 rounded-xl hover:bg-gray-100">
                    
                    <div className = "flex justify-around items-center w-full h-10">
                        <div className = "font-normal text-xl mr-2">{item.problem_number}번</div>
                        <Rate className = "text-md" allowHalf defaultValue={item.rate} disabled/>
                    </div>
                    
                    <div className = "h-10 w-full pl-2">
                        <div className = "font-normal text-xl text-gray-700">{item.title}</div>
                    </div>
                    <div className = "h-8 w-full flex justify-between items-center">

                        <div className = "flex">
                        {item.Hashtags.map((item) => (
                            <div key = {item.id} className = "bg-gray-100 rounded-xl px-3 py-1 flex justify-center items-center mr-2">
                                <button className = "text-green-600">{item.name}</button>
                            </div>
                            ))}
                        </div>
                    </div>

                    </Link>
                )))}
            </div>
        
            <Modal
                open={open}
                title="알림사항"
                footer={(_, {}) => (
                <>
                    <Button onClick={closeModal}>확인</Button>
                </>
                )}
            >
            <div>로그인 후 이용해주세요</div>
            </Modal>
        </>
    )
}
export default Main;